import { projectsRegistry, type ProjectSlug } from "./projects";
import type { ThemeColor } from "../lib/themeColors";

export type MapLink = { label: string; to?: string; href?: string };

// Insertion order keeps the featured work near the center of the arc.
const STAR_PRESENTATION: Partial<Record<ProjectSlug, { line: string; color: ThemeColor }>> = {
	ruvia: { line: "27 + 21 tests", color: "star-ruvia" },
	code4kidz: { line: "29 → 0 failing checks", color: "star-code4kidz" },
	"van-alen": { line: "590+ records migrated", color: "star-van-alen" },
	sano: { line: "0 axe violations · 5 routes · Sept 2026", color: "star-sano" },
	tripcanvas: { line: "313 tests in CI", color: "star-tripcanvas" },
	jt: { line: "LLM proposes, you commit", color: "star-jt" },
	"elite-global": { line: "EN/ES client site", color: "star-elite-global" },
};

export function getStarColor(slug: ProjectSlug): ThemeColor | undefined {
	return STAR_PRESENTATION[slug]?.color;
}

/** The star color for any slug (undefined off the map), so its pages tint the sky to match. */
export function starTint(slug: string): ThemeColor | undefined {
	return STAR_PRESENTATION[slug as ProjectSlug]?.color;
}

export function starCss(color: ThemeColor): string {
	return `var(--color-${color})`;
}

export function getStarSystems() {
	return (Object.keys(STAR_PRESENTATION) as ProjectSlug[]).flatMap((slug) => {
		const project = projectsRegistry[slug];
		const presentation = STAR_PRESENTATION[slug];
		if (!project.onMap || !presentation) return [];

		const { title } = project;
		const isBrief = project.kind === "brief";
		const media = isBrief ? undefined : project.media;
		const primary: MapLink = {
			label: isBrief ? "Read the project brief" : "Read the case study",
			to: isBrief ? `/projects/${slug}` : project.links.caseStudy,
		};
		const secondary: MapLink | undefined = !isBrief && project.links.live
			? { label: project.status === "prototype" ? "Live demo ↗" : "Live site ↗", href: project.links.live }
			: undefined;
		return [{
			...project,
			...presentation,
			title: project.shortTitle ?? title,
			metrics: isBrief ? project.facts : (project.metrics ?? []).slice(0, 3),
			image: media?.hero ? { src: media.hero, alt: media.alt ?? `${title} interface` } : undefined,
			primary,
			secondary,
		}];
	});
}
