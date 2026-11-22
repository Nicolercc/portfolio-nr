import type { ProjectSlug } from "./projects";

/**
 * Claims grounded in the project write-up or linked public evidence.
 */
export type Receipt = {
	id: string;
	claim: string;
	project: string;
	slug: ProjectSlug;
	rows: { label: string; value: string }[];
	/** How the claim was checked, in one line. */
	method: string;
	/** What the claim does not cover. */
	scope: string;
	sources?: { label: string; href: string }[];
};

export const RECEIPTS: Receipt[] = [
	{
		id: "sano-axe",
		claim: "0 axe violations on 5 tested routes · Sept 2026",
		project: "Sano",
		slug: "sano",
		rows: [
			{ label: "tool", value: "axe-core · WCAG 2.2 A/AA" },
			{ label: "pages", value: "5 live routes" },
			{ label: "widths", value: "320 · 390 · 1440px" },
			{ label: "violations", value: "0" },
			{ label: "contrast", value: "3.60:1 → 8.22:1" },
			{ label: "checked", value: "2026-09-30" },
		],
		method: "Re-checked on the live app after the redesign merged.",
		scope: "Scoped audit of the critical journey, not a conformance claim.",
	},
	{
		id: "c4k-checks",
		claim: "29 broken answer checks → 0",
		project: "Code4Kidz",
		slug: "code4kidz",
		rows: [
			{ label: "cases", value: "123" },
			{ label: "failing before", value: "29" },
			{ label: "failing after", value: "0" },
			{ label: "tests", value: "198 unit + 12 e2e" },
			{ label: "axe per screen", value: "3–6 → 0" },
			{ label: "enforced", value: "GitHub Actions CI" },
		],
		method: "Each step: the starter must fail, a correct answer must pass, near-misses must fail.",
		scope: "No by-ear screen reader test yet.",
	},
	{
		id: "tripcanvas-tests",
		claim: "313 tests guarding a trip-planner prototype",
		project: "TripCanvas",
		slug: "tripcanvas",
		rows: [
			{ label: "unit + component", value: "283" },
			{ label: "end-to-end", value: "30 Playwright" },
			{ label: "axe routes", value: "12 jsdom · 7 Chromium" },
			{ label: "widths", value: "phone + desktop" },
			{ label: "status", value: "CI green" },
		],
		method: "Vitest, Playwright journeys and axe run on every push.",
		scope: "Interactive prototype on a curated demo trip.",
	},
	{
		id: "jt-review",
		claim: "The review workflow has a public walkthrough and passing CI",
		project: "jt · job tracker",
		slug: "jt",
		rows: [
			{ label: "Walkthrough", value: "Synthetic email and a disposable SQLite database" },
			{ label: "Review", value: "Approval records the event and decision together" },
			{ label: "CI run #123", value: "Passed" },
		],
		method: "The README documents a synthetic email held for review, approved by the user, and turned into a deadline.",
		scope: "The public evidence covers the synthetic workflow and automated checks. Live inboxes require separate evaluation.",
		sources: [
			{ label: "Read the walkthrough", href: "https://github.com/Nicolercc/jt#try-it-with-synthetic-data" },
			{ label: "View CI run", href: "https://github.com/Nicolercc/jt/actions/runs/44926976407" },
		],
	},
];
