import { readFileSync } from "node:fs";
import { join } from "node:path";
import vm from "node:vm";
import ts from "typescript";

export function loadProjects(root = process.cwd()) {
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
	const { projectsRegistry: registry, getProjectMetadata } = module.exports;
	const listed = [
		...module.exports.SHOWCASE_PROJECT_SLUGS,
		...(module.exports.SECONDARY_CASE_STUDY_SLUGS ?? []),
	];
	// Every project in the registry has a project page, so every one needs a built page.
	// Unlisted ones (e.g. impactify) stay out of the sitemap but must not 404 for old links.
	return {
		registry,
		getProjectMetadata,
		slugs: [...listed, ...Object.keys(registry).filter((slug) => !listed.includes(slug))],
	};
}

export function loadBlogSlugs(root = process.cwd()) {
	const source = readFileSync(join(root, "src/data/blog.ts"), "utf8");
	return [...source.matchAll(/parseBlogPost\([^,]+,\s*"([^"]+)"/g)].map((match) => match[1]);
}

export function getContentRoutes() {
	const { slugs } = loadProjects();
	return [
		"/projects",
		...slugs.map((slug) => `/projects/${slug}`),
		"/blog",
		...loadBlogSlugs().map((slug) => `/blog/${slug}`),
	];
}
