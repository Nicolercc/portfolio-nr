import { createServer } from "node:http";
import { existsSync, readFileSync, statSync } from "node:fs";
import { extname, join, normalize } from "node:path";
import { chromium } from "playwright";

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
	[".jpeg", "image/jpeg"],
	[".webp", "image/webp"],
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

async function main() {
	const server = await serveDist();
	const browser = await chromium.launch({ headless: true });

	try {
		const desktop = await browser.newPage({
			viewport: { width: 1440, height: 1000 },
			deviceScaleFactor: 1,
		});
		await desktop.goto(baseUrl, { waitUntil: "networkidle" });

		const navAtTopVisible = await desktop.locator("nav").isVisible();
		assert(!navAtTopVisible, "Homepage nav should stay hidden until the user scrolls.");

		await desktop.evaluate(() => window.scrollTo(0, window.innerHeight * 0.6));
		await desktop.locator("nav").waitFor({ state: "visible", timeout: 5000 });
		for (const label of ["Work", "Resume", "GitHub", "Contact"]) {
			await expectVisibleText(desktop, label);
		}
		await desktop.evaluate(() => window.scrollTo(0, 0));

		const ctas = await desktop.locator(".landing__actions a").evaluateAll((links) =>
			links.map((link) => ({
				text: link.textContent?.trim(),
				href: link.getAttribute("href"),
			})),
		);
		assert(ctas.some((link) => link.text === "View selected work" && link.href === "#work"), "Missing View selected work CTA.");
		assert(ctas.some((link) => link.text?.startsWith("Download resume") && link.href === "/Nicole_Rodriguez_Resume.pdf"), "Missing resume CTA.");
		assert(ctas.length === 2, `Hero should expose exactly two primary actions, found ${ctas.length}.`);

		const sectionOrder = await desktop.evaluate(() =>
			[...document.querySelectorAll("main > *")]
				.map((node) => node.id || node.getAttribute("class") || node.tagName)
				.slice(0, 6),
		);
		assert(sectionOrder[0] === "landing", `Expected landing first, got ${sectionOrder[0]}.`);
		assert(sectionOrder[1] === "hero", `Expected capabilities section second, got ${sectionOrder[1]}.`);
		assert(sectionOrder[2] === "work", `Expected work third, got ${sectionOrder[2]}.`);

		const firstProject = await desktop.locator("#work article h3").first().textContent();
		assert(firstProject?.trim() === "Sano", `Expected Sano as first work item, got ${firstProject}.`);

		await desktop.goto(`${baseUrl}/projects/sano`, { waitUntil: "networkidle" });
		await expectVisibleText(desktop, "Sano");
		await expectVisibleText(
			desktop,
			"I built the product audit, accessibility fixes, validation scripts, evidence captures, and case-study writeup for the critical Sano journey.",
		);
		const sanoLive = await desktop.locator('a[href="https://sano-nine.vercel.app/"]').count();
		assert(sanoLive > 0, "Sano case study should expose the live site link.");

		await desktop.goto(`${baseUrl}/projects/tripcanvas`, { waitUntil: "networkidle" });
		await expectVisibleText(desktop, "TripCanvas");
		await expectVisibleText(
			desktop,
			"Curated demo trip (Spain, summer 2026) stored in the browser; no live providers or accounts yet",
		);
		const tripCanvasLive = await desktop.locator('a[href^="https://"][href*="tripcanvas"]').count();
		assert(tripCanvasLive === 0, "TripCanvas must not expose an unsupported live product CTA.");

		await desktop.goto(`${baseUrl}/projects/carbonshift`, { waitUntil: "networkidle" });
		const carbonText = (await desktop.locator("body").innerText()).toLowerCase();
		assert(
			carbonText.includes("page not found"),
			"CarbonShift should be unpublished while it is removed from selected work.",
		);

		const mobile = await browser.newPage({
			viewport: { width: 390, height: 900 },
			deviceScaleFactor: 2,
		});
		await mobile.goto(baseUrl, { waitUntil: "networkidle" });
		await mobile.evaluate(() => window.scrollTo(0, window.innerHeight * 0.6));
		await mobile.locator("nav").waitFor({ state: "visible", timeout: 5000 });
		const viewportWidth = await mobile.evaluate(() => window.innerWidth);
		const navBox = await mobile.locator("nav").boundingBox();
		assert(navBox, "Mobile nav is missing.");
		assert(navBox.x >= -1 && navBox.x + navBox.width <= viewportWidth + 1, "Mobile nav overflows the viewport.");
		for (const label of ["Work", "Resume", "GitHub"]) {
			await expectVisibleText(mobile, label);
		}

		console.log("Information architecture verification passed.");
	} finally {
		await browser.close();
		await new Promise((resolve) => server.close(resolve));
	}
}

async function expectVisibleText(page, text) {
	// Responsive variants of the same label can coexist; require a visible one.
	const locator = page.getByText(text, { exact: true }).filter({ visible: true }).first();
	await locator.waitFor({ state: "visible", timeout: 5000 });
}

main().catch((error) => {
	console.error(error);
	process.exit(1);
});
