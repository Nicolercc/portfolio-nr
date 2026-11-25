import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import ts from "typescript";

const root = process.cwd();
const sourcePath = join(root, "src/data/projects.ts");
const sourceText = readFileSync(sourcePath, "utf8");
const sourceFile = ts.createSourceFile(
	sourcePath,
	sourceText,
	ts.ScriptTarget.Latest,
	true,
	ts.ScriptKind.TS,
);

function fail(message) {
	throw new Error(message);
}

function getName(node) {
	if (ts.isIdentifier(node) || ts.isStringLiteral(node)) return node.text;
	return undefined;
}

function findVariable(name, file = sourceFile) {
	let found;
	file.forEachChild(function visit(node) {
		if (ts.isVariableDeclaration(node) && getName(node.name) === name) {
			found = node.initializer;
			return;
		}
		node.forEachChild(visit);
	});
	return found;
}

function unwrapExpression(node) {
	let current = node;
	while (
		current &&
		(ts.isAsExpression(current) ||
			ts.isSatisfiesExpression(current) ||
			ts.isParenthesizedExpression(current))
	) {
		current = current.expression;
	}
	return current;
}

function expectObject(node, label) {
	node = unwrapExpression(node);
	if (!node || !ts.isObjectLiteralExpression(node)) {
		fail(`${label} must be an object literal.`);
	}
	return node;
}

function expectArray(node, label) {
	node = unwrapExpression(node);
	if (!node || !ts.isArrayLiteralExpression(node)) {
		fail(`${label} must be an array literal.`);
	}
	return node;
}

function getProp(object, propName) {
	return object.properties.find((prop) => {
		if (!ts.isPropertyAssignment(prop)) return false;
		return getName(prop.name) === propName;
	});
}

function getObjectProp(object, propName, label = propName) {
	const prop = getProp(object, propName);
	return expectObject(prop?.initializer, label);
}

function getArrayProp(object, propName, label = propName) {
	const prop = getProp(object, propName);
	return expectArray(prop?.initializer, label);
}

function getOptionalArrayProp(object, propName) {
	const prop = getProp(object, propName);
	if (!prop) return undefined;
	return expectArray(prop.initializer, propName);
}

function getOptionalObjectProp(object, propName) {
	const prop = getProp(object, propName);
	if (!prop) return undefined;
	return expectObject(prop.initializer, propName);
}

function getStringProp(object, propName, label = propName) {
	const prop = getProp(object, propName);
	if (!prop || !ts.isStringLiteralLike(prop.initializer)) {
		fail(`${label} must be a string literal.`);
	}
	return prop.initializer.text.trim();
}

function getOptionalStringProp(object, propName) {
	const prop = getProp(object, propName);
	if (!prop) return undefined;
	if (!ts.isStringLiteralLike(prop.initializer)) {
		fail(`${propName} must be a string literal when present.`);
	}
	return prop.initializer.text.trim();
}

function stringArrayValues(array) {
	return array.elements.map((element) => {
		if (!ts.isStringLiteralLike(element)) {
			fail("Expected an array of string literals.");
		}
		return element.text.trim();
	});
}

function objectArrayValues(array, label) {
	return array.elements.map((element, index) =>
		expectObject(element, `${label}[${index}]`),
	);
}

function hasLabel(items, label) {
	return items.some((item) => getOptionalStringProp(item, "label") === label);
}

const projectsObject = expectObject(findVariable("projects"), "projects");
const showcaseArray = expectArray(
	findVariable("SHOWCASE_PROJECT_SLUGS"),
	"SHOWCASE_PROJECT_SLUGS",
);
const showcaseSlugs = stringArrayValues(showcaseArray);
const secondarySlugs = stringArrayValues(
	expectArray(findVariable("SECONDARY_CASE_STUDY_SLUGS"), "SECONDARY_CASE_STUDY_SLUGS"),
);

const expectedShowcaseSlugs = ["sano", "code4kidz", "elite-global"];
if (showcaseSlugs.join(",") !== expectedShowcaseSlugs.join(",")) {
	fail(
		`Selected work should be ${expectedShowcaseSlugs.join(", ")}. Found ${showcaseSlugs.join(", ")}.`,
	);
}

const knownBrokenLiveUrls = new Set(["https://carbonshift.onrender.com"]);

const listedSlugs = [...showcaseSlugs, ...secondarySlugs];
const routedSlugs = new Set(listedSlugs);
if (routedSlugs.size !== listedSlugs.length) fail("Project route lists contain duplicate slugs.");
const projectSlugs = projectsObject.properties.map((project) => getName(project.name));
for (const slug of routedSlugs) {
	if (!projectSlugs.includes(slug)) fail(`Missing project entry for ${slug}.`);
}

const mapPath = join(root, "src/data/starSystems.ts");
const mapFile = ts.createSourceFile(mapPath, readFileSync(mapPath, "utf8"), ts.ScriptTarget.Latest);
const mapPresentation = expectObject(findVariable("STAR_PRESENTATION", mapFile), "STAR_PRESENTATION");
const css = readFileSync(join(root, "src/index.css"), "utf8");

function requireText(object, fields, context) {
	for (const field of fields) {
		if (!getStringProp(object, field, `${context}.${field}`)) fail(`${context} needs ${field}.`);
	}
}

for (const slug of projectSlugs) {
	const project = expectObject(getProp(projectsObject, slug)?.initializer, `project ${slug}`);
	const title = getStringProp(project, "title", `${slug}.title`);
	const status = getStringProp(project, "status", `${slug}.status`);
	const kind = getStringProp(project, "kind", `${slug}.kind`);
	requireText(project, ["title", "oneLine", "role", "tagline"], slug);
	if (getStringProp(project, "slug") !== slug) fail(`${slug} has a mismatched slug.`);
	if (!["live", "prototype", "open-source", "client-data", "archived"].includes(status)) {
		fail(`${slug} has an invalid status.`);
	}
	const onMap = getProp(project, "onMap")?.initializer.kind;
	if (onMap !== ts.SyntaxKind.TrueKeyword && onMap !== ts.SyntaxKind.FalseKeyword) {
		fail(`${slug}.onMap must be a boolean literal.`);
	}
	if (onMap === ts.SyntaxKind.TrueKeyword) {
		const presentation = getObjectProp(mapPresentation, slug, `${slug} star presentation`);
		requireText(presentation, ["line", "color"], slug);
		const color = getStringProp(presentation, "color");
		if (!color.startsWith("star-") || !css.includes(`--color-${color}:`)) {
			fail(`${slug} needs a defined star color token.`);
		}
	}
	if (kind === "brief") {
		if (!secondarySlugs.includes(slug)) fail(`${slug} must be listed as a secondary project route.`);
		const brief = getStringProp(project, "brief");
		if (brief.split(/\s+/).length < 100) fail(`${slug} needs a complete project brief.`);
		const facts = objectArrayValues(getArrayProp(project, "facts"), `${slug}.facts`);
		if (facts.length !== 3) fail(`${slug} needs exactly three facts.`);
		for (const fact of facts) requireText(fact, ["label", "value"], `${slug} fact`);
		const artifact = getObjectProp(project, "artifact");
		requireText(artifact, ["title"], `${slug} artifact`);
		const format = getStringProp(artifact, "format");
		if (format === "terminal") {
			requireText(artifact, ["snippet"], `${slug} artifact`);
		} else if (format === "schema") {
			const relationships = getArrayProp(artifact, "relationships").elements;
			if (!relationships.length || relationships.some((row) => {
				const values = stringArrayValues(expectArray(row, "schema relationship"));
				return values.length !== 3 || values.some((value) => !value);
			})) fail(`${slug} needs complete schema relationships.`);
		} else {
			fail(`${slug} has an invalid artifact format.`);
		}
		const outbound = getObjectProp(project, "outbound");
		requireText(outbound, ["label", "href"], `${slug} outbound`);
		if (!/^(\/(?!\/)|https:\/\/)/.test(getStringProp(outbound, "href"))) {
			fail(`${slug} needs a valid outbound destination.`);
		}
		continue;
	}
	if (kind !== "case-study") fail(`${slug} has an invalid project kind.`);

	for (const propName of ["category", "year", "role", "tagline", "description"]) {
		const value = getStringProp(project, propName, `${slug}.${propName}`);
		if (value.length < 4) {
			fail(`${title} needs a stronger ${propName} value.`);
		}
	}

	const links = getObjectProp(project, "links", `${slug}.links`);
	const caseStudyLink = getStringProp(links, "caseStudy", `${slug}.links.caseStudy`);
	if (caseStudyLink !== `/projects/${slug}`) {
		fail(`${title} case study link should be /projects/${slug}.`);
	}

	const liveLink = getOptionalStringProp(links, "live");
	if (status === "live" && !liveLink) {
		fail(`${title} is marked live but has no live link.`);
	}
	if (liveLink && knownBrokenLiveUrls.has(liveLink)) {
		fail(`${title} exposes a known broken deployment as a live link.`);
	}

	const stack = getArrayProp(project, "stack", `${slug}.stack`);
	if (stringArrayValues(stack).length < 4) {
		fail(`${title} should show enough stack depth to support recruiter conversation.`);
	}

	const media = getObjectProp(project, "media", `${slug}.media`);
	const mediaEvidence = ["hero", "detail", "video", "poster"].some((field) => {
		const value = getOptionalStringProp(media, field);
		if (!value) return false;
		return existsSync(join(root, "public", value.replace(/^\//, "")));
	});

	const caseStudy = getObjectProp(project, "caseStudy", `${slug}.caseStudy`);
	for (const propName of [
		"thesis",
		"problem",
		"solution",
		"decisions",
		"ux",
		"architecture",
		"performance",
		"impact",
	]) {
		const value = getStringProp(caseStudy, propName, `${slug}.caseStudy.${propName}`);
		if (value.length < 50) {
			fail(`${title} case study needs a stronger ${propName} section.`);
		}
	}

	const technicalHighlights = getArrayProp(
		caseStudy,
		"technicalHighlights",
		`${slug}.caseStudy.technicalHighlights`,
	);
	if (stringArrayValues(technicalHighlights).length < 3) {
		fail(`${title} needs at least three technical highlights.`);
	}

	const lessons = getArrayProp(caseStudy, "lessons", `${slug}.caseStudy.lessons`);
	if (stringArrayValues(lessons).length < 2) {
		fail(`${title} needs at least two lessons/retrospective points.`);
	}

	const atAGlance = objectArrayValues(
		getArrayProp(caseStudy, "atAGlance", `${slug}.caseStudy.atAGlance`),
		`${slug}.caseStudy.atAGlance`,
	);
	for (const requiredLabel of ["Role", "Ownership", "Status", "Core stack"]) {
		if (!hasLabel(atAGlance, requiredLabel)) {
			fail(`${title} At a Glance is missing ${requiredLabel}.`);
		}
	}

	const decisionCards = objectArrayValues(
		getArrayProp(caseStudy, "decisionCards", `${slug}.caseStudy.decisionCards`),
		`${slug}.caseStudy.decisionCards`,
	);
	if (decisionCards.length < 3) {
		fail(`${title} needs at least three engineering decision cards.`);
	}
	for (const card of decisionCards) {
		for (const field of ["title", "context", "tradeOff", "result"]) {
			getStringProp(card, field, `${slug}.decisionCards.${field}`);
		}
	}

	const architectureLayers = objectArrayValues(
		getArrayProp(
			caseStudy,
			"architectureLayers",
			`${slug}.caseStudy.architectureLayers`,
		),
		`${slug}.caseStudy.architectureLayers`,
	);
	if (architectureLayers.length < 3) {
		fail(`${title} needs at least three architecture layers.`);
	}

	const walkthrough = getOptionalArrayProp(caseStudy, "walkthrough");
	const walkthroughSteps = walkthrough ? objectArrayValues(walkthrough, `${slug}.walkthrough`) : [];
	if (!mediaEvidence && walkthroughSteps.length < 3) {
		fail(`${title} needs screenshots/video evidence or a three-step architecture walkthrough.`);
	}

	if (slug === "ruvia") {
		if (status !== "prototype" || liveLink !== "https://ruvia.vercel.app/") {
			fail("Ruvia must remain a prototype with its seeded-demo deployment link.");
		}
		const boundaryCopy = [
			getStringProp(project, "description"),
			getStringProp(caseStudy, "impact"),
		]
			.join(" ")
			.toLowerCase();
		for (const requiredPhrase of ["prototype", "demo"]) {
			if (!boundaryCopy.includes(requiredPhrase)) {
				fail(`Ruvia needs explicit ${requiredPhrase} boundary copy.`);
			}
		}
	}

	if (slug === "tripcanvas") {
		if (status !== "prototype") {
			fail("TripCanvas should remain a prototype until it has a production deployment.");
		}
		if (liveLink) {
			fail("TripCanvas should not expose a live link while it is a local prototype.");
		}
		const boundaryCopy = [
			getStringProp(project, "tagline"),
			getStringProp(project, "description"),
			getStringProp(caseStudy, "solution"),
			getStringProp(caseStudy, "impact"),
		]
			.join(" ")
			.toLowerCase();
		// The prototype/data boundary must be stated in the primary copy, not only in fine print.
		for (const requiredPhrase of ["prototype", "demo trip", "browser"]) {
			if (!boundaryCopy.includes(requiredPhrase)) {
				fail(`TripCanvas needs explicit ${requiredPhrase} boundary copy.`);
			}
		}
	}
}

// Design-section figures read alt text and dimensions from the asset manifests,
// so every image must be on disk and in the manifest.
const mediaManifest = readFileSync(join(root, "src/data/caseStudyMedia.generated.ts"), "utf8");
for (const [, block] of sourceText.matchAll(/designSection: \{([\s\S]*?)\n\t\t\t\},/g)) {
	for (const [, mediaPath] of block.matchAll(/"(\/media\/[^"]+)"/g)) {
		if (!mediaManifest.includes(`"${mediaPath}"`)) {
			fail(`${mediaPath} has no manifest entry. Run npm run assets:figma / assets:live.`);
		}
		if (!existsSync(join(root, "public", mediaPath))) {
			fail(`${mediaPath} is referenced but missing from public/.`);
		}
	}
}

// Research copy may describe a plan, never results that do not exist.
const researchResultPhrases =
	/\b(users|participants|testers|diners) (found|showed|said|told|preferred|reported|struggled|understood)\b|\btesting (demonstrated|showed|proved|confirmed)\b|\busability (study|testing) (showed|found|confirmed)\b/i;
const researchResultMatch = sourceText.match(researchResultPhrases);
if (researchResultMatch) {
	fail(`Copy reports research results ("${researchResultMatch[0]}"); only claim findings from sessions that ran.`);
}

for (const [, planUrl] of sourceText.matchAll(/planUrl: "(\/[^"]+)"/g)) {
	if (!existsSync(join(root, "public", planUrl))) {
		fail(`Research plan file is missing: public${planUrl}`);
	}
}

console.log("Project story validation passed.");
