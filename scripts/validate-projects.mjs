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

function findVariable(name) {
	let found;
	sourceFile.forEachChild(function visit(node) {
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

for (const slug of [...showcaseSlugs, ...secondarySlugs]) {
	const projectProp = getProp(projectsObject, slug);
	const project = expectObject(projectProp?.initializer, `project ${slug}`);
	const title = getStringProp(project, "title", `${slug}.title`);
	const status = getStringProp(project, "status", `${slug}.status`);

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
		if (liveLink && liveLink !== "https://ruvia.vercel.app/") {
			fail("Ruvia's live link must point at its real seeded-demo deployment.");
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
		if (status !== "case-study") {
			fail("TripCanvas should remain a case study until it has a production deployment.");
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

console.log("Project story validation passed.");
