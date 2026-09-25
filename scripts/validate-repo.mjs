import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();

function fail(message) {
	throw new Error(message);
}

function listFiles(dir) {
	if (!existsSync(dir)) return [];

	const entries = [];
	for (const name of readdirSync(dir)) {
		const fullPath = join(dir, name);
		const stat = statSync(fullPath);
		if (stat.isDirectory()) {
			entries.push(...listFiles(fullPath));
		} else {
			entries.push(fullPath);
		}
	}
	return entries;
}

if (!existsSync(join(root, "package-lock.json"))) {
	fail("npm is the selected package manager, but package-lock.json is missing.");
}

if (existsSync(join(root, "pnpm-lock.yaml"))) {
	fail("pnpm-lock.yaml exists; keep one package manager lockfile.");
}

const pnpmStoreFiles = listFiles(join(root, ".pnpm-store"));
if (pnpmStoreFiles.length > 0) {
	fail(`.pnpm-store contains files that should not be committed: ${pnpmStoreFiles.join(", ")}`);
}

const rootDebugScreenshots = readdirSync(root).filter((name) =>
	/^blog-.*\.png$/.test(name),
);
if (rootDebugScreenshots.length > 0) {
	fail(`Root debug screenshots should not be kept in the repo: ${rootDebugScreenshots.join(", ")}`);
}

const packageJson = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));
if (packageJson.dependencies?.wouter || packageJson.devDependencies?.wouter) {
	fail("wouter is still listed even though React Router is the active router.");
}

const appSource = readFileSync(join(root, "src/App.tsx"), "utf8");
for (const route of ['path="/"', 'path="/projects"', 'path="/projects/:slug"', 'path="/blog"', 'path="/blog/:slug"']) {
	if (!appSource.includes(route)) {
		fail(`Expected route is missing from App.tsx: ${route}`);
	}
}

const projectsSource = readFileSync(join(root, "src/data/projects.ts"), "utf8");
const projectSlugs = new Set(
	[...projectsSource.matchAll(/slug:\s*"([^"]+)"/g)].map((match) => match[1]),
);

const showcaseMatch = projectsSource.match(
	/export const SHOWCASE_PROJECT_SLUGS = \[([\s\S]*?)\] as const/,
);
if (!showcaseMatch) {
	fail("SHOWCASE_PROJECT_SLUGS is missing.");
}

const showcaseSlugs = [...showcaseMatch[1].matchAll(/"([^"]+)"/g)].map(
	(match) => match[1],
);
for (const slug of showcaseSlugs) {
	if (!projectSlugs.has(slug)) {
		fail(`Showcase slug is not registered as a project: ${slug}`);
	}
}

for (const slug of projectSlugs) {
	if (!projectsSource.includes(`caseStudy: "/projects/${slug}"`)) {
		fail(`Project is missing its case-study route: ${slug}`);
	}
}

const blogSource = readFileSync(join(root, "src/data/blog.ts"), "utf8");
const fallbackSlugs = [...blogSource.matchAll(/parseBlogPost\([^,]+,\s*"([^"]+)"/g)].map(
	(match) => match[1],
);
if (fallbackSlugs.length === 0) {
	fail("No blog fallback slugs found.");
}

console.log("Repository validation passed.");
