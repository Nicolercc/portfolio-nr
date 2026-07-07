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
};

export type CaseStudyGlanceItem = {
	label: string;
	value: string;
};

export type CaseStudyWalkthroughStep = {
	title: string;
	description: string;
	media?: string;
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
	| "impactify"
	| "nuclear-router"
	| "elite-global"
	| "carbonshift";

/** Homepage + projects index display order */
export const SHOWCASE_PROJECT_SLUGS = [
	"impactify",
	"nuclear-router",
	"elite-global",
	"carbonshift",
] as const satisfies readonly ProjectSlug[];

const projects: Record<ProjectSlug, Project> = {
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
			video: "/media/impactify-parallax-vid1.mov",
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
			index: "01",
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

	"nuclear-router": {
		slug: "nuclear-router",
		title: "Nightfall",
		shortTitle: "Nightfall",
		category: "Hackathon · Community & Safety Response",
		year: "2026",
		status: "live",
		role: "Product Lead · Full-Stack Engineer",
		tagline:
			"A full-stack nuclear emergency simulation that delivers personalized survival guidance — real routing, live weather, AI triage, and shareable scenarios — in under 3 seconds.",
		description:
			"Full-stack nuclear emergency simulator deployed on Google Cloud Run + Vercel. Architected a pnpm monorepo, decoded Google's encoded polyline format for real road geometry, and built a geospatial scoring algorithm that routes escape destinations away from — not through — the blast zone.",
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
			{ value: "< 3s", label: "Analysis time" },
			{ value: "4", label: "Live API integrations" },
			{ value: "1", label: "Session to ship" },
			{ value: "2×", label: "Hackathon awards" },
		],
		links: {
			live: "https://nuclear-escape.vercel.app/",
			github: "https://github.com/Nicolercc/nuclear-shelter-app",
			caseStudy: "/projects/nuclear-router",
		},
		media: {
			hero: "/media/nuclear-router-hero.png",
			detail: "/media/nuclear-router-detail.png",
			video: "/media/nuclear-router-demo.mov",
			poster: "/media/nuclear-router-hero.png",
			alt: "Nightfall nuclear emergency routing app",
		},
		caseStudy: {
			thesis:
				"A full-stack nuclear emergency simulation that delivers personalized survival guidance — real routing, live weather, AI triage, and shareable scenarios — in under 3 seconds.",
			problem:
				"Most emergency preparedness tools are static PDFs or generic government pages. I wanted to build something that actually thinks — an app that takes your exact location, the blast site, real wind data, and live road conditions, then tells you in plain English what to do next. The constraint was: a frightened person should be able to act on this information in under 10 seconds.",
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
				"Analysis completes in under 3 seconds: geolocation resolves via browser API, geocoding and weather fire in parallel, escape route and AI brief fire after initial render so the map and shelter data appear immediately. AbortController cancels in-flight requests on re-analysis to prevent race conditions. URL state encoding enables zero-latency scenario sharing — shared links auto-run analysis on load.",
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
				"Wire React Query for request caching and stale-while-revalidate patterns. Add offline mode with cached shelter datasets and pre-computed blast zones for the 4 yield types. Decode Google walking directions for shelter routes instead of straight-line haversine. Add WebSocket support for live scenario collaboration.",
		},
		homepage: {
			accent: "rose",
			index: "02",
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
				"Claude AI generates a personalized 3-sentence survival brief server-side on every analysis",
				"Geospatial scoring algorithm selects safe city destinations by flee-from-blast bearing weighted against wind direction",
				"Real Google Directions polyline decoded client-side — escape route follows actual roads",
				"Shareable URLs encode full scenario; shared links auto-run analysis on load",
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
			{ value: "100", label: "Lighthouse score" },
			{ value: "2", label: "Languages (EN/ES)" },
			{ value: "0", label: "JS on static pages" },
			{ value: "< 1s", label: "Load time" },
		],
		links: {
			live: "https://eliteglobalcleaningservices.netlify.app/",
			caseStudy: "/projects/elite-global",
		},
		media: {
			hero: "/media/elite-global-hero.png",
			detail: "/media/elite-global-detail.png",
			alt: "Elite Global Cleaning Services website",
		},
		caseStudy: {
			thesis:
				"Production client site for a Queens-based environmental remediation company — built for speed, maintained through real infrastructure failures.",
			problem:
				"Elite Global Cleaning Services is a Queens-based environmental remediation company serving industrial B2B clients. Their existing web presence wasn't converting — slow load times, no bilingual support for their Spanish-speaking staff and clients, and zero SEO structure. I built them a production site they could rely on, then kept it running when things broke.",
			solution:
				"Chose Astro for zero-JavaScript-by-default architecture — the client's audience is facilities managers on mobile, often in high-glare environments with spotty connections. Static Site Generation means the site loads instantly with no hydration cost. Added React Islands only where interactivity was genuinely needed. Built bilingual support (English/Spanish) via Astro's i18n layer so the site serves both their external clients and internal Spanish-speaking staff.",
			technicalHighlights: [
				"Resolved production SSL expiry: diagnosed Netlify webhook + Porkbun DNS failure, restored HTTPS",
				"Zero-JavaScript Astro architecture — sub-second load on mobile industrial connections",
				"English/Spanish bilingual routing via Astro i18n layer, no third-party translation service",
			],
			decisions:
				"Chose Astro for zero-JavaScript-by-default architecture — the client's audience is facilities managers on mobile, often in high-glare environments with spotty connections. Static Site Generation means the site loads instantly with no hydration cost. Added React Islands only where interactivity was genuinely needed. Built bilingual support (English/Spanish) via Astro's i18n layer so the site serves both their external clients and internal Spanish-speaking staff.",
			ux: "High-contrast typography and structured layout optimized for mobile readability in industrial environments — not a desk-browsing experience. Service pages structured around B2B decision-making: what you get, who it's for, how to contact. No unnecessary animations or flourishes that would slow perceived performance on a construction site Wi-Fi connection.",
			architecture:
				"Static site on Netlify with Porkbun nameservers. Astro's zero-JavaScript default means every page ships as pure HTML — no hydration, no runtime overhead. React Islands scoped to interactive components only. i18n at the Astro routing layer: /en/* and /es/* parallel routes, no client-side language switching, no third-party translation service.",
			performance:
				"Lighthouse scores: 100 Performance, 100 SEO, 100 Best Practices, 100 Accessibility. Every page pre-rendered at build time — zero server latency. Near-zero client-side JavaScript outside interactive islands. Resolved a live SSL certificate expiry post-launch: diagnosed Netlify webhook failure and Porkbun DNS propagation gap, restored HTTPS with zero data loss.",
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
		},
		homepage: {
			accent: "rose",
			index: "03",
			images: [
				{
					label: "Production Site",
					bg: "from-green/20 to-transparent",
					icon: "🏢",
					stat: "Astro · zero JS · SSL incident resolved",
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
				"Zero-JavaScript Astro architecture — sub-second load on mobile industrial connections",
				"English/Spanish bilingual routing via Astro i18n layer, no third-party translation service",
			],
		},
	},

	carbonshift: {
		slug: "carbonshift",
		title: "CarbonShift",
		shortTitle: "CarbonShift",
		category: "Climate Tech · In Progress",
		year: "2026",
		status: "in-progress",
		role: "Product Lead · Full-Stack Engineer",
		tagline:
			"Personal climate impact tooling — currently in active development, not yet publicly deployed.",
		description:
			"A climate impact product in active development. Scope, architecture, and MVP flows are being defined before a public launch.",
		stack: ["React", "TypeScript", "Vite", "Tailwind CSS"],
		links: {
			caseStudy: "/projects/carbonshift",
		},
		media: {
			alt: "CarbonShift — in progress",
		},
		caseStudy: {
			thesis:
				"Personal climate impact tooling — currently in active development, not yet publicly deployed.",
			problem:
				"Carbon footprint tools often overwhelm users with data and under-deliver on actionable next steps. CarbonShift is being built to close that gap — but the product is not live yet.",
			solution:
				"Development is focused on a narrow MVP: clear impact categories, honest data sourcing, and one recommended action per session. Architecture and UX patterns will follow the same production standards as shipped work in this portfolio.",
			technicalHighlights: [
				"In active development — no public deployment yet",
				"MVP scoping: impact categories, data sourcing, and action recommendations",
			],
			decisions:
				"CarbonShift remains in progress. Engineering decisions will be documented here once the MVP architecture is locked and validated.",
			ux: "UX exploration is underway. The target experience is low-friction entry, transparent assumptions, and one clear next action — not dashboard overload.",
			architecture:
				"Stack and deployment architecture are provisional while the MVP is being scoped.",
			performance: "Performance targets will be set once core flows are implemented.",
			impact: "Not yet shipped. This entry will be updated when CarbonShift launches.",
			lessons: [],
			nextSteps:
				"Finalize MVP scope, implement core flows, and publish a live deployment when ready.",
		},
		homepage: {
			accent: "green",
			index: "04",
			images: [
				{
					label: "In Progress",
					bg: "from-green/20 to-transparent",
					icon: "🌱",
					stat: "MVP scoping · not yet deployed",
				},
				{
					label: "Climate Impact",
					bg: "from-rose/20 to-transparent",
					icon: "📊",
					stat: "Action-first UX · in development",
				},
			],
			highlights: [
				"In active development — no public deployment yet",
				"MVP focused on clear impact categories and one recommended action per session",
				"Case study will expand once architecture and live product are finalized",
			],
		},
	},
};

export const projectsRegistry: Record<ProjectSlug, Project> = projects;

/** @deprecated Prefer projectsRegistry — kept for existing imports during migration */
export const projectsData = projectsRegistry;

const PROJECT_SLUG_SET = new Set<string>(Object.keys(projects));

export function isProjectSlug(slug: string): slug is ProjectSlug {
	return PROJECT_SLUG_SET.has(slug);
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
	const index = SHOWCASE_PROJECT_SLUGS.indexOf(currentSlug);
	const nextIndex = (index + 1) % SHOWCASE_PROJECT_SLUGS.length;
	return SHOWCASE_PROJECT_SLUGS[nextIndex];
}
