export const projectsData = {
	"nuclear-router": {
		title: "Nuclear Escape Router",
		year: "2026",
		category: "Hackathon · Community & Safety Response",
		role: "Product Lead · Full-Stack Engineer",
		live: "https://nuclear-escape.vercel.app/",
		github: "https://github.com/Nicolercc/nuclear-shelter-app",
		heroImage: "/media/nuclear-router-hero.png",
		detailImage: "/media/nuclear-router-detail.png",
		tagline:
			"A full-stack nuclear emergency simulation that delivers personalized survival guidance — real routing, live weather, AI triage, and shareable scenarios — in under 3 seconds.",
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
		why: "Most emergency preparedness tools are static PDFs or generic government pages. I wanted to build something that actually thinks — an app that takes your exact location, the blast site, real wind data, and live road conditions, then tells you in plain English what to do next. The constraint was: a frightened person should be able to act on this information in under 10 seconds.",
		decisions:
			"I architected a pnpm monorepo with a split deployment — React SPA on Vercel, Express 5 backend on Google Cloud Run — so API keys never touch the browser. I implemented Google's encoded polyline format to draw real road-following escape routes instead of synthetic arcs, and built a geospatial scoring algorithm that selects safe zone destinations by calculating flee-from-blast bearing weighted against upwind direction, ensuring routes never pass through the danger zone. I added a Claude-powered AI survival brief that synthesizes blast distance, zone classification, weather, and nearest shelter into a 3-sentence plain-English advisory generated server-side on every analysis.",
		ux: "Designed for crisis conditions. The interface runs a single critical flow: identify blast location → locate yourself → analyze → act. Two address inputs mirror how people actually think in emergencies — they know where the explosion was and where they are. The result panel prioritizes decision over data: shelter-in-place vs evacuate is the first thing you see, followed by a named shelter with walk time, then an AI brief written at a reading level that works under stress. A radiation decay timer implements the real-world 7-10 rule, and shareable URLs let users send their exact scenario to family members.",
		architecture:
			"Split-deploy monorepo: React 19 + Vite frontend on Vercel, Express 5 API on Google Cloud Run (port 8080, 0.0.0.0 bind). Backend proxies OpenWeather, Google Geocoding, Google Directions, and Anthropic APIs — all keys server-side only. Frontend calls relative /api/* routes in production (same-origin via STATIC_DIR), or VITE_API_BASE_URL in split-deploy mode. Graceful degradation throughout: every live API has a client-side fallback so the app functions without any keys. Google's encoded polyline is decoded client-side using a pure implementation to render real road geometry on the Leaflet map.",
		performance:
			"Analysis completes in under 3 seconds: geolocation resolves via browser API, geocoding and weather fire in parallel, escape route and AI brief fire after initial render so the map and shelter data appear immediately. AbortController cancels in-flight requests on re-analysis to prevent race conditions. URL state encoding enables zero-latency scenario sharing — shared links auto-run analysis on load.",
		impact:
			"Won Community Favorite and Best Alignment with Theme at the hackathon. Rebuilt from a single-file prototype into a production monorepo with CI/CD, containerized Cloud Run deployment, real API integrations, and an AI advisory layer — all shipped in one session.",
		future:
			"Wire React Query for request caching and stale-while-revalidate patterns. Add offline mode with cached shelter datasets and pre-computed blast zones for the 4 yield types. Decode Google walking directions for shelter routes instead of straight-line haversine. Add WebSocket support for live scenario collaboration.",
		lessons: [
			"path-to-regexp v8 (Express 5) breaks all legacy catch-all route syntax — migration is non-negotiable before deploying.",
			"Geospatial destination scoring requires flee-from-blast bearing as the primary signal, not wind direction alone — wind-only routing sends users through the danger zone.",
			"API keys in environment variables require explicit process injection in containerized deployments — source .env is not enough.",
			"A 1,086-line single component is a liability in interviews — the architecture story matters as much as the feature list.",
			"Graceful degradation isn't optional in safety-critical tools — every live API needs a fallback that keeps the app functional.",
		],
	},

	"elite-global": {
		title: "Elite Global Cleaning Services",
		year: "2023",
		category: "Corporate · Client Work",
		role: "Full-Stack Developer",
		live: "https://eliteglobalcleaningservices.netlify.app/",
		github: "",
		heroImage: "/media/elite-global-hero.png",
		detailImage: "/media/elite-global-detail.png",
		tagline:
			"Production client site for a Queens-based environmental remediation company — built for speed, maintained through real infrastructure failures.",
		stack: [
			"Astro",
			"TypeScript",
			"Tailwind CSS",
			"React (Astro Islands)",
			"Netlify",
			"Porkbun DNS",
		],
		why: "Elite Global Cleaning Services is a Queens-based environmental remediation company serving industrial B2B clients. Their existing web presence wasn't converting — slow load times, no bilingual support for their Spanish-speaking staff and clients, and zero SEO structure. I built them a production site they could rely on, then kept it running when things broke.",
		decisions:
			"Chose Astro for zero-JavaScript-by-default architecture — the client's audience is facilities managers on mobile, often in high-glare environments with spotty connections. Static Site Generation means the site loads instantly with no hydration cost. Added React Islands only where interactivity was genuinely needed. Built bilingual support (English/Spanish) via Astro's i18n layer so the site serves both their external clients and internal Spanish-speaking staff.",
		ux: "High-contrast typography and structured layout optimized for mobile readability in industrial environments — not a desk-browsing experience. Service pages structured around B2B decision-making: what you get, who it's for, how to contact. No unnecessary animations or flourishes that would slow perceived performance on a construction site Wi-Fi connection.",
		architecture:
			"Static site deployed to Netlify with Porkbun nameservers handling DNS. Resolved a production SSL certificate expiry incident post-launch — diagnosed the Netlify webhook/DNS propagation issue, updated nameserver configuration, and restored HTTPS without downtime. i18n implemented at the Astro routing layer with English as default and Spanish as a parallel route — no third-party translation service, no client-side switching cost.",
		performance:
			"Near-zero client-side JavaScript outside of interactive islands. Static generation means every page is pre-rendered at build time — no server latency, no hydration delay. Structured metadata and semantic HTML for search visibility in local industrial service queries.",
		impact:
			"Live production site for a real paying client. Diagnosed and resolved SSL expiry and DNS configuration failures post-launch. Added i18n after initial delivery based on client feedback — first time doing production bilingual routing.",
		future:
			"Add a service request form with Netlify Forms. Build a client portal for job scheduling and status updates.",
		lessons: [
			"Production maintenance is a different skill than initial development — SSL expiry and DNS failures happen after you ship, not before.",
			"Astro Islands is the right call for content sites where interactivity is the exception, not the rule.",
			"Client work requires scope discipline — i18n was added post-launch because it wasn't scoped initially, which cost more time than building it in from the start.",
			"B2B audiences don't need delightful UX — they need fast, legible, and trustworthy.",
		],
	},

	impactify: {
		title: "Impactify",
		year: "2024–2025",
		category: "Civic Tech · Full-Stack",
		role: "Lead Developer",
		live: "https://impactify2-0.vercel.app/",
		github: "",
		heroImage: "/media/impactify-hero.png",
		detailImage: "/media/impactify-detail.png",
		tagline:
			"Civic engagement for the overwhelmed but informed. One curated action per issue, per week — built for the person who cares but has 10 minutes.",
		stack: [
			"Next.js 14 (App Router)",
			"TypeScript",
			"Tailwind CSS",
			"Supabase",
			"Anthropic API",
			"Guardian News API",
			"VolunteerMatch API",
			"Vercel",
		],
		why: "Civic platforms fail the people who already care. They assume users are either uninformed or have unlimited time — neither is true for Sofia, a 27-year-old NYC resident who follows the news, cares deeply about housing and immigration, and has exactly 10 minutes on a Tuesday night. I built Impactify around her: not more awareness, but a single clear action with everything she needs to take it.",
		decisions:
			"Rebuilt the entire stack from Firebase/Stripe/Socket.io/React-Vite to Next.js App Router for a BlackRock real estate capstone demo in Hudson Yards. Guardian News API powers the news cards with server-side fetching so articles load instantly. Anthropic API generates plain-English summaries of complex civic issues — cached to Supabase to prevent repeated API calls and ensure consistent output. The editorial thesis: confident prose with one citation beats source carousels. Every content decision runs through that lens.",
		ux: "Three-screen flow designed around decision fatigue. Onboarding: pick 2–3 issues via chips, enter zip code. Weekly Briefing: AI summary banner, one action widget, Guardian news cards, rep sidebar always sticky. My Reps: voting records with contact forms. Sofia should never have to decide what to read next — the product decides for her and shows its work with a single citation.",
		architecture:
			"Next.js App Router with server components for data fetching — Guardian and Anthropic API calls happen server-side so keys never reach the client. Supabase caches all API responses with 24-hour TTLs so the briefing loads instantly on repeat visits. Claude generates issue summaries and action copy server-side, cached to Supabase on first generation. Promise.all parallelizes all briefing page fetches — eliminated a 3-second sequential waterfall from the v1 implementation. Skeleton loading with exact grid dimensions matching the final layout eliminates layout shift.",
		performance:
			"Server-side rendering with Supabase cache means the Weekly Briefing renders in under 800ms on repeat visits. Guardian API articles fetched in parallel with Claude summaries — neither blocks the other. Sticky sidebar pattern established with no competing scrollbars and a Suspense boundary around the AI briefing slot.",
		impact:
			"Selected for BlackRock real estate capstone demo at Hudson Yards. Rebuilt from scratch under deadline pressure from a completely different stack. Presented to finance industry stakeholders as a production-grade civic technology product.",
		future:
			"Add push notification support for time-sensitive civic moments. Build a shareable civic record showing actions taken over time. Expand issue areas beyond NYC.",
		lessons: [
			"Building for a named persona with a specific life situation produces sharper product decisions than building for 'users'.",
			"Caching Claude responses in Supabase is non-negotiable — uncached API calls on every page load create both cost and consistency risk.",
			"The competitive moat in civic tech is editorial judgment, not data breadth — one good sentence beats five sources.",
			"A full stack rebuild under deadline is a different skill than greenfield development — scope control matters more than clean architecture.",
		],
	},
};
