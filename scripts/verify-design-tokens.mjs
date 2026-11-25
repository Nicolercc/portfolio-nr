import { getContentRoutes } from "./route-data.mjs";
import { createServer } from "node:http";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { extname, join, normalize } from "node:path";
import { chromium } from "playwright";
import sharp from "sharp";

// Design-system guardrails the axe run does not cover on its own:
// - no readable text under 14px (the type scale's floor)
// - every readable text node meets WCAG contrast against what it actually sits on
//   (4.5:1, or 3:1 for large text), with opacity and translucent fills composited
// - no horizontal scroll at phone, tablet and desktop widths, including 640px
//   (200% zoom of 1280) and 320px (400% zoom of 1280, WCAG 1.4.10 reflow)
const ROUTES = ["/", ...getContentRoutes(), "/does-not-exist"];
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
		// Small text uses no letter-spacing, or the label's 0.12em.
		if (size <= 14 && style.letterSpacing !== "normal") {
			const spacing = parseFloat(style.letterSpacing);
			if (Math.abs(spacing) > 0.05 && Math.abs(spacing - size * 0.12) > 0.1) {
				failures.push(`letter-spacing ${style.letterSpacing} on ${size}px text: "${text}"`);
			}
		}

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

// Sideways scroll, and text whose box is cut off by an ancestor that clips overflow.
function auditLayout() {
	const issues = [];
	const overflow = Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - window.innerWidth;
	if (overflow > 1) issues.push(`scrolls sideways by ${overflow}px`);
	for (const el of document.querySelectorAll("h1, h2, h3, p, a, button, li, dd, dt")) {
		if (el.closest('[aria-hidden="true"], [data-a11y-decorative], .sr-only, [inert]')) continue;
		const style = getComputedStyle(el);
		if (style.display === "none" || style.visibility === "hidden") continue;
		if (el.scrollWidth > el.clientWidth + 2 && style.overflowX !== "visible" && style.textOverflow !== "ellipsis") {
			issues.push(`text clipped inside "${el.textContent.trim().slice(0, 40)}"`);
		}
	}
	return [...new Set(issues)];
}

function relativeLuminance(rgb) {
	const linear = rgb.map((value) => {
		const srgb = value / 255;
		return srgb <= 0.04045 ? srgb / 12.92 : ((srgb + 0.055) / 1.055) ** 2.4;
	});
	return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
}

async function auditCanvasPixels(page, selector) {
	const areas = await page.locator(selector).evaluate((section) => {
		const parser = document.createElement("canvas").getContext("2d");
		const walker = document.createTreeWalker(section, NodeFilter.SHOW_TEXT);
		const areas = [];
		for (let node = walker.nextNode(); node; node = walker.nextNode()) {
			const text = node.textContent.trim();
			const parent = node.parentElement;
			if (!text || parent.closest('[aria-hidden="true"], .sr-only, [hidden], [inert]')) continue;
			const style = getComputedStyle(parent);
			if (style.visibility !== "visible" || Number(style.opacity) < 0.05) continue;
			parser.clearRect(0, 0, 1, 1);
			parser.fillStyle = style.color;
			parser.fillRect(0, 0, 1, 1);
			const foreground = Array.from(parser.getImageData(0, 0, 1, 1).data);
			const range = document.createRange();
			range.selectNodeContents(node);
			for (const { left, top, right, bottom } of range.getClientRects()) {
				const x0 = Math.max(0, Math.ceil(left));
				const y0 = Math.max(0, Math.ceil(top));
				const x1 = Math.min(innerWidth, Math.floor(right));
				const y1 = Math.min(innerHeight, Math.floor(bottom));
				if (x0 < x1 && y0 < y1) areas.push({ text, foreground, x0, y0, x1, y1 });
			}
		}
		return areas;
	});
	if (!areas.length) return [`No visible text sampled in ${selector}`];
	const { data, info } = await sharp(await page.screenshot({
		style: `${selector} * { -webkit-text-fill-color: transparent !important; text-shadow: none !important; }`,
		scale: "css",
	})).removeAlpha().raw().toBuffer({ resolveWithObject: true });
	const failures = new Map();
	for (const { text, foreground, x0, y0, x1, y1 } of areas) {
		let lowest = Infinity;
		for (let y = y0; y < y1; y++) {
			for (let x = x0; x < x1; x++) {
				const offset = (y * info.width + x) * info.channels;
				const bg = Array.from(data.subarray(offset, offset + 3));
				const fg = bg.map((value, i) => (foreground[i] * foreground[3] + value * (255 - foreground[3])) / 255);
				const first = relativeLuminance(fg) + 0.05;
				const second = relativeLuminance(bg) + 0.05;
				lowest = Math.min(lowest, Math.max(first / second, second / first));
			}
		}
		if (lowest < 4.5) failures.set(text, Math.min(lowest, failures.get(text) ?? Infinity));
	}
	return [...failures].map(([text, contrast]) => `canvas contrast ${contrast.toFixed(2)}:1 < 4.5:1: "${text}"`);
}

// Cohesion system (T9): one easing, three durations, three radii. Scans source so a
// stray duration or radius fails before it reaches the page.
function* sourceFiles(dir) {
	for (const entry of readdirSync(dir, { withFileTypes: true })) {
		const path = join(dir, entry.name);
		if (entry.isDirectory()) yield* sourceFiles(path);
		else if (/\.(css|tsx?)$/.test(entry.name)) yield path;
	}
}

export function auditMotionAndShape(files = [...sourceFiles(join(root, "src"))]) {
	const problems = [];
	const DURATIONS_CSS = /^(var\(--dur-(fast|base|slow)\)|0\.001ms|0s|60s)$/;
	const FRAMER_DURATIONS = new Set(["0", "0.001", "0.15", "0.3", "0.7"]);
	for (const file of files) {
		const text = readFileSync(file, "utf8");
		const rel = file.slice(root.length + 1);
		const at = (index) => `${rel}:${text.slice(0, index).split("\n").length}`;
		if (file.endsWith(".css")) {
			for (const match of text.matchAll(/(?:transition|animation)(?:-duration|-timing-function)?\s*:([^;]+);/g)) {
				const value = match[1];
				for (const time of value.match(/(?<![\w.-])\d*\.?\d+m?s\b|var\(--dur-[a-z]+\)/g) ?? []) {
					if (!DURATIONS_CSS.test(time)) problems.push(`${at(match.index)} duration ${time} is not a motion token`);
				}
				for (const ease of value.match(/cubic-bezier\([^)]*\)|(?<![\w-])ease(?:-in-out|-in|-out)?\b|steps\([^)]*\)/g) ?? []) {
					problems.push(`${at(match.index)} easing ${ease} is not var(--ease-out)`);
				}
			}
			for (const match of text.matchAll(/border-radius:\s*([^;]+);/g)) {
				const parts = match[1].trim().split(/\s+/);
				if (!parts.every((part) => part === "0" || /^var\(--radius-(control|card|pill)\)$/.test(part))) {
					problems.push(`${at(match.index)} border-radius ${match[1].trim()} is not a radius token`);
				}
			}
		} else {
			for (const match of text.matchAll(/(?<![\w-])duration-(\[[^\]]+\]|\d+)/g)) {
				if (!["150", "300", "700"].includes(match[1])) problems.push(`${at(match.index)} duration-${match[1]} is not 150, 300 or 700`);
			}
			for (const match of text.matchAll(/(?<![\w-])ease-(in-out|in|\[[^\]]+\])/g)) {
				problems.push(`${at(match.index)} ease-${match[1]} is not ease-out`);
			}
			for (const match of text.matchAll(/\bduration:\s*([\d.]+)/g)) {
				if (!FRAMER_DURATIONS.has(match[1])) problems.push(`${at(match.index)} duration: ${match[1]} is not 0.15, 0.3 or 0.7`);
			}
			for (const match of text.matchAll(/\bease:\s*(\[[^\]]*\]|"[a-zA-Z]+")/g)) {
				const value = match[1].replace(/\s/g, "");
				if (value !== "[0.16,1,0.3,1]" && value !== '"linear"') problems.push(`${at(match.index)} ease ${match[1]} is not the shared easing`);
			}
			for (const match of text.matchAll(/(?<![\w-])rounded(?:-(?:t|b|l|r|tl|tr|bl|br))?-(sm|lg|xl|3xl|\[[^\]]+\])(?![\w-])/g)) {
				problems.push(`${at(match.index)} rounded-${match[1]} is not 6px, 16px or a pill`);
			}
			for (const match of text.matchAll(/(?<![\w-])rounded(?:-(?:t|b|l|r|tl|tr|bl|br))?(?=["\s`])/g)) {
				problems.push(`${at(match.index)} plain rounded is not a radius token`);
			}
		}
	}
	return problems;
}

async function main() {
	const problems = [...auditMotionAndShape()];
	if (process.env.DESIGN_SOURCE_ONLY) {
		for (const problem of problems) console.error(`  - ${problem}`);
		process.exit(problems.length ? 1 : 0);
	}
	const server = await serveDist();
	const browser = await chromium.launch({ headless: true });
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
			if (width === 390 || width === 1440) {
				for (const [hash, target] of [["", "#landing"], ["#universe", "#universe"]]) {
					await page.goto(`${baseUrl}/?starmapTimeout=20000${hash}`, { waitUntil: "networkidle" });
					await page.locator(target).evaluate((section) => {
						window.scrollTo(0, section.offsetTop);
					});
					await page.evaluate(() => document.fonts.ready);
					if (hash) {
						await page.waitForFunction(() => document.querySelector("#universe")?.dataset.mode !== "loading");
					}
					for (const failure of await auditCanvasPixels(page, target)) problems.push(`/${hash} @${width}px: ${failure}`);
				}
			}
			await page.close();
		}
		// Landscape phone and 200% text: nothing clips, overlaps or scrolls sideways.
		for (const [label, viewport, zoom] of [["844x390", { width: 844, height: 390 }, 1], ["390 @200% text", { width: 390, height: 844 }, 2]]) {
			const page = await browser.newPage({ viewport, reducedMotion: "reduce" });
			for (const route of ROUTES) {
				await page.goto(`${baseUrl}${route}`, { waitUntil: "networkidle" });
				if (zoom !== 1) await page.addStyleTag({ content: `html { font-size: ${zoom * 100}% !important; }` });
				await page.evaluate(() => document.fonts.ready);
				await page.waitForTimeout(300);
				for (const issue of await page.evaluate(auditLayout)) problems.push(`${route} @${label}: ${issue}`);
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
