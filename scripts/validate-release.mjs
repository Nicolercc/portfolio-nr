import { existsSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();

function fail(message) {
	throw new Error(message);
}

function read(path) {
	return readFileSync(join(root, path), "utf8");
}

const requiredFiles = [
	"README.md",
	"package-lock.json",
	".github/workflows/verify.yml",
	"vercel.json",
	"public/_headers",
	"public/robots.txt",
	"public/sitemap.xml",
	"public/Nicole_Rodriguez_Resume.pdf",
	"docs/baseline-audit.md",
	"docs/portfolio-claim-inventory.md",
	"docs/phase-3-ia-verification.md",
	"docs/phase-4-project-story-verification.md",
	"docs/phase-5-accessibility-motion-verification.md",
	"docs/phase-6-performance-budgets.md",
	"docs/phase-7-security-hardening.md",
	"docs/phase-8-seo-social-adr.md",
	"scripts/prerender-route-metadata.mjs",
];

for (const file of requiredFiles) {
	const fullPath = join(root, file);
	if (!existsSync(fullPath)) fail(`Release artifact is missing: ${file}`);
	if (statSync(fullPath).size === 0) fail(`Release artifact is empty: ${file}`);
}

const packageJson = JSON.parse(read("package.json"));
const verify = packageJson.scripts?.verify ?? "";
const build = packageJson.scripts?.build ?? "";
const requiredScripts = [
	"verify:content",
	"verify:repo",
	"verify:projects",
	"verify:security",
	"verify:audit",
	"verify:links",
	"lint",
	"build",
	"verify:performance",
	"verify:seo",
	"verify:ia",
	"verify:a11y",
];

for (const script of requiredScripts) {
	if (!verify.includes(script)) {
		fail(`npm run verify does not include ${script}.`);
	}
}

if (!build.includes("scripts/prerender-route-metadata.mjs")) {
	fail("npm run build must prerender direct-route metadata shells.");
}

const gitignore = read(".gitignore");
for (const ignored of [".pnpm-store", "*.tsbuildinfo", "/*.png"]) {
	if (!gitignore.includes(ignored)) fail(`.gitignore missing ${ignored}.`);
}

const docs = [
	"docs/phase-4-project-story-verification.md",
	"docs/phase-5-accessibility-motion-verification.md",
	"docs/phase-6-performance-budgets.md",
	"docs/phase-7-security-hardening.md",
	"docs/phase-8-seo-social-adr.md",
].map(read).join("\n");

if (!docs.includes("Latest local result: passed")) {
	fail("Phase docs should record latest passing local results.");
}

console.log("Release checklist validation passed.");
