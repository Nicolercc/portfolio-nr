import { createServer } from "node:http";
import { existsSync, readFileSync, statSync } from "node:fs";
import { extname, join, normalize } from "node:path";
import { chromium } from "playwright";

// Behavior contract for the homepage star map. It runs against the built site
// (dist/) at desktop and phone widths. Each later task adds the assertions for
// the behavior it introduces, so this file is green at every commit.

const root = process.cwd();
const distDir = join(root, "dist");
const port = Number(process.env.STARMAP_PORT ?? 4181);
const baseUrl = `http://127.0.0.1:${port}`;
// CI renders WebGL in software; give the scene time to boot before any fallback.
const HOME = "/?starmapTimeout=20000";

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

function assert(condition, message) {
	if (!condition) throw new Error(message);
}

function serveDist() {
	assert(existsSync(distDir), "dist/ does not exist. Run npm run build first.");
	const server = createServer((request, response) => {
		const pathname = decodeURIComponent(new URL(request.url ?? "/", baseUrl).pathname);
		let filePath = normalize(join(distDir, pathname));
		if (!filePath.startsWith(distDir)) {
			response.writeHead(403);
			response.end("Forbidden");
			return;
		}
		if (!existsSync(filePath) || !statSync(filePath).isFile()) filePath = join(distDir, "index.html");
		response.writeHead(200, { "Content-Type": mimeTypes.get(extname(filePath)) ?? "application/octet-stream" });
		response.end(readFileSync(filePath));
	});
	return new Promise((resolve) => server.listen(port, "127.0.0.1", () => resolve(server)));
}

async function openMap(page) {
	await page.goto(`${baseUrl}${HOME}`, { waitUntil: "networkidle" });
	await page.locator("#universe").scrollIntoViewIfNeeded();
	await page.waitForSelector('#universe[data-mode="webgl"]', { timeout: 30000 });
	// Let the first frames place the labels.
	await page.waitForTimeout(600);
}

async function labelFor(page, name) {
	const label = page.locator(".star-label", { hasText: name }).first();
	await label.waitFor({ state: "visible" });
	return label;
}

// Star labels drift with their systems every frame, so a pointer click waits for a
// stable element that never settles. Select by keyboard instead, which also proves
// the stars are operable without a mouse.
async function activate(label) {
	await label.focus();
	await label.press("Enter");
}

async function assertPanelOpensAndCloses(page, viewport) {
	const label = await labelFor(page, "Sano");
	await activate(label);
	const panel = page.locator(".system-panel");
	await panel.waitFor({ state: "visible" });
	const title = (await panel.locator("h2, h3").first().textContent())?.trim();
	assert(title === "Sano", `${viewport}: panel should show Sano, got "${title}".`);
	assert((await label.getAttribute("aria-pressed")) === "true", `${viewport}: selected star should be aria-pressed.`);

	await page.keyboard.press("Escape");
	await panel.waitFor({ state: "detached" });
	const escFocus = await page.evaluate(() => document.activeElement?.textContent ?? "");
	assert(escFocus.includes("Sano"), `${viewport}: Escape should return focus to the Sano star, got "${escFocus.slice(0, 40)}".`);

	await activate(label);
	await panel.waitFor({ state: "visible" });
	await panel.getByRole("button", { name: /back to map/i }).click();
	await panel.waitFor({ state: "detached" });
	const backFocus = await page.evaluate(() => document.activeElement?.textContent ?? "");
	assert(backFocus.includes("Sano"), `${viewport}: "Back to map" should return focus to the Sano star.`);
}

async function assertReceiptToggles(page, viewport) {
	await activate(await labelFor(page, "Sano"));
	const button = page.locator(".system-panel .receipt-btn");
	await button.scrollIntoViewIfNeeded();
	assert((await button.getAttribute("aria-expanded")) === "false", `${viewport}: receipt should start closed.`);
	const slipId = await button.getAttribute("aria-controls");
	assert(slipId, `${viewport}: receipt button needs aria-controls.`);
	await button.click();
	assert((await button.getAttribute("aria-expanded")) === "true", `${viewport}: receipt should open.`);
	assert(await page.locator(`#${slipId}`).isVisible(), `${viewport}: receipt slip should be visible when open.`);
	await button.click();
	assert((await button.getAttribute("aria-expanded")) === "false", `${viewport}: receipt should close.`);
	assert(!(await page.locator(`#${slipId}`).isVisible()), `${viewport}: receipt slip should hide when closed.`);
}

async function main() {
	const server = await serveDist();
	const browser = await chromium.launch({ headless: true });
	try {
		for (const [name, viewport] of [
			["desktop", { width: 1440, height: 900 }],
			["phone", { width: 390, height: 844 }],
		]) {
			const page = await browser.newPage({ viewport });
			await openMap(page);
			await assertPanelOpensAndCloses(page, name);
			await assertReceiptToggles(page, name);
			await page.close();
		}
	} finally {
		await browser.close();
		server.close();
	}
	console.log("Star map verification passed (desktop 1440 and phone 390).");
}

main().catch((error) => {
	console.error(error);
	process.exit(1);
});
