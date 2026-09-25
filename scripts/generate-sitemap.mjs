import { writeFileSync, readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const baseUrl = "https://nicolerodriguez.dev";
const today = new Date().toISOString().slice(0, 10);

const projectsSource = readFileSync(join(root, "src/data/projects.ts"), "utf8");
const blogSource = readFileSync(join(root, "src/data/blog.ts"), "utf8");

const showcaseMatch = projectsSource.match(
	/export const SHOWCASE_PROJECT_SLUGS = \[([\s\S]*?)\] as const/,
);
if (!showcaseMatch) {
	throw new Error("SHOWCASE_PROJECT_SLUGS is missing.");
}
const projectSlugs = [...showcaseMatch[1].matchAll(/"([^"]+)"/g)].map(
	(match) => match[1],
);
const blogSlugs = [
	...blogSource.matchAll(/parseBlogPost\([^,]+,\s*"([^"]+)"/g),
].map((match) => match[1]);

const routes = [
	{ path: "/", priority: "1.0" },
	{ path: "/projects", priority: "0.9" },
	...projectSlugs.map((slug) => ({ path: `/projects/${slug}`, priority: "0.8" })),
	{ path: "/blog", priority: "0.6" },
	...blogSlugs.map((slug) => ({ path: `/blog/${slug}`, priority: "0.5" })),
];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
	.map(
		(route) => `  <url>
    <loc>${baseUrl}${route.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${route.priority}</priority>
  </url>`,
	)
	.join("\n")}
</urlset>
`;

writeFileSync(join(root, "public/sitemap.xml"), xml);
console.log(`Generated sitemap.xml with ${routes.length} routes.`);
