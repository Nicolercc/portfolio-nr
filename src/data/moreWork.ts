export type MoreWorkStatus = "In progress" | "Live";

export type MoreWorkLink = {
	label: string;
	href: string;
};

export type MoreWorkItem = {
	title: string;
	status: MoreWorkStatus;
	kind: string;
	summary: string;
	links: MoreWorkLink[];
};

/** Additional engineering breadth. Not flagship case studies; status reflects what is actually deployed. */
export const MORE_WORK: MoreWorkItem[] = [
	{
		title: "Ruvia",
		status: "Live",
		kind: "Responsible AI · Decision-support prototype",
		summary:
			"An evidence-first recruiting prototype: the model proposes criterion-level evidence, deterministic code scores it against a frozen rubric, and a recruiter makes every call. The live demo runs on seeded data and is labelled as demo output; uploads fail closed without a live AI key, and nothing is ever sent.",
		links: [
			{ label: "Case study", href: "/projects/ruvia" },
			{ label: "Live demo", href: "https://ruvia.vercel.app/" },
			{ label: "GitHub", href: "https://github.com/Nicolercc/HR-AGENT" },
		],
	},
	{
		title: "TripCanvas",
		status: "In progress",
		kind: "Product systems prototype",
		summary:
			"A browser-only travel planner prototype built on one demo trip: a typed journey domain, a deterministic day-load engine that explains its verdicts, and an accessible day-by-day ribbon. Not deployed.",
		links: [
			{ label: "Case study", href: "/projects/tripcanvas" },
			{ label: "GitHub", href: "https://github.com/Nicolercc/travel-agent" },
		],
	},
	{
		title: "Impactify 2.0",
		status: "Live",
		kind: "Full-stack developer · Civic intelligence",
		summary:
			"Plain-English civic issue briefings from Guardian News API data and Claude, with one curated action per issue. Rebuilt from Firebase and Vite to the Next.js App Router for a capstone demo.",
		links: [
			{ label: "Live site", href: "https://impactify2-0.vercel.app/" },
			{ label: "GitHub", href: "https://github.com/Nicolercc/impactify2.0" },
		],
	},
];
