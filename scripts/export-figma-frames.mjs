/**
 * Exports Figma frames as WebP for a case study.
 *
 *   FIGMA_TOKEN=… node scripts/export-figma-frames.mjs --project sano
 *
 * The token is read from the environment only and is never logged or written.
 */
import { join } from "node:path";
import { mediaDirFor, printReport, updateManifest, writeWebp } from "./lib/image-pipeline.mjs";

const SOURCES = {
	sano: {
		fileKey: "W5RrpfAu7TSxRSoA1cz25t",
		frames: [
			{
				file: "sano-figma-hero.webp",
				nodeId: "9:267",
				alt: 'Sano home screen in Figma: the headline "The grade is on the door. The story isn\'t." with a search bar and a preview card for Lucky Chix showing grade A, a volatile inspection timeline, and reliability 60.',
			},
			{
				file: "sano-figma-results.webp",
				nodeId: "10:5",
				alt: "Sano search results in Figma: a borough coverage snapshot, then restaurant cards showing each official grade, a reliability score, and Google review context only when a source is matched.",
			},
			{
				file: "sano-figma-profile.webp",
				nodeId: "11:131",
				alt: "Sano restaurant profile for Lucky Chix in Figma: official inspection data first with grade A, then consumer review context kept separate, a plain-language summary, reliability 60, and the inspection timeline.",
			},
			{
				file: "sano-figma-handoff.webp",
				nodeId: "11:350",
				alt: "Annotated Sano profile screen with numbered developer notes covering WCAG 2.2 focus visibility, target size, the timeline's text alternative, and data rules.",
			},
			{
				file: "sano-figma-card.webp",
				nodeId: "1:159",
				alt: "The RestaurantCard component in two states: review matched, and review source not attached.",
			},
			{
				file: "sano-figma-grades.webp",
				nodeId: "1:45",
				alt: "Hand-drawn red grade stamps for A, B, C, Pending, and Not yet graded.",
			},
		],
	},
	sala: {
		fileKey: "mTrNMj9qBNuaMK88hOovGv",
		frames: [
			{
				file: "sala-hero.webp",
				nodeId: "11:3",
				alt: "Sala: the waiting-room board, staff queue, and check-in confirmation screens shown together.",
			},
			{
				file: "sala-boundary.webp",
				nodeId: "11:100",
				alt: "Diagram comparing the full staff record with the four-field board payload: glyph, token label, wait range, status.",
			},
			{
				file: "sala-lens.webp",
				nodeId: "11:181",
				alt: "Staff queue with the privacy lens off, showing names and birth dates, next to the same queue with the lens on, showing initials and hidden fields.",
			},
			{
				file: "sala-checkin.webp",
				nodeId: "11:274",
				alt: "Check-in form with two errors that keeps the patient's typed values, next to the confirmation screen showing the symbol Triangle 14.",
			},
			{
				file: "sala-board.webp",
				nodeId: "11:335",
				alt: "Dark waiting-room board listing symbols, token labels, statuses, and wait ranges, with one tile marked Updated.",
			},
			{
				file: "sala-contract.webp",
				nodeId: "11:363",
				alt: "Table listing each screen, who sees it, what it can show, what it never receives, and how that is checked.",
			},
		],
	},
};

function getProjectArg() {
	const index = process.argv.indexOf("--project");
	const project = index === -1 ? "sano" : process.argv[index + 1];
	if (!SOURCES[project]) {
		console.error(`Unknown project "${project}". Use one of: ${Object.keys(SOURCES).join(", ")}`);
		process.exit(1);
	}
	return project;
}

const token = process.env.FIGMA_TOKEN;
if (!token) {
	console.error(
		[
			"FIGMA_TOKEN is not set.",
			"Create one in Figma → Settings → Security → Personal access tokens,",
			'with the read-only "File content" scope, then run:',
			"  FIGMA_TOKEN=… node scripts/export-figma-frames.mjs --project sano",
		].join("\n"),
	);
	process.exit(1);
}

const project = getProjectArg();
const { fileKey, frames } = SOURCES[project];
const outDir = mediaDirFor(project);
const ids = frames.map((frame) => frame.nodeId).join(",");
const endpoint = `https://api.figma.com/v1/images/${fileKey}?ids=${encodeURIComponent(ids)}&format=png&scale=2`;

const response = await fetch(endpoint, { headers: { "X-Figma-Token": token } });
if (!response.ok) {
	console.error(`Figma images request failed: HTTP ${response.status} ${response.statusText}`);
	process.exit(1);
}

const body = await response.json();
if (body.err) {
	console.error(`Figma images request returned an error: ${body.err}`);
	process.exit(1);
}

const rows = [];
const failures = [];

for (const frame of frames) {
	const url = body.images?.[frame.nodeId];
	if (!url) {
		failures.push(`${frame.nodeId} (${frame.file}): Figma returned no image URL`);
		continue;
	}

	try {
		const png = await fetch(url);
		if (!png.ok) throw new Error(`download HTTP ${png.status}`);
		const buffer = Buffer.from(await png.arrayBuffer());
		const result = await writeWebp(buffer, join(outDir, frame.file), frame.file);
		rows.push({ ...frame, ...result });
	} catch (error) {
		failures.push(`${frame.nodeId} (${frame.file}): ${error.message}`);
	}
}

const manifestPath = updateManifest(
	outDir,
	rows.map(({ file, width, height, nodeId, alt }) => ({
		file,
		width,
		height,
		source: { type: "figma", fileKey, nodeId },
		alt,
	})),
);

printReport(rows);
console.log(`\nManifest: ${manifestPath}`);

if (failures.length) {
	console.error(`\n${failures.length} frame(s) failed:\n  ${failures.join("\n  ")}`);
	process.exitCode = 1;
}
