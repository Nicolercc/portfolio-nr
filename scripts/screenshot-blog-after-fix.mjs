import { chromium } from "playwright";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

await page.goto("http://localhost:5173/blog/i-was-taught-to-build", {
	waitUntil: "networkidle",
});
await page.waitForTimeout(1500);

await page.evaluate(() => window.scrollTo(0, 280));
await page.waitForTimeout(500);
await page.screenshot({ path: "blog-post-after-header-scroll.png" });

await page.locator('h2:has-text("Shipping as proof")').scrollIntoViewIfNeeded();
await page.waitForTimeout(500);
await page.screenshot({ path: "blog-post-after-shipping.png" });

await page.goto("http://localhost:5173/blog", { waitUntil: "networkidle" });
await page.waitForTimeout(1500);
await page.screenshot({ path: "blog-index-after-gradient-fix.png" });

await browser.close();
