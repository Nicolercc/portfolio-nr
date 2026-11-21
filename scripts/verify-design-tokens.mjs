import { createServer } from "node:http";
import { existsSync, readFileSync, statSync } from "node:fs";
import { extname, join, normalize } from "node:path";
import { chromium } from "playwright";

// Design-system guardrails the axe run does not cover on its own:
// - no readable text under 14px (the type scale's floor)
// - every readable text node meets WCAG contrast against what it actually sits on
//   (4.5:1, or 3:1 for large text), with opacity and translucent fills composited
// - no horizontal scroll at phone, tablet and desktop widths, including 640px
//   (200% zoom of 1280) and 320px (400% zoom of 1280, WCAG 1.4.10 reflow)
const ROUTES = [
	"/",
	"/projects",
	"/projects/sano",
	"/projects/code4kidz",
	"/projects/elite-global",
	"/projects/ruvia",
	"/projects/tripcanvas",
	"/blog",
	"/blog/i-was-taught-to-build",
	"/does-not-exist",
];
const WIDTHS = [320, 390, 640, 768, 1440];
const MIN_FONT_PX = 14;
const PAGE_BACKGROUND = [13, 13, 13];

const root = process.cwd();
const distDir = join(root, "dist");
const port = Number(process.env.PORT ?? 4178);
const baseUrl = `http://127.0.0.1:${port}`;

const mimeTypes = new Map([
	[".html", "text/html; charset=utf-8"],
	[".js", "text/javascript; charset=utf-8"],
	[".css", "text/css; charset=utf-8"],
	[".svg", "image/svg+xml"],
	[".png", "image/png"],
	[".jpg", "image/jpeg"],
	[".webp", "image/webp"],
	[".pdf", "application/pdf"],
]);

function serveDist() {
	if (!existsSync(distDir)) throw new Error("dist/ does not exist. Run npm run build first.");
	const server = createServer((request, response) => {
		const pathname = decodeURIComponent(new URL(request.url ?? "/", baseUrl).pathname);
		let filePath = normalize(join(distDir, pathname));
		if (!filePath.startsWith(distDir)) {
			response.writeHead(403);
			response.end();
			return;
		}
		if (existsSync(join(filePath, "index.html"))) filePath = join(filePath, "index.html");
		if (!existsSync(filePath) || !statSync(filePath).isFile()) filePath = join(distDir, "index.html");
		response.writeHead(200, { "Content-Type": mimeTypes.get(extname(filePath)) ?? "application/octet-stream" });
		response.end(readFileSync(filePath));
	});
	return new Promise((resolve) => server.listen(port, "127.0.0.1", () => resolve(server)));
}

// Runs in the page: returns every readable text element that breaks the floor or contrast rules.
function auditText({ minFontPx, pageBackground }) {
	// Computed colors come back as rgb(), oklab() or color-mix results; let the canvas resolve them.
	const ctx = document.createElement("canvas").getContext("2d", { willReadFrequently: true });
	const parse = (value) => {
		if (!value || value === "transparent") return null;
		ctx.clearRect(0, 0, 1, 1);
		ctx.fillStyle = "rgba(0, 0, 0, 0)";
		ctx.fillStyle = value;
		ctx.fillRect(0, 0, 1, 1);
		const [r, g, b, a] = ctx.getImageData(0, 0, 1, 1).data;
		return [r, g, b, a / 255];
	};
	const over = (top, bottom) => top.slice(0, 3).map((c, i) => c * top[3] + bottom[i] * (1 - top[3]));
	const luminance = (rgb) => {
		const [r, g, b] = rgb.map((v) => {
			const c = v / 255;
			return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
		});
		return 0.2126 * r + 0.7152 * g + 0.0722 * b;
	};
	const ratio = (a, b) => {
		const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
		return (hi + 0.05) / (lo + 0.05);
	};
	const hidden = (el) =>
		el.closest('[aria-hidden="true"], [data-a11y-decorative], .sr-only, svg, noscript, script, style');

	const backgroundOf = (el) => {
		const layers = [];
		for (let node = el; node && node !== document.documentElement; node = node.parentElement) {
			const color = parse(getComputedStyle(node).backgroundColor);
			if (color && color[3] > 0) layers.push(color);
			if (color && color[3] >= 1) break;
		}
		let base = pageBackground;
		for (const layer of layers.reverse()) base = over(layer, base);
		return base;
	};
	const opacityOf = (el) => {
		let value = 1;
		for (let node = el; node; node = node.parentElement) value *= Number(getComputedStyle(node).opacity);
		return value;
	};

	const failures = [];
	for (const el of document.querySelectorAll("body *")) {
		if (![...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim())) continue;
		if (hidden(el)) continue;
		const style = getComputedStyle(el);
		if (style.display === "none" || style.visibility === "hidden") continue;
		const rect = el.getBoundingClientRect();
		if (rect.width === 0 || rect.height === 0) continue;
		const opacity = opacityOf(el);
		if (opacity < 0.05) continue;

		const text = el.textContent.trim().replace(/\s+/g, " ").slice(0, 50);
		const size = parseFloat(style.fontSize);
		if (size < minFontPx) failures.push(`font ${size}px < ${minFontPx}px: "${text}"`);

		const fg = parse(style.color);
		if (!fg) continue;
		const bg = backgroundOf(el);
		const shown = over([fg[0], fg[1], fg[2], fg[3] * opacity], bg);
		const large = size >= 24 || (size >= 18.66 && Number(style.fontWeight) >= 700);
		const needed = large ? 3 : 4.5;
		const got = ratio(shown, bg);
		if (got < needed) failures.push(`contrast ${got.toFixed(2)}:1 < ${needed}:1: "${text}"`);
	}
	return failures;
}

async function main() {
	const server = await serveDist();
	const browser = await chromium.launch({ headless: true });
	const problems = [];
	try {
		for (const width of WIDTHS) {
			// Reduced motion renders every reveal in its final state, so we audit what readers see.
			const page = await browser.newPage({ viewport: { width, height: 900 }, reducedMotion: "reduce" });
			for (const route of ROUTES) {
				await page.goto(`${baseUrl}${route}`, { waitUntil: "networkidle" });
				// Let route and section fade-ins settle so we measure the final rendered state.
				await page.waitForFunction(
					() => [...document.querySelectorAll("main, main > *")].every((el) => getComputedStyle(el).opacity === "1"),
					null,
					{ timeout: 5000 },
				).catch(() => {});
				await page.waitForTimeout(400);
				const overflow = await page.evaluate(
					() => Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - window.innerWidth,
				);
				if (overflow > 1) problems.push(`${route} @${width}px: scrolls sideways by ${overflow}px`);
				const failures = await page.evaluate(auditText, { minFontPx: MIN_FONT_PX, pageBackground: PAGE_BACKGROUND });
				for (const failure of new Set(failures)) problems.push(`${route} @${width}px: ${failure}`);
			}
			await page.close();
		}
	} finally {
		await browser.close();
		server.close();
	}

	if (problems.length > 0) {
		console.error(`Design token verification failed (${problems.length}):`);
		for (const problem of problems.slice(0, 80)) console.error(`  - ${problem}`);
		if (problems.length > 80) console.error(`  ... and ${problems.length - 80} more`);
		process.exit(1);
	}
	console.log(
		`Design token verification passed: ${ROUTES.length} routes x ${WIDTHS.length} widths, 14px floor, WCAG contrast, no sideways scroll.`,
	);
}

main().catch((error) => {
	console.error(error);
	process.exit(1);
});
