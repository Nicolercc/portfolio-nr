import { readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const sourceFiles = [
	"src/data/profile.ts",
	"src/data/projects.ts",
	"src/data/openSource.ts",
	"README.md",
	"public/robots.txt",
];

const ignoredHosts = new Set([
	"schema.org",
	"fonts.googleapis.com",
	"fonts.gstatic.com",
	"www.w3.org",
]);

const botBlockedHosts = new Set(["www.linkedin.com"]);

function fail(message) {
	throw new Error(message);
}

function extractUrls(source) {
	return [...source.matchAll(/https?:\/\/[^"')\s`<>]+/g)].map((match) =>
		match[0].replace(/[.,;:]+$/, ""),
	);
}

const urls = new Set();
for (const file of sourceFiles) {
	const source = readFileSync(join(root, file), "utf8");
	for (const url of extractUrls(source)) {
		const parsed = new URL(url);
		if (ignoredHosts.has(parsed.hostname)) continue;
		urls.add(parsed.toString());
	}
}

async function check(url) {
	const controller = new AbortController();
	const timeout = setTimeout(() => controller.abort(), 15000);
	try {
		const response = await fetch(url, {
			method: "HEAD",
			redirect: "follow",
			signal: controller.signal,
			headers: {
				"User-Agent": "portfolio-release-link-check/1.0",
			},
		});

		if (response.status === 405 || response.status === 403) {
			return await checkWithGet(url);
		}

		return response.status;
	} finally {
		clearTimeout(timeout);
	}
}

async function checkWithGet(url) {
	const controller = new AbortController();
	const timeout = setTimeout(() => controller.abort(), 15000);
	try {
		const response = await fetch(url, {
			method: "GET",
			redirect: "follow",
			signal: controller.signal,
			headers: {
				"User-Agent": "portfolio-release-link-check/1.0",
			},
		});
		return response.status;
	} finally {
		clearTimeout(timeout);
	}
}

for (const url of urls) {
	const parsed = new URL(url);
	if (botBlockedHosts.has(parsed.hostname)) {
		if (!parsed.protocol.startsWith("https")) {
			fail(`LinkedIn URL must use HTTPS: ${url}`);
		}
		continue;
	}

	const status = await check(url);
	if (status < 200 || status >= 400) {
		fail(`External link check failed with HTTP ${status}: ${url}`);
	}
}

console.log(`External link validation passed for ${urls.size} URLs.`);
