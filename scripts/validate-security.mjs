import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();

function fail(message) {
	throw new Error(message);
}

function read(path) {
	return readFileSync(join(root, path), "utf8");
}

const packageJson = JSON.parse(read("package.json"));
if (packageJson.dependencies?.marked || packageJson.devDependencies?.marked) {
	fail("marked should not be present; blog Markdown must not render raw HTML.");
}

const sourceFiles = [
	"src/pages/BlogPost.tsx",
	"src/lib/parseBlogPost.ts",
	"src/pages/home.tsx",
	"index.html",
];

for (const file of sourceFiles) {
	const source = read(file);
	if (source.includes("dangerouslySetInnerHTML") && file !== "src/pages/home.tsx") {
		fail(`Unsafe raw HTML rendering found in ${file}.`);
	}
	if (source.includes("onload=")) {
		fail(`Inline onload handler found in ${file}.`);
	}
}

const homeSource = read("src/pages/home.tsx");
if (
	homeSource.includes("dangerouslySetInnerHTML") &&
	!homeSource.includes('type="application/ld+json"')
) {
	fail("Homepage raw HTML use must remain limited to JSON-LD structured data.");
}

const externalLinkPattern = /target="_blank"([\s\S]*?)>/g;
const allSource = [
	"src/components/layouts/Navbar.tsx",
	"src/components/sections/landing.tsx",
	"src/components/sections/bento.tsx",
	"src/pages/CaseStudy.tsx",
	"src/pages/BlogPost.tsx",
].map(read).join("\n");

for (const match of allSource.matchAll(externalLinkPattern)) {
	const tagTail = match[1];
	if (!/rel="[^"]*(noopener|noreferrer)[^"]*"/.test(tagTail)) {
		fail("External target=_blank link is missing noopener/noreferrer.");
	}
}

const vercelPath = join(root, "vercel.json");
const headersPath = join(root, "public/_headers");
if (!existsSync(vercelPath)) fail("vercel.json security headers are missing.");
if (!existsSync(headersPath)) fail("public/_headers security headers are missing.");

const vercel = JSON.parse(read("vercel.json"));
const headers = vercel.headers?.[0]?.headers ?? [];
const headerMap = new Map(headers.map((header) => [header.key, header.value]));
const requiredHeaders = [
	"Content-Security-Policy",
	"Strict-Transport-Security",
	"X-Content-Type-Options",
	"Referrer-Policy",
	"Permissions-Policy",
];
for (const header of requiredHeaders) {
	if (!headerMap.has(header)) {
		fail(`Missing security header in vercel.json: ${header}`);
	}
	if (!read("public/_headers").includes(header)) {
		fail(`Missing security header in public/_headers: ${header}`);
	}
}

const csp = headerMap.get("Content-Security-Policy");
for (const directive of [
	"default-src 'self'",
	"base-uri 'self'",
	"object-src 'none'",
	"frame-ancestors 'none'",
	"script-src 'self'",
	"upgrade-insecure-requests",
]) {
	if (!csp.includes(directive)) {
		fail(`CSP is missing directive: ${directive}`);
	}
}

if (csp.includes("'unsafe-eval'")) {
	fail("CSP must not allow unsafe-eval.");
}

console.log("Security validation passed.");
