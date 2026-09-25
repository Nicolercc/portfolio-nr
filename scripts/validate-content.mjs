import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const profilePath = join(root, "src/data/profile.ts");
const profile = readFileSync(profilePath, "utf8");

const emailMatch = profile.match(/email:\s*"([^"]+)"/);
const resumeMatch = profile.match(/resumePath:\s*"([^"]+)"/);

if (!emailMatch) {
	throw new Error("PROFILE.email is missing.");
}

if (!resumeMatch) {
	throw new Error("PROFILE.resumePath is missing.");
}

const canonicalEmail = emailMatch[1];
const resumePath = resumeMatch[1];
const resumeFile = join(root, "public", resumePath.replace(/^\//, ""));

if (!existsSync(resumeFile)) {
	throw new Error(`Resume asset does not exist: ${resumePath}`);
}

const staleNeedles = [
	"hello@nicolerodriguez.me",
	"nicolerodriguez@pursuit.org",
	"/Nicole_R_CV.pdf",
	"Book a Call",
	"Nicole Rcc",
	"Sub-second load times",
	"sub-second mobile load times",
	"WCAG compliant",
];

const checkedFiles = [
	"index.html",
	"src/components/layouts/Navbar.tsx",
	"src/components/sections/contact.tsx",
	"src/components/sections/landing.tsx",
	"src/components/sections/experience.tsx",
	"src/data/projects.ts",
	"src/data/about.ts",
	"src/pages/Blog.tsx",
	"src/pages/BlogPost.tsx",
	"src/pages/ProjectsIndex.tsx",
	"src/pages/CaseStudy.tsx",
	"src/pages/home.tsx",
];

for (const file of checkedFiles) {
	const fullPath = join(root, file);
	const source = readFileSync(fullPath, "utf8");
	for (const needle of staleNeedles) {
		if (source.includes(needle)) {
			throw new Error(`Stale public content found in ${file}: ${needle}`);
		}
	}
}

const sourceCorpus = checkedFiles
	.map((file) => readFileSync(join(root, file), "utf8"))
	.join("\n");

const publicAssetPattern = /["'](\/(?:media|Nicole_)[^"']+)["']/g;
for (const match of sourceCorpus.matchAll(publicAssetPattern)) {
	const publicPath = match[1];
	const filePath = join(root, "public", publicPath.replace(/^\//, ""));
	if (!existsSync(filePath)) {
		throw new Error(`Referenced public asset does not exist: ${publicPath}`);
	}
}

const internalRoutePattern = /["'](\/(?:projects|blog)(?:\/[a-z0-9-]+)?)[/"']?/g;
const knownInternalPrefixes = new Set(["/projects", "/blog"]);
for (const match of sourceCorpus.matchAll(internalRoutePattern)) {
	const route = match[1];
	if (![...knownInternalPrefixes].some((prefix) => route.startsWith(prefix))) {
		throw new Error(`Unexpected internal route: ${route}`);
	}
}

if (!canonicalEmail.endsWith("@gmail.com")) {
	throw new Error(`Unexpected canonical email: ${canonicalEmail}`);
}

console.log("Content validation passed.");
