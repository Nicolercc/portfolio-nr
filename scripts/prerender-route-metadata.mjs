import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import vm from "node:vm";
import ts from "typescript";

const root = process.cwd();
const distDir = join(root, "dist");
const baseSiteUrl = "https://nicolerodriguez.dev";
const profile = {
	name: "Nicole Rodriguez",
	positioning: "Product Designer & Engineer - UX, Accessibility, and Frontend Systems",
	summary:
		"NYC-based product designer and engineer building accessible interfaces and public-data products from interaction decisions through implementation and validation.",
};

function assert(condition, message) {
	if (!condition) throw new Error(message);
}

function escapeHtml(value) {
	return String(value)
		.replaceAll("&", "&amp;")
		.replaceAll('"', "&quot;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;");
}

function absoluteUrl(pathOrUrl) {
	if (!pathOrUrl) return undefined;
	if (/^https?:\/\//.test(pathOrUrl)) return pathOrUrl;
	return new URL(pathOrUrl, baseSiteUrl).toString();
}

function loadProjects() {
	const source = readFileSync(join(root, "src/data/projects.ts"), "utf8");
	const output = ts.transpileModule(source, {
		compilerOptions: {
			module: ts.ModuleKind.CommonJS,
			target: ts.ScriptTarget.ES2022,
		},
		fileName: "projects.ts",
	}).outputText;
	const module = { exports: {} };
	const sandbox = {
		module,
		exports: module.exports,
		require(specifier) {
			throw new Error(`Unexpected import while reading projects.ts: ${specifier}`);
		},
	};

	vm.runInNewContext(output, sandbox, { filename: "projects.ts" });
	return {
		registry: module.exports.projectsRegistry,
		slugs: module.exports.SHOWCASE_PROJECT_SLUGS,
	};
}

function parseFrontmatter(raw) {
	const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
	const frontmatter = {};
	if (!match) return frontmatter;

	for (const line of match[1].split(/\r?\n/)) {
		const colon = line.indexOf(":");
		if (colon === -1) continue;
		const key = line.slice(0, colon).trim();
		let value = line.slice(colon + 1).trim();
		value = value.replace(/^['"]|['"]$/g, "");
		frontmatter[key] = value;
	}

	return frontmatter;
}

function loadBlogPosts() {
	const blogSource = readFileSync(join(root, "src/data/blog.ts"), "utf8");
	return [...blogSource.matchAll(/parseBlogPost\([^,]+,\s*"([^"]+)"/g)].map(
		(match) => {
			const slug = match[1];
			const raw = readFileSync(join(root, `src/content/blog/${slug}.md`), "utf8");
			const frontmatter = parseFrontmatter(raw);
			return {
				slug,
				title: frontmatter.title ?? slug,
				description: frontmatter.excerpt ?? "",
			};
		},
	);
}

function routeFile(route) {
	if (route === "/") return join(distDir, "index.html");
	return join(distDir, route.replace(/^\/+|\/+$/g, ""), "index.html");
}

function stripManagedHeadTags(html) {
	return html
		.replace(/\s*<title>[\s\S]*?<\/title>/gi, "")
		.replace(/\s*<meta\s+name=["']description["'][^>]*>/gi, "")
		.replace(/\s*<link\s+rel=["']canonical["'][^>]*>/gi, "")
		.replace(/\s*<meta\s+property=["']og:(?:title|description|type|url|image)["'][^>]*>/gi, "")
		.replace(/\s*<meta\s+name=["']twitter:(?:card|title|description|image)["'][^>]*>/gi, "");
}

function buildHeadTags(meta) {
	const canonical = `${baseSiteUrl}${meta.path}`;
	const image = absoluteUrl(meta.image);
	const tags = [
		`<title>${escapeHtml(meta.title)}</title>`,
		`<meta name="description" content="${escapeHtml(meta.description)}" />`,
		`<link rel="canonical" href="${escapeHtml(canonical)}" />`,
		`<meta property="og:title" content="${escapeHtml(meta.title)}" />`,
		`<meta property="og:description" content="${escapeHtml(meta.description)}" />`,
		`<meta property="og:type" content="${escapeHtml(meta.type ?? "website")}" />`,
		`<meta property="og:url" content="${escapeHtml(canonical)}" />`,
		`<meta name="twitter:card" content="${image ? "summary_large_image" : "summary"}" />`,
		`<meta name="twitter:title" content="${escapeHtml(meta.title)}" />`,
		`<meta name="twitter:description" content="${escapeHtml(meta.description)}" />`,
	];

	if (image) {
		tags.push(`<meta property="og:image" content="${escapeHtml(image)}" />`);
		tags.push(`<meta name="twitter:image" content="${escapeHtml(image)}" />`);
	}

	return tags.map((tag) => `\t\t${tag}`).join("\n");
}

function writeRouteShell(baseHtml, meta) {
	const strippedHtml = stripManagedHeadTags(baseHtml);
	const headTags = buildHeadTags(meta);
	const html = strippedHtml.includes("\n\t\t<script")
		? strippedHtml.replace("\n\t\t<script", `\n${headTags}\n\t\t<script`)
		: strippedHtml.replace("</head>", `${headTags}\n\t</head>`);
	const file = routeFile(meta.path);
	mkdirSync(dirname(file), { recursive: true });
	writeFileSync(file, html);
}

// Shared social card for routes without their own project screenshot.
const DEFAULT_SOCIAL_IMAGE = "/og-image.jpg";

function main() {
	assert(existsSync(join(distDir, "index.html")), "dist/index.html missing. Run Vite build first.");

	const baseHtml = readFileSync(join(distDir, "index.html"), "utf8");
	const { registry, slugs } = loadProjects();
	const blogPosts = loadBlogPosts();
	const projectList = slugs.map((slug) => registry[slug]);
	const routeMetas = [
		{
			path: "/",
			title: `${profile.name} — ${profile.positioning}`,
			description: profile.summary,
			image: DEFAULT_SOCIAL_IMAGE,
		},
		{
			path: "/projects",
			title: `Projects — ${profile.name}`,
			description:
				"Selected full-stack, applied AI, and public-data systems case studies by Nicole Rodriguez.",
			image: DEFAULT_SOCIAL_IMAGE,
		},
		...projectList.map((project) => ({
			path: `/projects/${project.slug}`,
			title: `${project.title} Case Study — ${profile.name}`,
			description: project.description,
			image: project.media.social ?? project.media.hero ?? project.media.detail,
		})),
		{
			path: "/blog",
			title: `Writing — ${profile.name}`,
			description: `Essays and notes by ${profile.name}, ${profile.positioning}.`,
			image: DEFAULT_SOCIAL_IMAGE,
		},
		...blogPosts.map((post) => ({
			path: `/blog/${post.slug}`,
			title: `${post.title} — ${profile.name}`,
			description: post.description,
			type: "article",
			image: DEFAULT_SOCIAL_IMAGE,
		})),
	];

	for (const meta of routeMetas) {
		writeRouteShell(baseHtml, meta);
	}

	console.log(`Prerendered route metadata shells for ${routeMetas.length} routes.`);
}

main();
