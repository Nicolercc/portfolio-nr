import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { gzipSync } from "node:zlib";
import { join } from "node:path";

const root = process.cwd();
const publicDir = join(root, "public");
const mediaDir = join(publicDir, "media");
const distAssetsDir = join(root, "dist/assets");

const KB = 1024;
const MB = 1024 * KB;

const budgets = {
	totalPublicMedia: 1.5 * MB,
	publicMediaFile: 350 * KB,
	heroImage: 220 * KB,
	supportingImage: 330 * KB,
	video: 5 * MB,
	totalJsGzip: 220 * KB,
	entryJsRaw: 500 * KB,
	cssGzip: 22 * KB,
};

function fail(message) {
	throw new Error(message);
}

function listFiles(dir) {
	if (!existsSync(dir)) return [];
	return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
		const fullPath = join(dir, entry.name);
		return entry.isDirectory() ? listFiles(fullPath) : [fullPath];
	});
}

function sizeOf(path) {
	return statSync(path).size;
}

function formatSize(bytes) {
	return `${Math.round(bytes / KB)} KB`;
}

const publicMediaFiles = listFiles(mediaDir);
const totalPublicMedia = publicMediaFiles.reduce((sum, file) => sum + sizeOf(file), 0);
if (totalPublicMedia > budgets.totalPublicMedia) {
	fail(
		`Public media budget exceeded: ${formatSize(totalPublicMedia)} > ${formatSize(
			budgets.totalPublicMedia,
		)}.`,
	);
}

for (const file of publicMediaFiles) {
	const size = sizeOf(file);
	if (/\.(mov|mp4|webm)$/i.test(file)) {
		if (size > budgets.video) {
			fail(`Video exceeds budget: ${file} is ${formatSize(size)}.`);
		}
		continue;
	}

	if (size > budgets.publicMediaFile) {
		fail(`Public media file exceeds budget: ${file} is ${formatSize(size)}.`);
	}
}

const projectsSource = readFileSync(join(root, "src/data/projects.ts"), "utf8");
const referencedMedia = [...projectsSource.matchAll(/"(?<path>\/media\/[^"]+)"/g)].map(
	(match) => match.groups.path,
);

for (const mediaPath of referencedMedia) {
	const file = join(publicDir, mediaPath.replace(/^\//, ""));
	if (!existsSync(file)) {
		fail(`Referenced media asset is missing: ${mediaPath}`);
	}

	const size = sizeOf(file);
	if (/hero|poster/.test(mediaPath) && size > budgets.heroImage) {
		fail(`Hero/poster media exceeds budget: ${mediaPath} is ${formatSize(size)}.`);
	}

	if (/detail|briefing|reps|onboarding/.test(mediaPath) && size > budgets.supportingImage) {
		fail(`Supporting media exceeds budget: ${mediaPath} is ${formatSize(size)}.`);
	}
}

const html = readFileSync(join(root, "index.html"), "utf8");
if (html.includes("onload=")) {
	fail("Font stylesheet loading must not use inline onload handlers.");
}

const fontUrlMatch = html.match(/https:\/\/fonts\.googleapis\.com\/css2\?([^"]+)/);
if (!fontUrlMatch) {
	fail("Expected a single Google Fonts stylesheet link in index.html.");
}

const familyCount = [...fontUrlMatch[1].matchAll(/family=/g)].length;
if (familyCount > 3) {
	fail(`Too many Google font families loaded: ${familyCount}.`);
}

const cssSources = ["src/index.css", "src/components/sections/bento.css"];
for (const sourcePath of cssSources) {
	const css = readFileSync(join(root, sourcePath), "utf8");
	if (css.includes("fonts.googleapis.com")) {
		fail(`Duplicate Google Fonts CSS import found in ${sourcePath}.`);
	}
}

if (existsSync(distAssetsDir)) {
	const distFiles = listFiles(distAssetsDir);
	const jsFiles = distFiles.filter((file) => file.endsWith(".js"));
	const cssFiles = distFiles.filter((file) => file.endsWith(".css"));
	const totalJsGzip = jsFiles.reduce(
		(sum, file) => sum + gzipSync(readFileSync(file)).length,
		0,
	);
	const largestEntryJs = Math.max(
		0,
		...jsFiles
			.filter((file) => /\/index-[^/]+\.js$/.test(file))
			.map((file) => sizeOf(file)),
	);
	const totalCssGzip = cssFiles.reduce(
		(sum, file) => sum + gzipSync(readFileSync(file)).length,
		0,
	);

	if (totalJsGzip > budgets.totalJsGzip) {
		fail(
			`JS gzip budget exceeded: ${formatSize(totalJsGzip)} > ${formatSize(
				budgets.totalJsGzip,
			)}.`,
		);
	}

	if (largestEntryJs > budgets.entryJsRaw) {
		fail(
			`Entry JS raw budget exceeded: ${formatSize(largestEntryJs)} > ${formatSize(
				budgets.entryJsRaw,
			)}.`,
		);
	}

	if (totalCssGzip > budgets.cssGzip) {
		fail(
			`CSS gzip budget exceeded: ${formatSize(totalCssGzip)} > ${formatSize(
				budgets.cssGzip,
			)}.`,
		);
	}
}

console.log("Performance budget validation passed.");
