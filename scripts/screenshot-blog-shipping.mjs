import { chromium } from "playwright";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
await page.goto("http://localhost:5173/blog/i-was-taught-to-build", {
	waitUntil: "networkidle",
});
await page.waitForTimeout(2000);

await page.locator('h2:has-text("Shipping as proof")').scrollIntoViewIfNeeded();
await page.waitForTimeout(500);

const styles = await page.evaluate(() => {
	const h2 = [...document.querySelectorAll("h2")].find((h) =>
		h.textContent?.includes("Shipping as proof"),
	);
	const p = h2?.nextElementSibling;
	const cs = p ? getComputedStyle(p) : null;
	return {
		pText: p?.textContent?.slice(0, 80),
		transform: cs?.transform,
		opacity: cs?.opacity,
		position: cs?.position,
		webkitTextFillColor: cs?.webkitTextFillColor,
		color: cs?.color,
		filter: cs?.filter,
	};
});

console.log(JSON.stringify(styles, null, 2));
await page.screenshot({
	path: "blog-post-shipping-section.png",
});
await browser.close();
