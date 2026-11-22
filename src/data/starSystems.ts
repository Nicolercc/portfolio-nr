import { getProject, type ProjectSlug } from "./projects";

/**
 * Everything the star map shows. Case-study projects come from projects.ts;
 * work without a case study (client data work, open-source tools) is listed here
 * with facts taken from the experience section and the public README.
 */
export type MapLink = { label: string; to?: string; href?: string };

export type MapSystem = {
	slug: string;
	title: string;
	/** Short label under the star. */
	line: string;
	role: string;
	tagline: string;
	color: string;
	metrics: { value: string; label: string }[];
	image?: { src: string; alt: string };
	primary: MapLink;
	secondary?: MapLink;
};

const PROJECT_STARS: { slug: ProjectSlug; line: string; color: string; title?: string }[] = [
	{ slug: "sano", line: "0 axe violations, live", color: "#4ade80" },
	{ slug: "code4kidz", line: "29 → 0 failing checks", color: "#ffb86b" },
	{ slug: "tripcanvas", line: "313 tests in CI", color: "#7cc7ff" },
	{ slug: "ruvia", line: "27 + 21 tests", color: "#c3a0e1" },
	{ slug: "elite-global", line: "EN/ES client site", color: "#d4849a", title: "Elite Global" },
];

const EXTRA_STARS: MapSystem[] = [
	{
		slug: "van-alen",
		title: "Van Alen Institute",
		line: "590+ records migrated",
		role: "Data model & migration · Pursuit capstone",
		tagline:
			"One Airtable source of truth for the institute's programs, partners, projects and funding, with staff entry forms, permissions and a guide.",
		color: "#f5c97a",
		metrics: [
			{ value: "590+", label: "Records migrated and verified" },
			{ value: "12", label: "Linked tables" },
			{ value: "27 pp", label: "Staff guide" },
		],
		primary: { label: "Read about the work", href: "#experience" },
	},
	{
		slug: "jt",
		title: "jt · job tracker",
		line: "LLM proposes, you commit",
		role: "Solo builder · open source",
		tagline:
			"A local-first job tracker. Gmail is the reconciliation path, an LLM proposes events, and nothing is committed without you.",
		color: "#7ee0d0",
		metrics: [
			{ value: "~2,800", label: "Lines of Python" },
			{ value: "1", label: "SQLite file, no server" },
			{ value: "Append-only", label: "Event log" },
		],
		primary: { label: "View on GitHub", href: "https://github.com/Nicolercc/jt" },
	},
];

export function getStarSystems(): MapSystem[] {
	const fromProjects = PROJECT_STARS.flatMap(({ slug, line, color, title }) => {
		const p = getProject(slug);
		if (!p) return [];
		const system: MapSystem = {
			slug,
			title: title ?? p.title,
			line,
			role: p.role,
			tagline: p.tagline,
			color,
			metrics: (p.metrics ?? []).slice(0, 3),
			image: p.media.hero ? { src: p.media.hero, alt: p.media.alt ?? `${p.title} interface` } : undefined,
			primary: { label: "Open case study", to: `/projects/${slug}` },
			secondary: p.links.live ? { label: "Live site ↗", href: p.links.live } : undefined,
		};
		return [system];
	});
	// Interleave so the brightest work sits at the centre of the arc.
	const [sano, c4k, trip, ruvia, egcs] = fromProjects;
	const [vanAlen, jt] = EXTRA_STARS;
	return [ruvia, c4k, vanAlen, sano, trip, jt, egcs].filter(Boolean);
}
