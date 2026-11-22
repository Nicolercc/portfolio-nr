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

		// Navigation never depends on scrolling: Resume and Contact are reachable from the first screen.
		const navAtTopVisible = await desktop.locator('nav[aria-label="Primary"]').isVisible();
		assert(navAtTopVisible, "Primary nav must be visible at the top of the homepage.");
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
		assert(ctas.some((link) => link.text === "See the work" && link.href === "#universe"), "Missing See the work CTA pointing at the star map.");
		assert(ctas.some((link) => link.text?.startsWith("Download resume") && link.href === "/Nicole_Rodriguez_Resume.pdf"), "Missing resume CTA.");
		assert(ctas.length === 2, `Hero should expose exactly two primary actions, found ${ctas.length}.`);

		const sectionOrder = await desktop.evaluate(() =>
			[...document.querySelectorAll("main > *")]
				.map((node) => node.id || node.getAttribute("class") || node.tagName)
				.slice(0, 6),
		);
		assert(sectionOrder[0] === "landing", `Expected landing first, got ${sectionOrder[0]}.`);
		assert(sectionOrder[1] === "universe", `Expected the star map after the landing, got ${sectionOrder[1]}.`);
		assert(sectionOrder[2] === "work", `Expected work directly after the star map, got ${sectionOrder[2]}.`);

		const firstProject = await desktop.locator("#work article h3").first().textContent();
		assert(firstProject?.trim() === "Sano", `Expected Sano as first work item, got ${firstProject}.`);

		await desktop.goto(`${baseUrl}/projects/sano`, { waitUntil: "networkidle" });
		await expectVisibleText(desktop, "Sano");
		await expectVisibleText(
			desktop,
			"Solo designer and engineer. I designed and built Sano, then ran the accessibility audit, fixes, validation scripts and evidence captures for its critical journey. Two teammates tested the live site informally during development and reported issues, which I fixed.",
		);
		// The planned study must never read as completed research.
		await expectVisibleText(
			desktop,
			"Plan. Formal sessions not yet run. Teammates tested informally during development; that is not usability research.",
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

		// The nav fits on the smallest phones without scrolling inside itself.
		for (const width of [320, 390]) {
			const small = await browser.newPage({ viewport: { width, height: 700 } });
			for (const route of ["/", "/projects/sano"]) {
				await small.goto(`${baseUrl}${route}`, { waitUntil: "networkidle" });
				const clipped = await small.evaluate(() =>
					[...document.querySelectorAll('nav[aria-label="Primary"] *')].some((el) => el.scrollWidth > el.clientWidth + 1),
				);
				assert(!clipped, `${route} nav overflows at ${width}px.`);
			}
			await small.close();
		}

		// Every page ends with a way to reach out: the shared footer with email, resume and profiles.
		for (const route of ["/", "/projects", "/projects/sano", "/blog/i-was-taught-to-build", "/does-not-exist"]) {
			await desktop.goto(`${baseUrl}${route}`, { waitUntil: "networkidle" });
			const footer = desktop.locator("body > #root footer").last();
			assert((await footer.count()) > 0, `${route} is missing the shared footer.`);
			for (const name of ["Resume (PDF)", "LinkedIn", "GitHub", "Copy email"]) {
				const count = await footer.getByRole(name === "Copy email" ? "button" : "link", { name }).count();
				assert(count > 0, `${route} footer is missing "${name}".`);
			}
			assert((await desktop.locator('nav[aria-label="Primary"]').count()) === 1, `${route} should have exactly one primary nav.`);
		}

		// Copy email confirms visibly and through the live region.
		const copyContext = await browser.newContext({ viewport: { width: 1280, height: 900 } });
		await copyContext.grantPermissions(["clipboard-read", "clipboard-write"], { origin: baseUrl });
		const copyPage = await copyContext.newPage();
		await copyPage.goto(baseUrl, { waitUntil: "networkidle" });
		await copyPage.locator("#contact").getByRole("button", { name: "Copy email" }).click();
		await copyPage.locator("#contact").getByRole("button", { name: "Copied" }).waitFor({ timeout: 3000 });
		const announced = await copyPage.locator("#contact [role=status]").textContent();
		assert(announced?.includes("copied to clipboard"), "Copy email did not announce through the live region.");
		await copyContext.close();

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
