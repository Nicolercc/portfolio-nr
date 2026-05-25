export const projectsData = {
	"nuclear-router": {
		title: "Nuclear Router",
		year: "2026",
		category: "Hackathon · Community & Safety Response",
		role: "Product Lead · Developer",
		live: "#",
		github: "https://github.com/Nicolercc/nuclear-shelter-app",
		heroImage: "/media/nuclear-router-hero.png",
		detailImage: "/media/nuclear-router-detail.png",
		tagline:
			"A rapid-response navigation app designed to guide people to safety in seconds during a nuclear emergency.",
		stack: [
			"React",
			"TypeScript",
			"Vite",
			"Google Maps API",
			"OpenWeather API",
			"Browser Geolocation API",
		],
		why: "In high-stress emergency scenarios, users cannot afford to interpret complex interfaces. I led the development of Nuclear Router to reduce cognitive load to near zero—delivering immediate situational awareness and actionable routing within seconds.",
		decisions:
			"I reduced the product to a single critical flow: detect → orient → route. I implemented browser-based geolocation for instant positioning, Google Maps for routing, and OpenWeather data to incorporate wind direction into safety awareness. The system was optimized for speed and clarity under pressure.",
		ux: "Designed for crisis conditions: high-contrast UI, minimal branching, and immediate calls-to-action. Every interaction was evaluated against whether a stressed user could act within seconds.",
		architecture:
			"Client-side architecture prioritizing speed. Geolocation is resolved via browser APIs, routing via Google Maps, and environmental context layered using OpenWeather. The system currently depends on external APIs without fallback support.",
		performance:
			"Optimized for rapid interaction with minimal processing before route generation.",
		impact:
			"Built and shipped in under 2 hours, winning Community Favorite and Best Alignment with Theme at the hackathon.",
		future:
			"Introduce offline routing with cached shelter datasets, API fallback mechanisms, and local storage for last-known safe routes.",
		lessons: [
			"Speed and clarity are critical in emergency systems.",
			"External API reliance creates reliability risks without fallback strategies.",
			"Reducing user decisions is essential under stress conditions.",
		],
	},

	"elite-global": {
		title: "Elite Global Cleaning Services",
		year: "2023",
		category: "Corporate · Performance",
		role: "Full-Stack Developer",
		live: "https://eliteglobalcleaningservices.netlify.app/",
		github: "https://github.com/Nicolercc/egcs",
		heroImage: "/media/elite-global-hero.png",
		tagline:
			"A high-performance, SEO-optimized platform for industrial B2B cleaning services.",
		stack: [
			"Astro",
			"TypeScript",
			"Tailwind",
			"React (Astro Islands)",
			"Vercel",
		],
		why: "In industrial B2B environments, trust is established through performance and reliability. I built this platform to deliver fast load times and strong SEO visibility.",
		decisions:
			"I used Astro’s zero-JavaScript architecture to minimize client-side overhead. Static Site Generation ensured fast delivery and reliability, while structured metadata and schema improved search visibility.",
		ux: "Designed for real-world usage: high-contrast typography and structured layout for readability on mobile devices in high-glare environments.",
		performance:
			"Achieved consistent 100/100 Lighthouse scores through static rendering and optimized asset delivery.",
		seo: "Implemented semantic HTML, meta tags, Open Graph data, schema markup, and keyword optimization.",
		architecture:
			"Astro-based static architecture with selective React hydration. Deployed via Vercel for fast global delivery.",
		future:
			"Add analytics for conversion tracking, A/B testing, and edge caching improvements.",
		lessons: [
			"Performance directly impacts trust in B2B applications.",
			"SEO is a core engineering responsibility.",
			"Reducing JavaScript improves real-world usability.",
		],
	},

	impactify: {
		title: "Impactify",
		year: "2024–2025",
		category: "Civic Tech · Full-Stack",
		role: "Lead Developer",
		live: "https://impactify2-0.vercel.app/",
		github: "https://github.com/Nicolercc/impactify_fe",
		heroVideo: "/media/impactify-parallax-vid1.mov",
		tagline:
			"Civic engagement for the overwhelmed but informed. Actions, not awareness.",
		stack: [
			"Next.js",
			"TypeScript",
			"Tailwind CSS",
			"Supabase",
			"ProPublica API",
			"GovTrack API",
			"NewsAPI",
			"Anthropic API",
			"VolunteerMatch API",
		],
		why: "Most civic platforms treat users as either uninformed or time-rich. I built Impactify for Sofia—busy, informed, NYC-based, care deeply but drowning in options. The problem: fragmented sources, unclear next steps.",
		decisions:
			"Rebuilt in Next.js for server-side rendering and API caching. Supabase handles auth and cached API responses. ProPublica + GovTrack provide authoritative government data (not social noise). Anthropic API generates clarity on complex bills—cached to avoid hallucinations.",
		ux: "Three-screen flow: (1) Onboarding picks 2–3 issues, (2) Weekly Briefing surfaces one curated action per issue with rep contact scripts, (3) My Reps shows voting records. Sticky sidebar keeps rep contact always visible. Trust-first copy: single citations, no source carousels.",
		architecture:
			"Next.js SSR fetches government APIs server-side and caches results in Supabase, reducing client-side latency and API quota burn. Anthropic API calls cached by bill ID. Responsive grid (lg:grid-cols-[1fr_380px]) keeps rep sidebar docked.",
		performance:
			"Cached API responses reduce real-time roundtrips. Skeleton loading on briefing cards masks network latency. Graceful null returns prevent cascade failures if one API is slow.",
		challenges:
			"Balancing authority (ProPublica, GovTrack) with user clarity (Anthropic summaries). Debugging Vercel deployment + webhook sync. Avoiding source carousels that paralyze users.",
		future:
			"User research observing Sofia proxies with wireframe. Post-capstone: offline mode, notification drip, issue-area performance metrics.",
		lessons: [
			"Moat is UX judgment, not data breadth.",
			"Cache aggressively—real-time isn't always better.",
			"Trust is built through confident prose + single citations.",
			"Government APIs are stable; social APIs are noise.",
		],
	},
};
