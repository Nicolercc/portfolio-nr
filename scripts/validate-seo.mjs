import { createServer } from "node:http";
import { existsSync, readFileSync, statSync } from "node:fs";
import { extname, join, normalize } from "node:path";
import { chromium } from "playwright";

const root = process.cwd();
const baseSiteUrl = "https://nicolerodriguez.dev";
const distDir = join(root, "dist");
const port = Number(process.env.PORT ?? 4180);
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
	[".xml", "application/xml; charset=utf-8"],
	[".txt", "text/plain; charset=utf-8"],
	[".pdf", "application/pdf"],
]);

function assert(condition, message) {
	if (!condition) throw new Error(message);
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

		if (existsSync(filePath) && statSync(filePath).isDirectory()) {
			const directoryIndex = join(filePath, "index.html");
			if (existsSync(directoryIndex)) {
				filePath = directoryIndex;
			}
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

function expectedRoutes() {
	const projectsSource = readFileSync(join(root, "src/data/projects.ts"), "utf8");
	const blogSource = readFileSync(join(root, "src/data/blog.ts"), "utf8");
	const showcaseMatch = projectsSource.match(
		/export const SHOWCASE_PROJECT_SLUGS = \[([\s\S]*?)\] as const/,
	);
	assert(showcaseMatch, "SHOWCASE_PROJECT_SLUGS is missing.");
	const projectSlugs = [...showcaseMatch[1].matchAll(/"([^"]+)"/g)].map(
		(match) => match[1],
	);
	const blogSlugs = [
		...blogSource.matchAll(/parseBlogPost\([^,]+,\s*"([^"]+)"/g),
	].map((match) => match[1]);
	return [
		"/",
		"/projects",
		...projectSlugs.map((slug) => `/projects/${slug}`),
		"/blog",
		...blogSlugs.map((slug) => `/blog/${slug}`),
	];
}

function validateStaticSeoFiles() {
	const robots = readFileSync(join(root, "public/robots.txt"), "utf8");
	assert(
		robots.includes(`Sitemap: ${baseSiteUrl}/sitemap.xml`),
		"robots.txt must point to the canonical sitemap URL.",
	);

	const sitemap = readFileSync(join(root, "public/sitemap.xml"), "utf8");
	for (const route of expectedRoutes()) {
		assert(
			sitemap.includes(`<loc>${baseSiteUrl}${route}</loc>`),
			`sitemap.xml missing route: ${route}`,
		);
	}

	const html = readFileSync(join(root, "index.html"), "utf8");
	for (const needle of [
		'<link rel="canonical" href="https://nicolerodriguez.dev/"',
		'property="og:title"',
		'property="og:description"',
		'property="og:url"',
		'name="twitter:card"',
		'name="twitter:title"',
	]) {
		assert(html.includes(needle), `index.html missing SEO tag: ${needle}`);
	}
}

function routeShellPath(route) {
	if (route === "/") return join(distDir, "index.html");
	return join(distDir, route.replace(/^\/+|\/+$/g, ""), "index.html");
}

function validateBuiltRouteShell(route, expected) {
	const filePath = routeShellPath(route);
	assert(existsSync(filePath), `Built route shell missing: ${route}`);

	const html = readFileSync(filePath, "utf8");
	const canonical = `${baseSiteUrl}${route}`;
	for (const needle of [
		`<title>${expected.title}</title>`,
		`<link rel="canonical" href="${canonical}"`,
		`<meta property="og:title" content="${expected.title}"`,
		`<meta property="og:description"`,
		`<meta property="og:url" content="${canonical}"`,
		`<meta name="twitter:card" content="${expected.twitterCard}"`,
		`<meta name="twitter:title" content="${expected.title}"`,
		`<meta name="twitter:description"`,
	]) {
		assert(html.includes(needle), `${route} built shell missing: ${needle}`);
	}

	if (expected.descriptionIncludes) {
		assert(
			html.includes(expected.descriptionIncludes),
			`${route} built shell should include route-specific description.`,
		);
	}

	if (expected.image) {
		assert(
			html.includes(`content="${baseSiteUrl}${expected.image}"`),
			`${route} built shell missing social image ${expected.image}.`,
		);
	}
}

async function validateRuntimeRoute(page, route, expected) {
	await page.goto(`${baseUrl}${route}`, { waitUntil: "networkidle" });
	const meta = await page.evaluate(() => {
		const content = (selector) =>
			document.head.querySelector(selector)?.getAttribute("content") ?? "";
		return {
			title: document.title,
			description: content('meta[name="description"]'),
			canonical: document.head.querySelector('link[rel="canonical"]')?.href ?? "",
			ogTitle: content('meta[property="og:title"]'),
			ogDescription: content('meta[property="og:description"]'),
			ogUrl: content('meta[property="og:url"]'),
			twitterTitle: content('meta[name="twitter:title"]'),
			twitterDescription: content('meta[name="twitter:description"]'),
			structuredData: document.querySelector("#page-structured-data")?.textContent ?? "",
		};
	});

	assert(meta.title.includes(expected.titleIncludes), `${route} title mismatch.`);
	assert(meta.description.length >= 50, `${route} description is too short.`);
	assert(meta.canonical === `${baseSiteUrl}${route}`, `${route} canonical mismatch.`);
	assert(meta.ogTitle === meta.title, `${route} OG title should match document title.`);
	assert(meta.ogDescription === meta.description, `${route} OG description should match meta description.`);
	assert(meta.ogUrl === `${baseSiteUrl}${route}`, `${route} OG URL mismatch.`);
	assert(meta.twitterTitle === meta.title, `${route} Twitter title mismatch.`);
	assert(meta.twitterDescription === meta.description, `${route} Twitter description mismatch.`);
	assert(meta.structuredData.includes(expected.structuredType), `${route} structured data missing ${expected.structuredType}.`);
}

async function main() {
	validateStaticSeoFiles();
	validateBuiltRouteShell("/projects/sano", {
		title: "Sano Case Study — Nicole Rodriguez",
		descriptionIncludes: "public NYC DOHMH restaurant inspection records",
		twitterCard: "summary_large_image",
		image: "/social/sano.jpg",
	});
	validateBuiltRouteShell("/blog/i-was-taught-to-build", {
		title: "I Was Taught to Build. Now I'm Learning What's Worth Building. — Nicole Rodriguez",
		descriptionIncludes: "if the code is easier to generate",
		twitterCard: "summary_large_image",
		image: "/og-image.jpg",
	});
	validateBuiltRouteShell("/", {
		title: "Nicole Rodriguez — Software Engineer - Full-Stack, Applied AI, and Data Systems",
		descriptionIncludes: "NYC-based software engineer",
		twitterCard: "summary_large_image",
		image: "/og-image.jpg",
	});

	const server = await serveDist();
	const browser = await chromium.launch({ headless: true });
	try {
		const page = await browser.newPage({
			viewport: { width: 1280, height: 900 },
			deviceScaleFactor: 1,
		});

		await validateRuntimeRoute(page, "/", {
			titleIncludes: "Nicole Rodriguez",
			structuredType: "Person",
		});
		await validateRuntimeRoute(page, "/projects", {
			titleIncludes: "Projects",
			structuredType: "CollectionPage",
		});
		await validateRuntimeRoute(page, "/projects/sano", {
			titleIncludes: "Sano",
			structuredType: "CreativeWork",
		});
		await validateRuntimeRoute(page, "/blog/i-was-taught-to-build", {
			titleIncludes: "I Was Taught",
			structuredType: "BlogPosting",
		});

		console.log("SEO and social metadata validation passed.");
	} finally {
		await browser.close();
		await new Promise((resolve) => server.close(resolve));
	}
}

main().catch((error) => {
	console.error(error);
	process.exit(1);
});
