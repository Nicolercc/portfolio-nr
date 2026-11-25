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

async function openMap(page, viewport) {
	await page.goto(`${baseUrl}${HOME}`, { waitUntil: "networkidle" });
	await page.locator("#universe").scrollIntoViewIfNeeded();
	const map = page.locator("#universe");
	await page.waitForFunction(() => {
		const scene = document.querySelector("#universe")?.dataset.scene;
		return scene === "ready" || scene === "unavailable";
	}, null, { timeout: 30000 });
	await page.waitForSelector('#universe[data-mode="webgl"]', { timeout: 3000 }).catch(async (error) => {
		const state = await map.evaluate(({ dataset }) => ({ ...dataset }));
		throw new Error(`${viewport}: expected WebGL mode, got ${JSON.stringify(state)}`, { cause: error });
	});
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

async function assertKeyboardOrder(page) {
	const group = page.locator(".starmap__labels");
	const current = group.locator('.star-label[tabindex="0"]');
	assert(await current.count() === 1, "The galaxy should have one tab stop.");
	await current.focus();
	const original = await page.evaluate(() => document.activeElement.textContent);
	await page.keyboard.press("ArrowRight");
	assert(await page.evaluate(() => document.activeElement.textContent) !== original, "ArrowRight should focus another star.");
	assert(await group.locator('[data-offscreen="true"][tabindex="0"]').count() === 0, "Off-screen stars must not be tabbable.");
}

async function assertContextLoss(page) {
	const panel = page.locator(".system-panel");
	const focus = panel.getByRole("button", { name: "Receipt" });
	await focus.focus();
	await page.locator(".starmap__canvas").evaluate((canvas) => {
		const context = canvas.getContext("webgl2");
		const lose = context?.getExtension("WEBGL_lose_context");
		if (!lose) throw new Error("WEBGL_lose_context is required for this check.");
		lose.loseContext();
	});
	await page.waitForSelector('#universe[data-mode="static"]');
	assert(await panel.getByRole("heading", { name: "Sano" }).isVisible(), "Context loss should preserve the open project.");
	assert(await focus.evaluate((button) => button === document.activeElement), "Context loss should preserve panel focus.");
	await page.keyboard.press("Escape");
	assert(await page.evaluate(() => document.activeElement.textContent.includes("Sano")), "Closing after context loss should focus the list entry.");
}

async function assertSlowFallback(browser, engage) {
	const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
	let release;
	const ready = new Promise((resolve) => { release = resolve; });
	await page.route("**/StarMap-*.js", async (route) => {
		await ready;
		await route.continue();
	});
	try {
		await page.goto(`${baseUrl}/?starmapTimeout=10#universe`, { waitUntil: "domcontentloaded" });
		await page.waitForSelector('#universe[data-mode="static"]');
		if (engage) await (await labelFor(page, "Sano")).focus();
		release();
		if (engage) await page.getByRole("button", { name: "Show the galaxy" }).click();
		await page.waitForSelector('#universe[data-mode="webgl"]');
	} finally {
		release();
		await page.close();
	}
}

// D23 + R12: on phones the panel is a modal sheet. Focus stays inside, the page
// behind is inert, and scrolling inside the sheet never scrolls the page.
async function assertPhoneSheet(page) {
	const label = await labelFor(page, "Sano");
	await activate(label);
	const panel = page.locator(".system-panel");
	await panel.waitFor({ state: "visible" });
	assert((await panel.getAttribute("role")) === "dialog", "phone: panel should be role=dialog.");
	assert((await panel.getAttribute("aria-modal")) === "true", "phone: panel should be aria-modal.");
	const behind = await page.evaluate(() => ({
		footer: Boolean(document.querySelector("footer")?.closest("[inert]")),
		nav: Boolean(document.querySelector("nav")?.closest("[inert]")),
	}));
	assert(behind.footer && behind.nav, `phone: page behind the sheet should be inert, got ${JSON.stringify(behind)}.`);
	for (let i = 0; i < 12; i++) {
		await page.keyboard.press("Tab");
		const inside = await page.evaluate(() => Boolean(document.activeElement?.closest(".system-panel")));
		assert(inside, `phone: Tab ${i + 1} moved focus out of the sheet.`);
	}
	const before = await page.evaluate(() => window.scrollY);
	const box = await panel.boundingBox();
	await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
	await page.mouse.wheel(0, 600);
	await page.waitForTimeout(400);
	const after = await page.evaluate(() => window.scrollY);
	assert(Math.abs(after - before) < 2, `phone: page scrolled ${after - before}px while the sheet was open.`);
	await page.keyboard.press("Escape");
	await panel.waitFor({ state: "detached" });
	const released = await page.evaluate(() => !document.querySelector("footer")?.closest("[inert]") && document.documentElement.style.overflow !== "hidden");
	assert(released, "phone: closing the sheet should release inert and the scroll lock.");
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
			await openMap(page, name);
			await assertKeyboardOrder(page);
			await assertPanelOpensAndCloses(page, name);
			await assertReceiptToggles(page, name);
			await assertContextLoss(page);
			await page.close();
		}
		const sheetPage = await browser.newPage({ viewport: { width: 390, height: 844 } });
		await openMap(sheetPage, "phone sheet");
		await assertPhoneSheet(sheetPage);
		await sheetPage.close();
		await assertSlowFallback(browser, false);
		await assertSlowFallback(browser, true);
		const zoomed = await browser.newPage({ viewport: { width: 844, height: 390 }, reducedMotion: "reduce" });
		await zoomed.addInitScript(() => { document.addEventListener("DOMContentLoaded", () => {
			document.documentElement.style.fontSize = "200%";
		}); });
		await zoomed.goto(`${baseUrl}${HOME}#universe`);
		await zoomed.waitForSelector('#universe[data-mode="static"]');
		await zoomed.close();
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
