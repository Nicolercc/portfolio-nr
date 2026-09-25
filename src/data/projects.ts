export type ProjectStatus = "live" | "case-study" | "in-progress" | "archived";

export type ProjectMetric = {
	value: string;
	label: string;
};

export type ProjectLinks = {
	live?: string;
	github?: string;
	caseStudy?: string;
};

export type ProjectMedia = {
	hero?: string;
	detail?: string;
	video?: string;
	poster?: string;
	alt?: string;
	placeholder?: string;
	/** 1200×630 JPEG for link previews (crawlers handle WebP unreliably) */
	social?: string;
};

export type CaseStudyGlanceItem = {
	label: string;
	value: string;
};

export type CaseStudyWalkthroughStep = {
	title: string;
	description: string;
	media?: string;
	mediaFit?: "cover" | "contain";
};

export type CaseStudyDecisionCard = {
	title: string;
	/** @deprecated Prefer context + tradeOff + result when structured */
	body?: string;
	context?: string;
	tradeOff?: string;
	result?: string;
};

export type CaseStudyArchitectureLayer = {
	title: string;
	description: string;
};

export type CaseStudyPersona = {
	name: string;
	summary: string;
	issueAreas: string[];
	timeConstraint: string;
};

export type CaseStudyCta = {
	label: string;
	href: string;
	kind: "live" | "github" | "case-study";
};

export type ProjectCaseStudy = {
	thesis: string;
	problem: string;
	solution: string;
	technicalHighlights: string[];
	decisions: string;
	ux: string;
	architecture: string;
	performance: string;
	impact: string;
	lessons: string[];
	nextSteps?: string;
	/** Brief-aligned sections — optional; populated per project when structured copy exists */
	atAGlance?: CaseStudyGlanceItem[];
	walkthrough?: CaseStudyWalkthroughStep[];
	decisionCards?: CaseStudyDecisionCard[];
	architectureLayers?: CaseStudyArchitectureLayer[];
	persona?: CaseStudyPersona;
	cta?: CaseStudyCta[];
	/** Title match for a decision card to highlight above the fold */
	featuredDecisionTitle?: string;
	/** One-line scan summary for the featured decision (shown in At a Glance) */
	featuredDecisionSummary?: string;
};

export type HomepageVisual = {
	label: string;
	bg: string;
	icon: string;
	stat?: string;
};

export type ProjectHomepage = {
	accent: "rose" | "green";
	index: string;
	images: HomepageVisual[];
	highlights: string[];
};

export type Project = {
	slug: ProjectSlug;
	title: string;
	shortTitle?: string;
	category: string;
	year: string;
	status: ProjectStatus;
	role: string;
	tagline: string;
	description: string;
	stack: string[];
	metrics?: ProjectMetric[];
	links: ProjectLinks;
	media: ProjectMedia;
	caseStudy: ProjectCaseStudy;
	homepage: ProjectHomepage;
};

export type ProjectSlug =
	| "sano"
	| "impactify"
	| "nuclear-router"
	| "elite-global"
	| "code4kidz"
	| "tripcanvas";

/** Homepage + projects index display order */
export const SHOWCASE_PROJECT_SLUGS = [
	"sano",
	"code4kidz",
	"tripcanvas",
] as const satisfies readonly ProjectSlug[];

const projects: Record<ProjectSlug, Project> = {
	sano: {
		slug: "sano",
		title: "Sano",
		category: "Public Data · Full-Stack",
		year: "2026",
		status: "live",
		role: "Full-Stack Engineer · Data Systems",
		tagline:
			"Restaurant discovery that reads beyond the letter grade — then proves its critical journey with an accessibility audit, regression checks, and rendered evidence.",
		description:
			"Sano turns public NYC DOHMH restaurant inspection records into readable context, then documents a scoped accessibility upgrade across search, results, profile, and methodology flows.",
		stack: [
			"Next.js",
			"TypeScript",
			"Tailwind CSS",
			"Supabase",
			"PostgreSQL",
			"PostGIS",
			"Python",
			"MapLibre",
			"Recharts",
			"Vercel",
		],
		metrics: [
			{ value: "12", label: "Audit findings logged" },
			{ value: "8.22:1", label: "Hero label contrast" },
			{ value: "500ms", label: "Live-status debounce" },
			{ value: "Live", label: "Demo verified" },
		],
		links: {
			live: "https://sano-nine.vercel.app/",
			github: "https://github.com/Nicolercc/Sano",
			caseStudy: "/projects/sano",
		},
		media: {
			hero: "/media/sano-hero-optimized.webp",
			detail: "/media/sano-detail.webp",
			poster: "/media/sano-hero-optimized.webp",
			social: "/social/sano.jpg",
			alt: "Sano restaurant inspection history interface",
		},
		caseStudy: {
			thesis:
				"A strong civic data product does two things at once: it makes public records easier to understand, and it proves the interface can be used by people who do not navigate like the builder.",
			problem:
				"Sano already translated NYC restaurant inspection histories into plain-English context, but the critical journey still had accessibility debt: low-contrast helper text, filter controls with weak focus states, a hero search that did not hand keyboard users into the results flow, and visual-only status changes for search progress and empty states.",
			solution:
				"I treated the accessibility pass like production engineering, not polish. I audited the search to profile journey, converted checkable findings into regression scripts, corrected contrast through reusable tokens, added visible keyboard focus and focus handoff, introduced a debounced polite live region for search status, and preserved before/after screenshots as evidence.",
			technicalHighlights: [
				"Scoped accessibility audit across search, results, restaurant profile, not-found, and methodology routes",
				"Automated contrast calculations for audited tokens plus source-level regression checks for focus, live regions, and debounce behavior",
				"Rendered evidence set with desktop and mobile screenshots tied back to individual findings",
				"Live acceptance check covering health, search API, homepage, profile, not-found, methodology, and demo search chips",
				"Merged the audit into the redesigned production UI and re-verified it there: axe-core (WCAG 2.0–2.2 A/AA rules) reports 0 violations on home, results, empty state, profile, methodology, and not-found at desktop and 390px mobile widths",
			],
			decisions:
				"The important engineering move was separating one-time proof from ongoing guarantees. Screenshots prove the fix landed; scripts make the most mechanical parts hard to regress. The case study is careful not to claim full WCAG conformance, because the audit covered one critical journey rather than the entire application.",
			ux: "Sano is decision support, not a verdict, so the hierarchy is deliberate: official grade first, derived signals second, limitations always visible. Loading states announce themselves once, empty states explain what is and is not in the index (including that ZIP-level records are not in the current extract), and route-level error screens offer a retry and a path to the methodology. The upgraded flow respects the way users actually move through the product: submit from the hero, land visibly in the results region, refine filters with strong focus indicators, hear concise search status updates through one polite live region, and reach a profile whose score panel is exposed as a real heading.",
			architecture:
				"Next.js and TypeScript power the product UI, while the accessibility layer is enforced with small repository-local checks: token contrast recalculation, source assertions for focus-visible styling, route semantics checks, live-region count checks, and acceptance coverage for the demo path.",
			performance:
				"The pass avoided a heavy accessibility framework and focused on fast checks that fit the app: lint/build, deterministic contrast math, targeted source assertions, and a live acceptance script. That keeps the validation loop light enough to run before publication.",
			impact:
				"The result is an interview-ready story with working software, specific accessibility fixes, reproducible evidence, and honest scope: validated improvements to the critical Sano journey, not a blanket certification claim.",
			lessons: [
				"Accessibility bugs that are mechanically checkable should become tests, not recurring checklist chores.",
				"Design tokens are the right level for recurring contrast problems; per-component fixes leave the bug class alive.",
				"Evidence matters, but scope matters too: screenshots, scripts, and rendered checks should say exactly what they prove and what they do not.",
			],
			nextSteps:
				"Run a final by-ear VoiceOver/NVDA pass, complete 400% zoom/reflow coverage, return a true 404 status for unknown restaurant IDs (the page is correct but streams with 200), refine small-screen timeline marker perception, and continue expanding automated checks only where they catch real regressions without becoming maintenance theater.",
			atAGlance: [
				{ label: "Role", value: "Full-Stack Engineer · Data Systems" },
				{
					label: "Ownership",
					value:
						"I built the product audit, accessibility fixes, validation scripts, evidence captures, and case-study writeup for the critical Sano journey.",
				},
				{ label: "Status", value: "Live" },
				{
					label: "Audit scope",
					value: "Critical journey: search → results → restaurant profile → methodology",
				},
				{
					label: "Core stack",
					value: "Next.js · TypeScript · Tailwind · Node validation scripts · Vercel",
				},
				{
					label: "Automated gates",
					value: "Contrast math · focus assertions · live-region checks · route acceptance",
				},
				{
					label: "Evidence",
					value: "Before/after screenshots, rendered browser checks, validation docs, and clean Git history",
				},
				{
					label: "Data",
					value:
						"Curated extract of 16 restaurants from 11,460 normalized NYC DOHMH records; provenance is published in the methodology and the health endpoint",
				},
				{
					label: "Scope note",
					value: "Validated accessibility improvements, not a full-app WCAG conformance claim",
				},
			],
			featuredDecisionTitle: "Proof once vs. guarantee always",
			featuredDecisionSummary:
				"Moved mechanical accessibility checks into scripts while preserving manual review for the parts automation cannot honestly prove.",
			walkthrough: [
				{
					title: "Keep the official record first",
					description:
						"Each profile leads with the city-posted grade, cycles on file, and the extract date, sourced from NYC DOHMH public inspection records. Google review context sits in a separate, labelled panel and is left empty when no match exists; Sano's derived reliability score never replaces the official grade.",
					media: "/media/sano-detail.webp",
					mediaFit: "contain",
				},
				{
					title: "Start with the actual critical journey",
					description:
						"The audit focused on the path a reviewer or diner would actually use: landing search, result filters, restaurant profile, and methodology. That kept the work concrete and made every finding tied to a task. This baseline was captured before the audit began.",
					media: "/media/sano-case-study/01-before-desktop-landing.jpg",
					mediaFit: "contain",
				},
				{
					title: "Fix contrast and demo reliability together",
					description:
						"Low-opacity text tokens were raised to audited values, and every hero demo chip (Manhattan, Brooklyn, Coffee, and the featured restaurant) is verified against the live data extract. Earlier chips like \"11101\" and \"Thai\" returned zero results; the acceptance script now fails if any rendered chip does.",
					media: "/media/sano-case-study/02-after-desktop-hero.webp",
					mediaFit: "contain",
				},
				{
					title: "Move keyboard focus into the results flow",
					description:
						"After hero search submission, focus now lands on the search/results heading instead of leaving keyboard users behind in the hero.",
					media: "/media/sano-case-study/03-focus-handoff.webp",
					mediaFit: "contain",
				},
				{
					title: "Make filter focus visible",
					description:
						"Filter inputs and selects now share an explicit focus-visible treatment with outline, offset, width, and color changes that do not rely on border color alone.",
					media: "/media/sano-case-study/04-filter-focus.webp",
					mediaFit: "contain",
				},
				{
					title: "Announce status without chatter",
					description:
						"One polite live region announces loading, result counts, empty states, and errors. Query typing uses a 500ms debounce so assistive technology users do not hear an update on every keystroke.",
					media: "/media/sano-case-study/05-live-status.webp",
					mediaFit: "contain",
				},
				{
					title: "Preserve semantics on the profile route",
					description:
						"The score panel label became a real heading, and route checks confirm profile and not-found pages expose named structure instead of anonymous sections or navigation.",
					media: "/media/sano-case-study/06-profile-heading.webp",
					mediaFit: "contain",
				},
				{
					title: "Check the small-screen evidence",
					description:
						"Mobile viewports were captured for the hero and inspection timeline so the case study shows the product beyond a desktop-only happy path.",
					media: "/media/sano-case-study/08-mobile-timeline.webp",
					mediaFit: "contain",
				},
			],
			decisionCards: [
				{
					title: "Merge the audit into the redesign, not around it",
					context:
						"The accessibility work was done on a branch while the homepage redesign shipped separately, so production had the new look without any of the fixes.",
					tradeOff:
						"Copying either branch wholesale was faster, but would have discarded the redesign or the accessibility work.",
					result:
						"Kept the redesign's layout and palette, re-derived the accessible text tokens for the new colors, and re-ran every check on the merged UI, which surfaced seven new contrast failures and an unfocusable chart before release.",
				},
				{
					title: "Proof once vs. guarantee always",
					context:
						"Manual screenshots prove a fix landed, but they do not stop the same bug from returning later.",
					tradeOff:
						"Adding small targeted checks takes more time than a one-off visual pass, but avoids pretending memory is a process.",
					result:
						"Contrast pairs, focus hooks, one-live-region guarantees, debounce behavior, and demo chip reliability now run as repeatable checks.",
				},
				{
					title: "Design tokens over scattered patches",
					context:
						"The same low-contrast opacity classes appeared across hero copy, helper text, status labels, and profile metadata.",
					tradeOff:
						"Changing tokens and adding class guards is broader than editing one visible call site.",
					result:
						"The audited text pairs now meet the target ratios, and risky meaningful-text classes are blocked unless intentionally allowlisted.",
				},
				{
					title: "One live region, delayed query announcements",
					context:
						"Search state changed visually, but screen-reader users needed status messages without hearing every keystroke.",
					tradeOff:
						"Immediate announcements feel responsive for discrete filter changes, while typed query updates need restraint.",
					result:
						"The app keeps one atomic polite status region and waits 500ms after query typing settles before announcing the final state.",
				},
				{
					title: "Scope the claim like an engineer",
					context:
						"Portfolio case studies often overstate accessibility work as if a few fixes equal certification.",
					tradeOff:
						"Honest limits are less flashy than a conformance badge, but they are more credible in an interview.",
					result:
						"The case study names the audited journey, the automated gates, the rendered evidence, and the remaining human checks.",
				},
			],
			architectureLayers: [
				{
					title: "Product surface",
					description:
						"Next.js + TypeScript interface for search, filters, restaurant cards, profile pages, not-found recovery, and methodology disclosure.",
				},
				{
					title: "Accessibility guardrails",
					description:
						"Repository-local scripts check audited contrast pairs, risky text classes, focus-visible coverage, focus handoff, live-region count, and debounce wiring.",
				},
				{
					title: "Rendered validation",
					description:
						"Chrome evidence captures verify focus handoff, filter focus, live-status empty state, profile heading semantics, not-found navigation, and mobile timeline readability.",
				},
				{
					title: "Release hygiene",
					description:
						"Acceptance checks exercise live routes and demo chips, while cleaned Git history removes leaked browser-chrome screenshots before publication.",
				},
			],
		},
		homepage: {
			accent: "green",
			index: "01",
			images: [
				{
					label: "Accessibility Audit",
					bg: "from-green/20 to-transparent",
					icon: "✓",
					stat: "12 findings · rendered evidence",
				},
				{
					label: "Regression Gates",
					bg: "from-rose/20 to-transparent",
					icon: "↗",
					stat: "Contrast · focus · live status",
				},
			],
			highlights: [
				"Audited the critical journey from landing search through profile and methodology",
				"Converted contrast, focus, live-region, and demo-chip regressions into targeted checks",
				"Captured before/after evidence across desktop, keyboard flow, and mobile viewports",
				"Published as scoped validated improvements, not an overbroad WCAG conformance claim",
			],
		},
	},

	impactify: {
		slug: "impactify",
		title: "Impactify",
		category: "Civic Tech · Full-Stack",
		year: "2024–2025",
		status: "live",
		role: "Lead Developer",
		tagline:
			"Civic engagement for the overwhelmed but informed. One curated action per issue, per week — built for the person who cares but has 10 minutes.",
		description:
			"Rebuilt the entire stack from Firebase/Vite to Next.js App Router under deadline for a BlackRock capstone demo. Guardian News API + Claude AI generate plain-English civic issue briefings, designed around cacheable daily briefing windows in Supabase — confident prose with one citation beats source carousels.",
		stack: [
			"Next.js 14 (App Router)",
			"TypeScript",
			"Tailwind CSS",
			"Supabase",
			"Anthropic API",
			"Guardian News API",
			"Vercel",
		],
		metrics: [
			{ value: "Weekly", label: "Briefing cadence" },
			{ value: "3", label: "Core product screens" },
			{ value: "Capstone", label: "Demo presentation" },
		],
		links: {
			live: "https://impactify2-0.vercel.app/",
			caseStudy: "/projects/impactify",
		},
		media: {
			hero: "/media/impactify-hero.webp",
			detail: "/media/impactify-weekly-briefing.webp",
			poster: "/media/impactify-hero.webp",
			alt: "Impactify civic engagement app demo",
		},
		caseStudy: {
			thesis:
				"Civic engagement for the overwhelmed but informed. One curated action per issue, per week — built for the person who cares but has 10 minutes.",
			problem:
				"Civic platforms fail the people who already care. They assume users are either uninformed or have unlimited time — neither fits Sofia, a design persona: a 27-year-old NYC resident who follows the news, cares deeply about housing and immigration, and has about 10 minutes on a weekday evening. I built Impactify around that scenario: not more awareness, but a single clear action with everything needed to take it.",
			solution:
				"Rebuilt the entire stack from Firebase/Vite to Next.js 14 App Router under deadline for a BlackRock real estate capstone demo at Hudson Yards. The core architectural decision: Promise.all parallelizes all briefing page fetches — replacing v1's sequential API waterfall. Guardian News API and Claude civic issue briefings fetch in parallel; neither blocks the other. Anthropic API calls happen server-side only, with responses designed around cacheable daily briefing windows in Supabase — reducing repeated API costs and keeping copy consistent. The editorial thesis that drove every content decision: confident prose with one citation beats source carousels.",
			technicalHighlights: [
				"Full stack rebuild under deadline: Firebase/Vite → Next.js App Router for capstone demo presentation",
				"Claude generates civic issue briefings server-side, with Supabase-backed caching — fewer repeated API calls on every visit",
				"Promise.all parallelizes briefing fetches, replacing v1's sequential API waterfall",
				"Designed around Sofia — a named design persona — not validated user research",
			],
			decisions:
				"Rebuilt the entire stack from Firebase/Vite to Next.js 14 App Router under deadline for a BlackRock real estate capstone demo at Hudson Yards. Promise.all parallelizes all briefing page fetches — replacing v1's sequential API waterfall. Guardian News API and Claude civic issue briefings fetch in parallel; neither blocks the other. Anthropic API calls happen server-side only, with responses designed around cacheable daily briefing windows in Supabase. The editorial thesis: confident prose with one citation beats source carousels.",
			ux: "Three-screen flow designed around decision fatigue. Onboarding: pick 2–3 issues via chips, enter zip code. Weekly Briefing: AI summary banner, one action widget, Guardian news cards, rep sidebar always sticky. My Reps: voting records with contact forms. The design persona should never have to decide what to read next — the product decides for her and shows its work with a single citation.",
			architecture:
				"Next.js App Router with server components for data fetching — Guardian and Anthropic API calls happen server-side so keys never reach the client. Supabase backing designed around cacheable daily briefing windows so repeat visits avoid unnecessary refetching. Claude generates civic issue briefings and action copy server-side, cached on first generation. Promise.all parallelizes all briefing page fetches — replacing the sequential waterfall from v1. Skeleton loading with exact grid dimensions matching the final layout reduces layout shift.",
			performance:
				"Server-side rendering with Supabase-backed caching keeps the Weekly Briefing responsive on repeat visits. Guardian API articles fetched in parallel with Claude civic issue briefings — neither blocks the other. Sticky sidebar pattern with no competing scrollbars and a Suspense boundary around the AI briefing slot.",
			impact:
				"Selected for BlackRock real estate capstone demo at Hudson Yards — presented as a presentation-ready civic technology product. Executed a full stack migration under deadline: Firebase authentication and Firestore replaced with Next.js App Router server components and Supabase. Preserved the live demo path during migration.",
			lessons: [
				"Building for a named design persona with a specific life situation produces sharper product decisions than building for 'users'.",
				"Caching Claude civic issue briefings in Supabase matters — uncached API calls on every page load create both cost and consistency risk.",
				"The product advantage in civic tech is editorial judgment, not data breadth — one good sentence beats five sources.",
				"A full stack rebuild under deadline is a different skill than greenfield development — scope control matters more than clean architecture.",
			],
			nextSteps:
				"Add push notification support for time-sensitive civic moments. Build a shareable civic record showing actions taken over time. Expand issue areas beyond NYC.",
			atAGlance: [
				{ label: "Role", value: "Lead Developer" },
				{
					label: "Ownership",
					value:
						"I led the Firebase/Vite to Next.js rebuild, server-side AI briefing flow, Supabase caching design, and capstone-ready product narrative.",
				},
				{ label: "Status", value: "Live" },
				{ label: "Timeline", value: "2024–2025" },
				{
					label: "Capstone",
					value: "BlackRock real estate demo at Hudson Yards",
				},
				{
					label: "Core stack",
					value: "Next.js 14 App Router · TypeScript · Supabase · Vercel",
				},
				{
					label: "Integrations",
					value: "Guardian News API · Anthropic",
				},
			],
			walkthrough: [
				{
					title: "Onboarding",
					description:
						"Pick 2–3 issues via chips, enter zip code.",
					media: "/media/impactify-onboarding.webp",
				},
				{
					title: "Weekly Briefing",
					description:
						"AI summary banner, one action widget, Guardian news cards, rep sidebar always sticky.",
					media: "/media/impactify-weekly-briefing.webp",
				},
				{
					title: "My Reps",
					description: "Voting records with contact forms.",
					media: "/media/impactify-my-reps.webp",
				},
			],
			featuredDecisionTitle: "Parallel briefing fetches",
			featuredDecisionSummary:
				"Parallelized briefing fetches and cached server-side AI output to reduce repeated work and keep the weekly briefing responsive.",
			decisionCards: [
				{
					title: "Rebuild under deadline",
					context:
						"Capstone demo presentation required a modern Next.js foundation; v1 was Firebase/Vite.",
					tradeOff:
						"Less time for polish and incremental migration vs. delivering a coherent App Router architecture on stage.",
					result:
						"Firebase/Vite replaced with Next.js App Router in time for the capstone demo.",
				},
				{
					title: "Parallel briefing fetches",
					context:
						"v1 loaded Guardian and Claude data sequentially on the briefing page.",
					tradeOff:
						"More server-side coordination vs. simpler sequential fetch code.",
					result:
						"Promise.all parallelizes briefing fetches, replacing v1's sequential API waterfall.",
				},
				{
					title: "Cached server-side AI",
					context:
						"Civic issue briefings needed Claude on the server without repeating calls every visit.",
					tradeOff:
						"Daily cached copy vs. fresh generation on every page load.",
					result:
						"Server-side civic issue briefings with Supabase-backed caching designed around daily briefing windows.",
				},
				{
					title: "Editorial judgment over breadth",
					context:
						"Civic products often surface many sources and let users choose what to read.",
					tradeOff:
						"One authoritative voice vs. comprehensive source lists.",
					result:
						"Confident prose with one citation beats source carousels.",
				},
			],
			architectureLayers: [
				{
					title: "App shell",
					description:
						"Next.js App Router with server components for data fetching — API keys never reach the client.",
				},
				{
					title: "Cache layer",
					description:
						"Supabase backing designed around cacheable daily briefing windows so repeat visits avoid unnecessary refetching.",
				},
				{
					title: "Integrations",
					description:
						"Guardian News API and Anthropic API calls happen server-side; Claude generates civic issue briefings and action copy, cached on first generation.",
				},
				{
					title: "Briefing assembly",
					description:
						"Promise.all parallelizes all briefing page fetches — replacing the sequential waterfall from v1. Skeleton loading with exact grid dimensions reduces layout shift.",
				},
			],
			persona: {
				name: "Sofia",
				summary:
					"A design persona — 27-year-old NYC resident who follows the news, cares about housing and immigration, and has about 10 minutes on a weekday evening.",
				issueAreas: ["housing", "immigration"],
				timeConstraint: "~10 minutes on a weekday evening",
			},
		},
		homepage: {
			accent: "green",
			index: "02",
			images: [
				{
					label: "Weekly Briefing",
					bg: "from-green/20 to-transparent",
					icon: "📰",
					stat: "Guardian API · Claude AI · cached briefings",
				},
				{
					label: "Capstone Demo",
					bg: "from-rose/20 to-transparent",
					icon: "🗳️",
					stat: "Next.js App Router · rebuilt under deadline",
				},
			],
			highlights: [
				"Full stack rebuild under deadline: Firebase/Vite → Next.js App Router for capstone demo presentation",
				"Claude generates civic issue briefings server-side, with Supabase-backed caching",
				"Promise.all parallelizes briefing fetches, replacing v1's sequential API waterfall",
				"Designed around Sofia — a named design persona — not validated user research",
			],
		},
	},

	code4kidz: {
		slug: "code4kidz",
		title: "Code4Kidz",
		category: "EdTech · Frontend",
		year: "2026",
		status: "live",
		role: "Product Designer & Frontend Engineer",
		tagline:
			"An HTML and CSS course for kids aged 7–10 that builds a real webpage about whatever they love — prototyped fast with AI, then audited and re-engineered until it actually checked their work.",
		description:
			"I designed the product and wrote the curriculum, prototyped it with Replit Agent, then audited the result like a senior reviewer: tests showed 29 of 123 answer-check cases were wrong, feedback was silent to screen readers, and the lesson screen broke on phones. I re-engineered it with pure validators, a tested lesson state machine and an accessibility pass enforced in CI.",
		stack: [
			"React 19",
			"TypeScript",
			"Zustand",
			"CodeMirror 6",
			"Tailwind CSS",
			"Vitest",
			"Playwright",
			"axe-core",
		],
		metrics: [
			{ value: "29 → 0", label: "Failing answer-check cases" },
			{ value: "0", label: "axe violations, every screen" },
			{ value: "210", label: "Automated tests" },
			{ value: "−60%", label: "First-load JavaScript" },
		],
		links: {
			live: "https://code4kidz-six.vercel.app/",
			github: "https://github.com/Nicolercc/C4K",
			caseStudy: "/projects/code4kidz",
		},
		media: {
			hero: "/media/code4kidz-case-study/hero.webp",
			detail: "/media/code4kidz-case-study/feedback-hint.webp",
			poster: "/media/code4kidz-case-study/hero.webp",
			social: "/social/code4kidz.jpg",
			alt: "Code4Kidz lesson screen: instructions, a code editor with the learner's CSS, and a live preview of their Dinosaurs page",
		},
		caseStudy: {
			thesis:
				"A polished demo can hide a product that does not do its core job. For a coding course, that job is simple: know whether the learner actually wrote the code, and tell every learner — including one using a screen reader — what happened.",
			problem:
				"Kids bounce off coding when their first code is abstract, so Code4Kidz starts from what they love: pick a topic, and every lesson builds a real page about it. The AI-built prototype looked finished, but my tests found that the answer checks passed code the learner never wrote (a CSS step passed on a single space), XP and mistake review never fired because of a stale editor callback, feedback was invisible to screen readers, and pausing to think for 2.5 seconds counted as a mistake that could cost a heart.",
			solution:
				"I treated the prototype as a codebase to audit, not a demo to polish. I wrote the tests first — for every lesson step, the untouched starter must fail, a correct answer must pass, and realistic near-misses must fail — then rebuilt the checks as pure functions of the learner's code. The lesson loop moved into a tested reducer and hook that own every timer, the lesson screen got one screen-reader status channel and real controls, the fail model stopped penalising pauses, and the layout was rebuilt for phones. Each fix is a small commit with before/after evidence.",
			technicalHighlights: [
				"Validators became pure functions of the learner's code: CSS checks read their own <style> rules through the browser's CSS parser instead of the preview's computed styles",
				"Lesson logic split into a pure attempt reducer, a useTimers hook that cancels everything on unmount, and a useLessonMachine hook tested with fake timers",
				"One polite role=\"status\" channel for Byte's feedback, kept outside panels that phones hide, plus real Continue buttons in place of text blocks labelled as buttons",
				"Preview iframe locked to sandbox=\"\" after reproducing a script escape through allow-scripts + allow-same-origin",
				"Playwright journey and axe suites on desktop and phone in CI; a store migration converts existing saves to the new streak model",
			],
			decisions:
				"The core decision was where truth lives. The original checks asked the rendered preview whether a heading was 'not black', and the preview's own defaults answered yes. Moving validation to the learner's code made it deterministic, unit-testable and independent of the iframe — which in turn let me remove every sandbox permission. I also separated refactors from behaviour changes: the lesson state machine was extracted with identical behaviour first, and the fairer fail model landed in its own commit.",
			ux: "The learning loop now rewards action without punishing thought. Correct code passes automatically when the learner pauses; a mistake only counts when they press Check my code (or Ctrl/Cmd+Enter). Hints are available from the start, the warm-up lost a countdown that turned red and did nothing, and copy that was not true — 'millions of people will see your page', a browser tab that did not exist — was fixed. On phones, one panel shows at a time with an Instructions / Code / Preview switcher.",
			architecture:
				"Six lessons live as typed data with a single registry. validate(step, code, topic) parses the learner's code and runs that step's pure check. A pure attempt reducer and streak module hold the rules; useLessonMachine drives each step through named timers that are cancelled on unmount; Zustand persists progress with a versioned migration. The preview renders the learner's page in a fully sandboxed iframe, and editor routes are code-split.",
			performance:
				"First-load JavaScript dropped from 367 KB to 146 KB gzipped by lazy-loading the editor routes (CodeMirror loads on the first lesson). On the map, a star field defined inside the page component remounted about 130 elements on every mouse move — 180 DOM subtrees torn down over 60 moves; moving parallax to CSS variables in its own component brought that to zero.",
				impact:
					"Every audited screen went from 3–6 axe violations to 0, enforced in CI on desktop and phone. The answer checks went from 29 of 123 failing test cases to none, and the test suite grew from nothing to 198 unit and component tests plus 12 end-to-end tests. The production build is live on Vercel; the remaining evidence gap is by-ear screen-reader testing and real learner feedback.",
			lessons: [
				"Tests that describe what the learner should experience — the starter fails, the right answer passes, pausing is not a mistake — found bugs that code review of the prototype would not.",
				"An accessible name can hide content: role=\"button\" with an aria-label replaced the hint text entirely. Reading the accessibility tree, not just the axe score, is what exposed it.",
				"AI prototyping is a fast way to get to a demo, and a demo is where the engineering starts, not where it ends.",
				],
				nextSteps:
					"Run a by-ear VoiceOver pass and sessions with kids and a teacher, add an opt-in 'Read to me' narration (the auto-playing text-to-speech was removed because it talked over screen readers), and build lessons 7–10.",
			atAGlance: [
				{ label: "Role", value: "Product Designer & Frontend Engineer" },
				{
					label: "Ownership",
					value:
						"I designed the curriculum/product, used AI for the first prototype, then personally audited, tested, refactored, and re-engineered the learning loop.",
				},
					{ label: "Status", value: "Live on Vercel · evidence-scoped case study" },
				{ label: "Audience", value: "Kids aged 7–10, first HTML and CSS" },
				{
					label: "Core stack",
					value: "React 19 · TypeScript · Zustand · CodeMirror 6 · Tailwind CSS",
				},
				{
					label: "Quality gates",
					value: "Vitest · Playwright journeys · axe-core on desktop and phone · GitHub Actions",
				},
				{
					label: "Origin",
					value: "Prototyped with Replit Agent from my specs, then audited and re-engineered",
				},
				{
					label: "Scope note",
					value: "0 axe violations on audited screens, not a WCAG conformance claim; no by-ear screen reader test yet",
				},
			],
			featuredDecisionTitle: "Check the learner's code, not the preview",
			featuredDecisionSummary:
				"Rebuilt answer checks as pure functions of the learner's code, which made them testable, fixed 29 failing cases and let the preview drop every sandbox permission.",
			walkthrough: [
				{
					title: "Start from what the learner loves",
					description:
						"A kid picks a topic and every lesson builds a real page about it, here passing the step that colours their Dinosaurs page. Byte, the mascot, carries instructions and feedback.",
					media: "/media/code4kidz-case-study/hero.webp",
					mediaFit: "contain",
				},
				{
					title: "Let tests say what is wrong",
					description:
						"For every step: the starter must fail, a correct answer must pass, near-misses must fail. 29 of 123 cases failed against the prototype, including a CSS step that passed on a single space.",
					media: "/media/code4kidz-case-study/validators.webp",
					mediaFit: "contain",
				},
				{
					title: "Read the accessibility tree, not just the score",
					description:
						"The hint was exposed as a button labelled 'Press space or tap to continue', which replaced its text, and feedback was never announced. Now there is a main landmark, a live heading, named regions and one status channel.",
					media: "/media/code4kidz-case-study/a11y-tree.webp",
					mediaFit: "contain",
				},
				{
					title: "Feedback you can see, hear and reach",
					description:
						"A checked mistake is announced, the hint is a real disclosure with readable text, and every control has a visible focus ring. Mistakes count only when the learner chooses to check.",
					media: "/media/code4kidz-case-study/feedback-hint.webp",
					mediaFit: "contain",
				},
				{
					title: "Make it work on the device kids have",
					description:
						"At 375px the lesson screen was three crushed columns. Now it shows one panel at a time with a view switcher, and a full lesson plus review was completed at phone width.",
					media: "/media/code4kidz-case-study/phone.webp",
					mediaFit: "contain",
				},
			],
			decisionCards: [
				{
					title: "Check the learner's code, not the preview",
					context:
						"Answer checks read computed styles from the preview iframe, whose own defaults made 'is the heading not black?' pass with no CSS written.",
					tradeOff:
						"Parsing the learner's CSS ignores the full cascade (specificity, inheritance), which the lessons do not need, in exchange for deterministic, testable checks.",
					result:
						"123 of 123 step cases pass, and validation no longer touches the iframe, so the preview runs with sandbox=\"\".",
				},
				{
					title: "Refactor first, change behaviour second",
					context:
						"The lesson page held ~15 unmanaged timers; leaving mid-celebration still advanced the lesson.",
					tradeOff:
						"Two commits instead of one, and resisting fixing the fail model during the refactor.",
					result:
						"A pure reducer, a useTimers hook and useLessonMachine with identical behaviour, proven by tests, before the fail model changed separately.",
				},
				{
					title: "Only count mistakes the learner chooses to check",
					context:
						"Pausing 2.5 seconds with unfinished code counted as a mistake, and every third cost a heart.",
					tradeOff:
						"An extra 'Check my code' action vs. fully automatic grading.",
					result:
						"Passing stays automatic; mistakes, half-XP and hearts only follow an explicit check. Hints are available from the start.",
				},
				{
					title: "One status channel for the tutor",
					context:
						"Byte already talks to every learner, but his messages were not announced and later appeared twice in the tree.",
					tradeOff:
						"A single polite region can queue messages rather than interrupt, which suits tutoring but not urgent errors.",
					result:
						"Every Byte message is announced once through a role=\"status\" kept outside panels that phones hide.",
				},
			],
			architectureLayers: [
				{
					title: "Curriculum as data",
					description:
						"Six typed lessons with {topic}-aware copy, starter code and a pure validator per step, behind one registry for routes, unlock order and copy resolution.",
				},
				{
					title: "Lesson engine",
					description:
						"A pure attempt reducer and streak rules, driven by useLessonMachine through named timers that are cancelled on unmount.",
				},
				{
					title: "Learner-facing shell",
					description:
						"React screens with landmarks, a status channel and real controls; the learner's page renders in a fully sandboxed iframe; editor routes load on demand.",
				},
				{
					title: "Quality gates",
					description:
						"Vitest for rules, hooks and components; Playwright journeys and axe on desktop and phone; GitHub Actions runs typecheck, lint, tests, build and e2e.",
				},
			],
		},
		homepage: {
			accent: "rose",
			index: "03",
			images: [
				{
					label: "Answer Checks",
					bg: "from-rose/20 to-transparent",
					icon: "✓",
					stat: "29 failing cases → 0",
				},
				{
					label: "Accessibility",
					bg: "from-green/20 to-transparent",
					icon: "↗",
					stat: "0 axe violations · enforced in CI",
				},
			],
				highlights: [
					"Designed the product and curriculum, prototyped with AI, then audited and re-engineered it",
					"Rebuilt answer checks as pure, tested functions of the learner's code (29 failing cases → 0)",
					"Lesson screen made usable by screen reader, keyboard and phone, with axe enforced in CI",
					"Scoped honestly: live on Vercel, not yet tested by ear with a screen reader or real learners",
				],
		},
	},
	tripcanvas: {
		slug: "tripcanvas",
		title: "TripCanvas",
		shortTitle: "TripCanvas",
		category: "Travel Planning · Interaction Design",
		year: "2026",
		status: "case-study",
		role: "Product Designer & Engineer",
		tagline:
			"An interactive product prototype exploring how travelers turn scattered recommendations into a structured journey — and learn, with reasons, when a day won't work.",
		description:
			"TripCanvas is an interactive prototype for the person who ends up planning the group trip: it turns saved places into days, judges each day with a transparent day-load engine, and surfaces what needs attention before departure.",
		stack: [
			"React",
			"TypeScript",
			"Vite",
			"Tailwind CSS",
			"Radix UI",
			"Zod",
			"Vitest",
			"Playwright + axe",
		],
		links: {
			github: "https://github.com/Nicolercc/travel-agent",
			caseStudy: "/projects/tripcanvas",
		},
		media: {
			hero: "/media/tripcanvas-case-study/trip-pulse.webp",
			detail: "/media/tripcanvas-case-study/itinerary.webp",
			poster: "/media/tripcanvas-case-study/trip-pulse.webp",
			social: "/social/tripcanvas.jpg",
			alt: "TripCanvas Trip Pulse screen: a 'Needs you' list of critical and high-priority tasks above the JourneyRibbon of trip days, each labelled Comfortable or Full",
		},
		caseStudy: {
			thesis:
				"Travel planning breaks when every saved place looks equally urgent. A useful planner helps decide what matters, what fits in a day, and what should wait.",
			problem:
				"The user is the friend or family member who becomes the planner for an experience-heavy leisure trip. Their inputs are scattered: restaurant tips, landmarks, screenshots, pins, reservation windows, flights and ferries, and a group that still expects an easy plan. Most tools store those places; few tell you whether a day is actually livable.",
			solution:
				"I designed and built TripCanvas around three moves: capture everything into an Inbox, assign places to days as anchor, planned, optional, or backup, and let a day-load engine judge each day. Trip Pulse then shows what needs attention now, and the JourneyRibbon lets the planner scan the whole trip and open any day. The prototype runs on a curated demo trip stored in the browser; live place data, accounts, and booking are not connected yet.",
			technicalHighlights: [
				"Day-load engine returns one of four ordinal verdicts — Comfortable, Full, Tight, Overloaded — with reason codes and, for tight days, the single change that helps most",
				"Durations come from each plan, its time window, or a labelled category estimate; estimate-heavy days say so instead of implying precision",
				"JourneyRibbon implements the WAI-ARIA tabs pattern: roving tabindex, Arrow/Home/End keys, a labelled tab panel, 44px targets, and reduced-motion-aware scrolling",
				"Typed, Zod-validated trip model with versioned browser-local persistence; 283 unit and component tests plus 30 Playwright end-to-end tests with axe, all run in CI",
			],
			decisions:
				"The central decision was to make the product's judgment inspectable. Verdicts are words, never scores; every number the engine uses lives in one heuristics file; and the UI shows the reason behind every verdict. That makes the prototype honest about what it knows and easy to tune once real data arrives.",
			ux: "The interface stays quiet because the planner is already overloaded. Trip Pulse leads with a short 'Needs you' list, ranked critical to high; the JourneyRibbon turns the trip into a scannable strip of days with their verdicts; each day opens into anchor, plans, and logistics. Links to confirmations and bookings sit next to the task they resolve.",
			architecture:
				"React, TypeScript, and Vite with Tailwind and Radix primitives. A typed journey domain (trips, days, places, placements, legs) feeds pure selectors and the day-load engine; state persists locally with a schema version so the demo can evolve without breaking saved trips. Demo data is a realistic Spain itinerary pinned to a fixed demo date.",
			performance:
				"A single Vite client with no backend round-trips: every screen renders from local state, and the engine is pure functions covered by pinned seed-verdict tests, so changing a heuristic shows up as a failing test rather than a silent behavior change.",
			impact:
				"TripCanvas shows product-design judgment end to end: I defined the user, designed the information architecture from capture to day, built a custom accessible control for the core interaction, and encoded the product's reasoning so it can be tested.",
			lessons: [
				"Travel planning is a sequencing problem before it is a map problem.",
				"When a product makes a judgment, showing the reason is part of the interface, not a tooltip.",
				"Custom controls earn their place only if they keep the keyboard and screen-reader behavior of the pattern they replace.",
			],
			nextSteps:
				"Connect real place and transit providers, add shared trips for the group, and run moderated sessions with people who plan trips for others. The prototype runs on a curated demo trip today.",
			atAGlance: [
				{ label: "Role", value: "Product Designer & Engineer · solo" },
				{
					label: "Ownership",
					value:
						"I designed the product and information architecture, built the prototype, the day-load engine, and the JourneyRibbon, and wrote the tests.",
				},
				{ label: "Status", value: "Interactive prototype · case study" },
				{ label: "Audience", value: "The designated planner for an experience-heavy group trip" },
				{
					label: "Core stack",
					value: "React · TypeScript · Vite · Tailwind CSS · Radix UI · Zod",
				},
				{
					label: "Data",
					value: "Curated demo trip (Spain, summer 2026) stored in the browser; no live providers or accounts yet",
				},
				{
					label: "Verification",
					value: "283 unit/component tests · 30 Playwright end-to-end tests · axe on 12 routes in jsdom and 7 routes with contrast in Chromium, at phone and desktop widths · CI green",
				},
			],
			featuredDecisionTitle: "Make the judgment inspectable",
			featuredDecisionSummary:
				"Every day gets a verdict in words with its reasons, and every heuristic lives in one tested file.",
			walkthrough: [
				{
					title: "Trip Pulse: what needs you now",
					description:
						"The dashboard leads with a short, ranked 'Needs you' list — a car-return time that conflicts with a flight, tickets not yet confirmed — above the JourneyRibbon of days and their verdicts.",
					media: "/media/tripcanvas-case-study/trip-pulse.webp",
					mediaFit: "contain",
				},
				{
					title: "From saved places to days",
					description:
						"Recommendations land in the Inbox with priority and category, and each one is assigned to a day. Placement type — anchor, planned, optional, backup — decides whether it counts toward the day's load.",
					media: "/media/tripcanvas-case-study/inbox.webp",
					mediaFit: "contain",
				},
				{
					title: "JourneyRibbon: a tab pattern that scales to a whole trip",
					description:
						"The ribbon is a real tablist: one tab stop, arrow keys move between days, Home and End jump to the ends, and the selected day's panel is labelled by its tab. Here the keyboard has moved selection to Wednesday.",
					media: "/media/tripcanvas-case-study/journey-ribbon.webp",
					mediaFit: "contain",
				},
				{
					title: "The itinerary as a hierarchy",
					description:
						"The itinerary groups days by leg (transit, Menorca, Costa Brava, Barcelona), shows each day's verdict and moves, and pairs it with a schematic route map drawn from real coordinates, labelled as straight lines rather than roads.",
					media: "/media/tripcanvas-case-study/itinerary.webp",
					mediaFit: "contain",
				},
				{
					title: "Logistics that resolve tasks",
					description:
						"Items that still need confirmation are separated from confirmed flights and stays, and each one carries the action that resolves it next to the provider link.",
					media: "/media/tripcanvas-case-study/logistics.webp",
					mediaFit: "contain",
				},
				{
					title: "Phone layout",
					description:
						"On phones, navigation collapses and the ribbon scrolls horizontally with snap points, keeping the same keyboard and screen-reader behavior.",
					media: "/media/tripcanvas-case-study/mobile-pulse.webp",
					mediaFit: "contain",
				},
			],
			decisionCards: [
				{
					title: "Make the judgment inspectable",
					context:
						"A planner will not trust a tool that says a day is 'too full' without saying why.",
					tradeOff:
						"Words and reasons are less precise-looking than a score or percentage.",
					result:
						"Four ordinal verdicts with reason codes; estimates are labelled; every number lives in one heuristics file with pinned tests.",
				},
				{
					title: "Triage before maps",
					context:
						"A route map cannot fix bad inputs if every saved place is treated as equally viable.",
					tradeOff:
						"More product modeling up front instead of faster visual route polish.",
					result:
						"Placement types and day-load come first; the map is schematic and clearly labelled until real routing is connected.",
				},
				{
					title: "Build the custom control on a known pattern",
					context:
						"A strip of day cards is the core interaction, and a row of loose buttons would be noisy for keyboard and screen-reader users.",
					tradeOff:
						"Implementing roving focus and panel wiring takes longer than styling buttons.",
					result:
						"The JourneyRibbon behaves like WAI-ARIA tabs, so assistive technology users get one tab stop and predictable arrow-key navigation.",
				},
			],
			architectureLayers: [
				{
					title: "Journey domain",
					description:
						"Typed trips, days, places, placements, and legs, validated with Zod and persisted locally with a schema version.",
				},
				{
					title: "Day-load engine",
					description:
						"Pure functions that turn plans, legs, moves, and energy into a verdict with reasons, backed by pinned seed tests.",
				},
				{
					title: "Interface",
					description:
						"Trip Pulse, Inbox, day builder, itinerary, logistics, packing, and trip mode built with Tailwind and Radix primitives.",
				},
				{
					title: "Quality gates",
					description:
						"Vitest unit and component tests, Playwright demo journeys, and axe checks in CI.",
				},
			],
		},
		homepage: {
			accent: "green",
			index: "03",
			images: [
				{
					label: "Day-load engine",
					bg: "from-green/20 to-transparent",
					icon: "↗",
					stat: "Comfortable · Full · Tight · Overloaded, with reasons",
				},
				{
					label: "JourneyRibbon",
					bg: "from-rose/20 to-transparent",
					icon: "✓",
					stat: "Accessible tabs pattern for a whole trip",
				},
			],
			highlights: [
				"Designed the information architecture from scattered recommendations to structured days",
				"Built a transparent day-load engine that explains why a day won't work",
				"Built JourneyRibbon on the WAI-ARIA tabs pattern with full keyboard support",
				"Interactive prototype on a curated demo trip, with 283 tests and axe checks",
			],
		},
	},

	"nuclear-router": {
		slug: "nuclear-router",
		title: "Nightfall",
		shortTitle: "Nightfall",
		category: "Hackathon · Community & Safety Response",
		year: "2026",
		status: "live",
		role: "Product Lead · Full-Stack Engineer",
		tagline:
			"A hackathon emergency-routing prototype that compresses shelter context and escape guidance into one analyze→act flow — decision support, not operational safety guidance.",
		description:
			"Hackathon build deployed on Google Cloud Run + Vercel. pnpm monorepo with Google Directions polylines for road-following routes and geospatial scoring that ranks destinations away from the blast zone.",
		stack: [
			"React 19",
			"TypeScript",
			"Vite",
			"Express 5",
			"Node.js",
			"Google Maps Directions API",
			"Google Maps Geocoding API",
			"OpenWeather API",
			"Leaflet",
			"Claude AI (Anthropic)",
			"Cloud Run",
			"Vercel",
			"pnpm Monorepo",
			"Docker",
		],
		metrics: [
			{ value: "Analyze", label: "Single decision loop" },
			{ value: "4", label: "API integrations" },
			{ value: "1", label: "Session to ship" },
			{ value: "2×", label: "Hackathon awards" },
		],
		links: {
			live: "https://nuclear-escape.vercel.app/",
			github: "https://github.com/Nicolercc/nuclear-shelter-app",
			caseStudy: "/projects/nuclear-router",
		},
		media: {
			hero: "/media/nuclear-router-hero.jpg",
			detail: "/media/nuclear-router-detail.jpg",
			poster: "/media/nuclear-router-hero.jpg",
			alt: "Nightfall emergency routing app — demo preview",
		},
		caseStudy: {
			thesis:
				"Emergency tools fail when they assume calm users. Nightfall explores how shelter discovery and route guidance can be compressed into a faster, clearer decision loop.",
			problem:
				"Most emergency preparedness tools are static PDFs or generic government pages. I wanted a decision-support interface that takes blast location, your position, weather context, and routing data — then surfaces shelter vs evacuate guidance in plain language. The constraint was: someone under stress should understand the next action quickly, not parse a dashboard.",
			solution:
				"I architected a pnpm monorepo with a split deployment — React SPA on Vercel, Express 5 backend on Google Cloud Run — so API keys never touch the browser. I implemented Google's encoded polyline format to draw real road-following escape routes instead of synthetic arcs, and built a geospatial scoring algorithm that selects safe zone destinations by calculating flee-from-blast bearing weighted against upwind direction, ensuring routes never pass through the danger zone. I added a Claude-powered AI survival brief that synthesizes blast distance, zone classification, weather, and nearest shelter into a 3-sentence plain-English advisory generated server-side on every analysis.",
			technicalHighlights: [
				"Claude AI generates a personalized 3-sentence survival brief server-side on every analysis",
				"Geospatial scoring algorithm selects safe city destinations by flee-from-blast bearing weighted against wind direction",
				"Real Google Directions polyline decoded client-side — escape route follows actual roads",
				"Shareable URLs encode full scenario; shared links auto-run analysis on load",
				"Won Community Favorite + Best Alignment with Theme",
			],
			decisions:
				"I architected a pnpm monorepo with a split deployment — React SPA on Vercel, Express 5 backend on Google Cloud Run — so API keys never touch the browser. I implemented Google's encoded polyline format to draw real road-following escape routes instead of synthetic arcs, and built a geospatial scoring algorithm that selects safe zone destinations by calculating flee-from-blast bearing weighted against upwind direction, ensuring routes never pass through the danger zone. I added a Claude-powered AI survival brief that synthesizes blast distance, zone classification, weather, and nearest shelter into a 3-sentence plain-English advisory generated server-side on every analysis.",
			ux: "Designed for crisis conditions. The interface runs a single critical flow: identify blast location → locate yourself → analyze → act. Two address inputs mirror how people actually think in emergencies — they know where the explosion was and where they are. The result panel prioritizes decision over data: shelter-in-place vs evacuate is the first thing you see, followed by a named shelter with walk time, then an AI brief written at a reading level that works under stress. A radiation decay timer implements the real-world 7-10 rule, and shareable URLs let users send their exact scenario to family members.",
			architecture:
				"Split-deploy monorepo: React 19 + Vite frontend on Vercel, Express 5 API on Google Cloud Run (port 8080, 0.0.0.0 bind). Backend proxies OpenWeather, Google Geocoding, Google Directions, and Anthropic APIs — all keys server-side only. Frontend calls relative /api/* routes in production (same-origin via STATIC_DIR), or VITE_API_BASE_URL in split-deploy mode. Graceful degradation throughout: every live API has a client-side fallback so the app functions without any keys. Google's encoded polyline is decoded client-side using a pure implementation to render real road geometry on the Leaflet map.",
			performance:
				"Analysis is structured to surface map and shelter context quickly: geolocation via the browser API, geocoding and weather in parallel, escape route and AI brief after initial render. AbortController cancels in-flight requests on re-analysis. URL state encoding lets shared links reopen the same scenario.",
			impact:
				"Won Community Favorite and Best Alignment with Theme. Architected a production monorepo from scratch: pnpm workspaces, containerized Express 5 backend on Cloud Run, React SPA on Vercel, four live API integrations, Claude AI advisory layer, and shareable URL state — all designed, built, debugged, and deployed in a single session.",
			lessons: [
				"path-to-regexp v8 (Express 5) breaks all legacy catch-all route syntax — migration is non-negotiable before deploying.",
				"Geospatial destination scoring requires flee-from-blast bearing as the primary signal, not wind direction alone — wind-only routing sends users through the danger zone.",
				"API keys in environment variables require explicit process injection in containerized deployments — source .env is not enough.",
				"A 1,086-line single component is a liability in interviews — the architecture story matters as much as the feature list.",
				"Graceful degradation isn't optional in safety-critical tools — every live API needs a fallback that keeps the app functional.",
			],
			nextSteps:
				"Wire React Query for request caching and stale-while-revalidate patterns. Add offline mode with cached shelter datasets and pre-computed blast zones for the 4 yield types. Decode Google walking directions for shelter routes instead of straight-line haversine. Add WebSocket support for live scenario collaboration. Validate language and decision flow with emergency-preparedness practitioners before treating routing output as operational guidance.",
			atAGlance: [
				{ label: "Role", value: "Product Lead · Full-Stack Engineer" },
				{
					label: "Ownership",
					value:
						"I owned the analyze-to-act product flow, React/Vite client, Express API integration, routing/scoring logic, AI advisory layer, deployment, and portfolio evidence.",
				},
				{ label: "Status", value: "Hackathon prototype" },
				{
					label: "Product type",
					value: "Hackathon nuclear emergency simulation",
				},
				{
					label: "Core stack",
					value:
						"React · Express · Leaflet · Google Maps APIs · Vercel + Cloud Run",
				},
				{
					label: "Core interaction",
					value:
						"Blast + location inputs → analyze → evacuate or shelter guidance",
				},
				{
					label: "Portfolio media",
					value:
						"Demo preview · static hero and walkthrough screenshots (live prototype on Vercel)",
				},
			],
			featuredDecisionTitle: "Decision-first result panel",
			featuredDecisionSummary:
				"Designed the experience around fast route comparison and shelter context instead of a dense emergency dashboard.",
			walkthrough: [
				{
					title: "Set blast and your location",
					description:
						"Two address inputs mirror how people think in emergencies: where the event happened and where they are now.",
					media: "/media/nuclear-router-hero.jpg",
				},
				{
					title: "Compare shelter and escape options",
					description:
						"Analysis surfaces shelter-in-place vs evacuate first, then nearest shelter context and scored safe destinations.",
					media: "/media/nuclear-router-detail.jpg",
				},
				{
					title: "Review route and briefing",
					description:
						"The map shows a road-following escape route; an AI brief and radiation decay timer support the next action.",
				},
			],
			decisionCards: [
				{
					title: "Decision-first result panel",
					context:
						"Emergency interfaces often lead with dense hazard readouts before telling someone what to do.",
					tradeOff:
						"Less upfront telemetry vs. faster comprehension when the user is stressed.",
					result:
						"Shelter-in-place vs evacuate leads the panel, followed by named shelter context, walk time, then the AI brief.",
				},
				{
					title: "Flee-from-blast routing signal",
					context:
						"Wind-only heuristics can recommend paths that still cross the danger zone.",
					tradeOff:
						"More geospatial scoring logic vs. simpler weather-based routing.",
					result:
						"Destination scoring weights flee-from-blast bearing against wind so escape routes avoid the blast zone.",
				},
				{
					title: "Crisis-readable advisory copy",
					context:
						"Users may scan results while alarmed, not read long hazard reports.",
					tradeOff:
						"A short plain-English brief vs. comprehensive incident detail.",
					result:
						"Server-side Claude brief synthesizes distance, zone, weather, and shelter context into a few sentences.",
				},
				{
					title: "Static portfolio preview",
					context:
						"The hackathon UI needed a clear portfolio presence without shipping a large local-only demo video to production.",
					tradeOff:
						"Static hero capture vs. embedded motion demo and heavier page weight.",
					result:
						"Case study hero uses a polished screenshot preview; the full analyze→act flow stays on the live prototype.",
				},
			],
			architectureLayers: [
				{
					title: "Client UI",
					description:
						"React 19 + Vite SPA on Vercel — single analyze→act flow with a decision-led result panel.",
				},
				{
					title: "Map / routing layer",
					description:
						"Leaflet map with Google Directions polylines decoded client-side so escape routes follow roads, not synthetic arcs.",
				},
				{
					title: "Location / geospatial",
					description:
						"Browser geolocation, Google Geocoding API, and geospatial scoring to rank safer destinations.",
				},
				{
					title: "Emergency context",
					description:
						"Express backend on Cloud Run proxies OpenWeather, Google Directions, Anthropic (Claude brief), and related analysis calls — API keys stay server-side.",
				},
				{
					title: "Deployment / media",
					description:
						"Split deploy: containerized API on Cloud Run, static frontend on Vercel; portfolio case study uses static demo preview imagery with the live app linked from the page.",
				},
			],
		},
		homepage: {
			accent: "rose",
			index: "04",
			images: [
				{
					label: "Real-Road Routing",
					bg: "from-green/20 to-transparent",
					icon: "🧭",
					stat: "Google Directions API · Encoded polyline decoded client-side",
				},
				{
					label: "AI Survival Brief",
					bg: "from-rose/20 to-transparent",
					icon: "⚡",
					stat: "Claude AI · 3-sentence brief · server-side",
				},
			],
			highlights: [
				"Server-side Claude brief turns blast, weather, and shelter context into a short plain-English advisory",
				"Geospatial scoring ranks escape destinations using flee-from-blast bearing weighted against wind direction",
				"Google Directions polylines decoded client-side for road-following map geometry",
				"Shareable URLs encode full scenario; shared links reopen the same analysis",
				"Won Community Favorite + Best Alignment with Theme",
			],
		},
	},

	"elite-global": {
		slug: "elite-global",
		title: "Elite Global Cleaning Services",
		shortTitle: "EGCS",
		category: "Corporate · Client Work",
		year: "2023",
		status: "live",
		role: "Full-Stack Developer",
		tagline:
			"Production client site for a Queens-based environmental remediation company — built for speed, maintained through real infrastructure failures.",
		description:
			"Astro-powered static site for a Queens-based environmental remediation company. Resolved a production SSL certificate expiry post-launch — diagnosed Netlify webhook and Porkbun DNS propagation failure, restored HTTPS. Added English/Spanish i18n via Astro routing after initial delivery.",
		stack: [
			"Astro",
			"TypeScript",
			"Tailwind CSS",
			"React (Astro Islands)",
			"Netlify",
			"Porkbun DNS",
		],
		metrics: [
			{ value: "EN/ES", label: "Bilingual routes" },
			{ value: "SSG", label: "Static-first pages" },
			{ value: "Minimal", label: "Client JS on content pages" },
			{ value: "Live", label: "Client production site" },
		],
		links: {
			live: "https://eliteglobalcleaningservices.netlify.app/",
			caseStudy: "/projects/elite-global",
		},
		media: {
			hero: "/media/elite-global-hero.jpg",
			detail: "/media/elite-global-detail.jpg",
			alt: "Elite Global Cleaning Services website",
		},
		caseStudy: {
			thesis:
				"A bilingual client website for a service business, designed around trust, clarity, and fast access to core services.",
			problem:
				"Elite Global Cleaning Services is a Queens-based environmental remediation company serving industrial B2B clients. Their existing web presence wasn't converting — slow load times, no bilingual support for their Spanish-speaking staff and clients, and zero SEO structure. I built them a production site they could rely on, then kept it running when things broke.",
			solution:
				"Chose Astro for static-first delivery — the client's audience is facilities managers on mobile, often in high-glare environments with spotty connections. Static Site Generation keeps content routes lightweight with minimal hydration cost. Added React Islands only where interactivity was genuinely needed. Built bilingual support (English/Spanish) via Astro's i18n layer so the site serves both their external clients and internal Spanish-speaking staff.",
			technicalHighlights: [
				"Resolved production SSL expiry: diagnosed Netlify webhook + Porkbun DNS failure, restored HTTPS",
				"Static-first Astro architecture with minimal client JavaScript on content pages",
				"English/Spanish bilingual routing via Astro i18n layer, no third-party translation service",
			],
			decisions:
				"Chose Astro for static-first delivery — the client's audience is facilities managers on mobile, often in high-glare environments with spotty connections. Static Site Generation keeps content routes lightweight with minimal hydration cost. Added React Islands only where interactivity was genuinely needed. Built bilingual support (English/Spanish) via Astro's i18n layer so the site serves both their external clients and internal Spanish-speaking staff.",
			ux: "High-contrast typography and structured layout optimized for mobile readability in industrial environments — not a desk-browsing experience. Service pages structured around B2B decision-making: what you get, who it's for, how to contact. No unnecessary animations or flourishes that would slow perceived performance on a construction site Wi-Fi connection.",
			architecture:
				"Static site on Netlify with Porkbun nameservers. Astro keeps content pages static-first with minimal client JavaScript and React scoped to interactive islands only. i18n lives at the Astro routing layer: /en/* and /es/* parallel routes, no client-side language switching, no third-party translation service.",
			performance:
				"Static-first delivery: every page pre-rendered at build time with minimal client JavaScript outside interactive islands — tuned for mobile readability on industrial connections. Resolved a live SSL certificate expiry post-launch: diagnosed Netlify webhook failure and Porkbun DNS propagation gap, restored HTTPS with zero data loss.",
			impact:
				"Live production site for a real paying client. Diagnosed and resolved SSL expiry and DNS configuration failures post-launch. Added i18n after initial delivery based on client feedback — first time doing production bilingual routing.",
			lessons: [
				"Production maintenance is a different skill than initial development — SSL expiry and DNS failures happen after you ship, not before.",
				"Astro Islands is the right call for content sites where interactivity is the exception, not the rule.",
				"Client work requires scope discipline — i18n was added post-launch because it wasn't scoped initially, which cost more time than building it in from the start.",
				"B2B audiences don't need delightful UX — they need fast, legible, and trustworthy.",
			],
			nextSteps:
				"Add a service request form with Netlify Forms. Build a client portal for job scheduling and status updates.",
			atAGlance: [
				{ label: "Role", value: "Full-Stack Developer" },
				{
					label: "Ownership",
					value:
						"I built the Astro site, bilingual route structure, service-page UX, deployment handoff, and post-launch SSL/DNS incident response.",
				},
				{
					label: "Client type",
					value: "Queens-based environmental remediation · B2B service",
				},
				{
					label: "Core stack",
					value: "Astro · TypeScript · Tailwind CSS · Netlify",
				},
				{
					label: "Scope",
					value:
						"Marketing site, bilingual service pages, post-launch SSL/DNS maintenance",
				},
				{
					label: "Key constraint",
					value:
						"Fast, legible pages for facilities managers on mobile industrial connections",
				},
				{ label: "Status", value: "Live production site" },
			],
			featuredDecisionTitle: "Static-first architecture",
			featuredDecisionSummary:
				"Prioritized a lightweight static architecture and bilingual content structure so the site stayed fast, maintainable, and clear for service-business users.",
			walkthrough: [
				{
					title: "Homepage and service overview",
					description:
						"English homepage hero with service positioning, primary CTAs, and navigation into core remediation offerings.",
					media: "/media/elite-global-hero.jpg",
				},
				{
					title: "Bilingual content and trust",
					description:
						"Spanish homepage with the same service structure — parallel language routes via Astro i18n, no third-party translation layer.",
					media: "/media/elite-global-detail.jpg",
				},
				{
					title: "Contact and conversion path",
					description:
						"High-contrast layout keeps contact and service CTAs easy to find on mobile, including high-glare and spotty-connection environments.",
				},
			],
			decisionCards: [
				{
					title: "Static-first architecture",
					context:
						"The audience often browses on mobile with limited bandwidth; a heavier app framework would add hydration cost without benefit.",
					tradeOff:
						"Less client-side interactivity by default vs. simpler hosting and faster first paint.",
					result:
						"Astro ships most pages as static HTML with React Islands only where interactivity was genuinely needed.",
				},
				{
					title: "Bilingual content clarity",
					context:
						"Spanish-speaking staff and clients needed the same service information as English readers after launch feedback.",
					tradeOff:
						"Maintaining parallel language routes vs. a single-language site with faster initial delivery.",
					result:
						"English/Spanish routing at the Astro layer — no client-side language toggle or third-party translation service.",
				},
				{
					title: "Service-business trust signals",
					context:
						"B2B remediation buyers need credibility and scanability more than decorative marketing polish.",
					tradeOff:
						"Restrained visual design vs. trend-heavy landing-page patterns.",
					result:
						"High-contrast typography and structured service pages prioritized legibility and contact clarity over flourishes.",
				},
				{
					title: "Maintenance-friendly client handoff",
					context:
						"A paying client site has to keep running after launch — certificates and DNS do not maintain themselves.",
					tradeOff:
						"Time spent on post-launch incident response vs. only billing for the initial build.",
					result:
						"Diagnosed and resolved a production SSL expiry tied to Netlify webhook and Porkbun DNS propagation issues.",
				},
			],
			architectureLayers: [
				{
					title: "Static content shell",
					description:
						"Astro static site generation — pages ship as HTML with near-zero client JavaScript on content routes.",
				},
				{
					title: "Bilingual routing",
					description:
						"Astro i18n parallel routes (/en/*, /es/*) so each language has explicit URLs without runtime translation.",
				},
				{
					title: "Interactive islands",
					description:
						"React scoped to Astro Islands only where client interactivity was required.",
				},
				{
					title: "Hosting and DNS",
					description:
						"Netlify deployment with Porkbun nameservers — production HTTPS depends on both staying in sync.",
				},
				{
					title: "Operations",
					description:
						"Post-launch maintenance: SSL renewal incident diagnosed across Netlify webhooks and DNS propagation.",
				},
			],
		},
		homepage: {
			accent: "rose",
			index: "06",
			images: [
				{
					label: "Production Site",
					bg: "from-green/20 to-transparent",
					icon: "🏢",
					stat: "Astro · static-first · SSL incident resolved",
				},
				{
					label: "Bilingual i18n",
					bg: "from-zinc-800 to-transparent",
					icon: "🌐",
					stat: "EN/ES · Astro i18n routing layer",
				},
			],
			highlights: [
				"Resolved production SSL expiry: diagnosed Netlify webhook + Porkbun DNS failure, restored HTTPS",
				"Static-first delivery with minimal client JavaScript",
				"English/Spanish bilingual routing via Astro i18n layer, no third-party translation service",
			],
		},
	},

};

export const projectsRegistry: Record<ProjectSlug, Project> = projects;

/** @deprecated Prefer projectsRegistry — kept for existing imports during migration */
export const projectsData = projectsRegistry;

const PUBLIC_PROJECT_SLUG_SET = new Set<string>(SHOWCASE_PROJECT_SLUGS);

export function isProjectSlug(slug: string): slug is ProjectSlug {
	return PUBLIC_PROJECT_SLUG_SET.has(slug);
}

export function getProject(slug: string): Project | undefined {
	return isProjectSlug(slug) ? projectsRegistry[slug] : undefined;
}

export function getShowcaseProjects(): Project[] {
	return SHOWCASE_PROJECT_SLUGS.map((slug) => projectsRegistry[slug]);
}

export function getAllProjectSlugs(): ProjectSlug[] {
	return [...SHOWCASE_PROJECT_SLUGS];
}

export function getNextProjectSlug(currentSlug: ProjectSlug): ProjectSlug {
	const showcaseSlugs: readonly ProjectSlug[] = SHOWCASE_PROJECT_SLUGS;
	const index = showcaseSlugs.indexOf(currentSlug);
	const nextIndex = (index + 1) % showcaseSlugs.length;
	return showcaseSlugs[nextIndex];
}
