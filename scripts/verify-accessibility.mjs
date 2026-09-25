import { createServer } from "node:http";
import { existsSync, readFileSync, statSync } from "node:fs";
import { createRequire } from "node:module";
import { extname, join, normalize } from "node:path";
import { chromium } from "playwright";

const require = createRequire(import.meta.url);
const axeSource = readFileSync(require.resolve("axe-core/axe.min.js"), "utf8");

// axe covers machine-checkable WCAG 2.0/2.1/2.2 A and AA rules only. It does not
// prove screen-reader usability, reading order, meaningful alt text, zoom/reflow
// at 400%, or cognitive clarity — those stay in the manual checklist.
const AXE_TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];
// Purely decorative text (WCAG 1.4.3 exempts it) is marked explicitly in the markup.
const AXE_EXCLUDE = [["[data-a11y-decorative]"]];
const AXE_ROUTES = [
	"/",
	"/projects",
	"/projects/sano",
	"/projects/code4kidz",
	"/projects/tripcanvas",
	"/blog",
	"/blog/i-was-taught-to-build",
	"/does-not-exist",
];

const root = process.cwd();
const distDir = join(root, "dist");
const port = Number(process.env.PORT ?? 4179);
const baseUrl = `http://127.0.0.1:${port}`;

const mimeTypes = new Map([
	[".html", "text/html; charset=utf-8"],
	[".js", "text/javascript; charset=utf-8"],
	[".css", "text/css; charset=utf-8"],
	[".svg", "image/svg+xml"],
	[".png", "image/png"],
	[".jpg", "image/jpeg"],
	[".jpeg", "image/jpeg"],
	[".webp", "image/webp"],
	[".mov", "video/quicktime"],
	[".pdf", "application/pdf"],
]);

function assert(condition, message) {
	if (!condition) {
		throw new Error(message);
	}
}

function serveDist() {
	assert(existsSync(distDir), "dist/ does not exist. Run npm run build first.");

	const server = createServer((request, response) => {
		const rawUrl = new URL(request.url ?? "/", baseUrl);
		const pathname = decodeURIComponent(rawUrl.pathname);
		let filePath = normalize(join(distDir, pathname));

		if (!filePath.startsWith(distDir)) {
			response.writeHead(403);
			response.end("Forbidden");
			return;
		}

		if (!existsSync(filePath) || !statSync(filePath).isFile()) {
			filePath = join(distDir, "index.html");
		}

		const ext = extname(filePath);
		response.writeHead(200, {
			"Content-Type": mimeTypes.get(ext) ?? "application/octet-stream",
		});
		response.end(readFileSync(filePath));
	});

	return new Promise((resolve) => {
		server.listen(port, "127.0.0.1", () => resolve(server));
	});
}

async function assertNoHorizontalOverflow(page, route) {
	await page.goto(`${baseUrl}${route}`, { waitUntil: "networkidle" });
	const sizes = await page.evaluate(() => ({
		innerWidth: window.innerWidth,
		scrollWidth: document.documentElement.scrollWidth,
		bodyScrollWidth: document.body.scrollWidth,
	}));
	assert(
		Math.max(sizes.scrollWidth, sizes.bodyScrollWidth) <= sizes.innerWidth + 1,
		`${route} overflows horizontally at ${sizes.innerWidth}px.`,
	);
}

async function scrollThrough(page) {
	// Trigger scroll-linked reveals so axe sees content in its settled state.
	await page.evaluate(async () => {
		for (let y = 0; y < document.body.scrollHeight; y += 400) {
			window.scrollTo(0, y);
			await new Promise((resolve) => setTimeout(resolve, 40));
		}
		window.scrollTo(0, 0);
	});
	await page.waitForTimeout(300);
}

async function runAxe(page, route) {
	await page.goto(`${baseUrl}${route}`, { waitUntil: "networkidle" });
	await scrollThrough(page);
	await page.addScriptTag({ content: axeSource });
	const violations = await page.evaluate(
		async ({ tags, exclude }) => {
			const result = await window.axe.run(
				{ exclude },
				{ runOnly: { type: "tag", values: tags } },
			);
			return result.violations.map((violation) => ({
				id: violation.id,
				impact: violation.impact,
				targets: violation.nodes.slice(0, 5).map((node) => node.target.join(" ")),
			}));
		},
		{ tags: AXE_TAGS, exclude: AXE_EXCLUDE },
	);
	return violations.map(
		(violation) =>
			`${route} [${violation.impact}] ${violation.id}: ${violation.targets.join(", ")}`,
	);
}

async function main() {
	const server = await serveDist();
	const browser = await chromium.launch({ headless: true });

	try {
		const desktop = await browser.newPage({
			viewport: { width: 1440, height: 1000 },
			deviceScaleFactor: 1,
		});

		await desktop.goto(baseUrl, { waitUntil: "networkidle" });
		await desktop.keyboard.press("Tab");
		const firstFocusText = await desktop.evaluate(() => document.activeElement?.textContent?.trim());
		assert(firstFocusText === "Skip to content", "Skip link should be the first keyboard target.");

		await desktop.keyboard.press("Enter");
		const activeId = await desktop.evaluate(() => document.activeElement?.id);
		assert(activeId === "main-content", "Skip link should move focus to main content.");

		await desktop.goto(baseUrl, { waitUntil: "networkidle" });
		await desktop.locator('a[href="/projects/sano"]').first().click();
		await desktop.waitForFunction(() => document.activeElement?.matches("[data-route-heading]"));
		const focusedHeading = await desktop.evaluate(() => document.activeElement?.textContent?.trim());
		assert(focusedHeading === "Sano", "Route change should focus the Sano page heading.");

		const reduced = await browser.newPage({
			viewport: { width: 1280, height: 900 },
			deviceScaleFactor: 1,
			reducedMotion: "reduce",
		});
		await reduced.goto(baseUrl, { waitUntil: "networkidle" });
		const reducedMotionState = await reduced.evaluate(() => {
			const nebula = document.querySelector(".landing__nebula");
			const marquee = document.querySelector(".motion-safe\\:animate-marquee");
			return {
				matches: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
				nebulaAnimation: nebula ? getComputedStyle(nebula).animationName : "",
				marqueeAnimation: marquee ? getComputedStyle(marquee).animationName : "",
			};
		});
		assert(reducedMotionState.matches, "Reduced-motion media query should be emulated.");
		assert(
			reducedMotionState.nebulaAnimation === "none",
			"Landing nebula animation should be disabled for reduced motion.",
		);
		assert(
			reducedMotionState.marqueeAnimation === "none",
			"Marquee animation should be disabled for reduced motion.",
		);

		const forcedColors = await browser.newPage({
			viewport: { width: 1280, height: 900 },
			forcedColors: "active",
		});
		await forcedColors.goto(`${baseUrl}/projects`, { waitUntil: "networkidle" });
		await forcedColors.keyboard.press("Tab");
		const forcedColorState = await forcedColors.evaluate(() => ({
			matches: window.matchMedia("(forced-colors: active)").matches,
			activeTag: document.activeElement?.tagName,
		}));
		assert(forcedColorState.matches, "Forced-colors media query should be emulated.");
		assert(forcedColorState.activeTag !== "BODY", "Keyboard focus should remain visible in forced colors.");

		const mobile = await browser.newPage({
			viewport: { width: 320, height: 900 },
			deviceScaleFactor: 2,
		});
		await assertNoHorizontalOverflow(mobile, "/");
		await assertNoHorizontalOverflow(mobile, "/projects/sano");
		await assertNoHorizontalOverflow(mobile, "/projects/tripcanvas");

		const routes = ["/projects", "/projects/sano", "/projects/tripcanvas", "/blog"];
		for (const route of routes) {
			await desktop.goto(`${baseUrl}${route}`, { waitUntil: "networkidle" });
			const headingCount = await desktop.locator("[data-route-heading]").count();
			assert(headingCount > 0, `${route} should expose a route heading for focus management.`);
		}

		// Experience entries must stay readable after scrolling past them.
		await desktop.goto(baseUrl, { waitUntil: "networkidle" });
		await scrollThrough(desktop);
		await desktop.waitForTimeout(1200);
		const hiddenEntries = await desktop.evaluate(() =>
			[...document.querySelectorAll("h3")]
				.filter((heading) => /POPSUGAR|Pursuit|Independent Developer/.test(heading.textContent ?? ""))
				.filter((heading) => {
					let node = heading;
					while (node) {
						if (Number(getComputedStyle(node).opacity) < 0.5) return true;
						node = node.parentElement;
					}
					return false;
				}).length,
		);
		assert(hiddenEntries === 0, "Experience entries fade back out after leaving the viewport.");

		// Primary navigation keeps About and Contact on phones once it appears.
		const phoneNav = await browser.newPage({ viewport: { width: 390, height: 844 } });
		await phoneNav.goto(baseUrl, { waitUntil: "networkidle" });
		await phoneNav.evaluate(() => window.scrollTo(0, window.innerHeight));
		await phoneNav.waitForTimeout(800);
		for (const name of ["Work", "About", "Resume", "Contact"]) {
			const visible = await phoneNav.locator("nav").getByText(name, { exact: true }).first().isVisible();
			assert(visible, `Mobile navigation should show ${name}.`);
		}

		const axeViolations = [];
		for (const viewport of [
			{ width: 1440, height: 900 },
			{ width: 390, height: 844 },
		]) {
			const axePage = await browser.newPage({ viewport, reducedMotion: "reduce" });
			for (const route of AXE_ROUTES) {
				const found = await runAxe(axePage, route);
				axeViolations.push(...found.map((line) => `${viewport.width}px ${line}`));
			}
			await axePage.close();
		}
		assert(
			axeViolations.length === 0,
			`axe found WCAG A/AA violations:\n${axeViolations.join("\n")}`,
		);

		console.log("Accessibility and motion verification passed (including axe on desktop and mobile).");
	} finally {
		await browser.close();
		await new Promise((resolve) => server.close(resolve));
	}
}

main().catch((error) => {
	console.error(error);
	process.exit(1);
});
