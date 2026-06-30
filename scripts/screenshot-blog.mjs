import { chromium } from "playwright";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
await page.goto("http://localhost:5173/blog/i-was-taught-to-build", {
	waitUntil: "networkidle",
});
await page.waitForTimeout(1500);

const stats = await page.evaluate(() => {
	const prose = document.querySelector(".blog-prose");
	const tags = [...document.querySelectorAll("p")].filter((p) =>
		/engineering/i.test(p.textContent || ""),
	);
	const shipping = prose
		? [...prose.querySelectorAll("p")].filter((p) =>
				(p.textContent || "").includes("Portfolio projects"),
			)
		: [];
	return {
		shippingParagraphCount: shipping.length,
		tagLikeParagraphCount: tags.length,
		tagTexts: tags.map((t) => t.textContent?.trim()),
		allProsePCount: prose?.querySelectorAll("p").length,
		blogProseCount: document.querySelectorAll(".blog-prose").length,
		mainCount: document.querySelectorAll("main").length,
		h2Texts: [...(prose?.querySelectorAll("h2") || [])].map(
			(h) => h.textContent,
		),
	};
});

console.log(JSON.stringify(stats, null, 2));
await page.screenshot({ path: "blog-post-bug-audit.png", fullPage: true });
await browser.close();
