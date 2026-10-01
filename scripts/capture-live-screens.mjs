/**
 * Captures screenshots of the live Sano app as WebP, next to the Figma exports.
 *
 *   node scripts/capture-live-screens.mjs
 */
import { join } from "node:path";
import { chromium } from "playwright";
import { mediaDirFor, printReport, updateManifest, writeWebp } from "./lib/image-pipeline.mjs";

const PROJECT = "sano";
const CAPTURES = [
	{
		file: "sano-live-home.webp",
		url: "https://sano-nine.vercel.app/",
		alt: "The live Sano home page with the hero headline, search bar, and a product preview for Lucky Chix.",
	},
	{
		file: "sano-live-profile.webp",
		url: "https://sano-nine.vercel.app/restaurants/50169790",
		alt: "The live Lucky Chix profile: official inspection data with grade A beside separate Google review context.",
	},
];

// Common cookie-banner selectors; hidden only if present. Nothing else on the page is touched.
const COOKIE_BANNER_CSS = `
	#onetrust-banner-sdk, #CybotCookiebotDialog, .cookie-banner, .cookie-consent,
	[id*="cookie-banner" i], [class*="cookie-banner" i], [aria-label*="cookie" i][role="dialog"] {
		display: none !important;
	}
`;

const outDir = mediaDirFor(PROJECT);
const browser = await chromium.launch();
const context = await browser.newContext({
	viewport: { width: 1440, height: 900 },
	deviceScaleFactor: 2,
	reducedMotion: "reduce",
	colorScheme: "light",
});

const rows = [];
const failures = [];

for (const capture of CAPTURES) {
	const page = await context.newPage();
	try {
		await page.goto(capture.url, { waitUntil: "networkidle", timeout: 60_000 });
		await page.evaluate(() => document.fonts.ready);
		await page.addStyleTag({ content: COOKIE_BANNER_CSS });
		await page.waitForTimeout(500);
		const png = await page.screenshot({ type: "png", fullPage: false });
		const result = await writeWebp(png, join(outDir, capture.file), capture.file);
		rows.push({ ...capture, ...result });
	} catch (error) {
		failures.push(`${capture.url} (${capture.file}): ${error.message}`);
	} finally {
		await page.close();
	}
}

await browser.close();

const manifestPath = updateManifest(
	outDir,
	rows.map(({ file, width, height, url, alt }) => ({
		file,
		width,
		height,
		source: { type: "live", url, viewport: "1440x900@2x" },
		alt,
	})),
);

printReport(rows);
console.log(`\nManifest: ${manifestPath}`);

if (failures.length) {
	console.error(`\n${failures.length} capture(s) failed:\n  ${failures.join("\n  ")}`);
	process.exitCode = 1;
}
