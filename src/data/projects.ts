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
		year: "2024",
		category: "Civic Tech · Full-Stack",
		role: "Lead Developer",
		live: "https://impactifyyy.netlify.app/",
		github: "https://github.com/Nicolercc/impactify_fe",
		heroVideo: "/media/impactify-parallax-vid1.mov",
		tagline:
			"A real-time activism platform that transforms awareness into action.",
		stack: [
			"React",
			"Vite",
			"Firebase (Firestore)",
			"Stripe (Checkout)",
			"NewsAPI",
			"Material UI",
			"Emotion",
			"React Spring",
			"Axios",
			"Socket.io Client",
			"Google Maps API",
		],
		why: "Activism platforms often overwhelm users with fragmented information. I built Impactify to centralize events, news, and donations into a single actionable experience.",
		decisions:
			"I used Firebase Firestore for real-time updates, structuring collections around users and events. Stripe Checkout handled secure payments externally, while React and Material UI provided scalable UI architecture.",
		ux: "Dark-mode interface reduces cognitive fatigue. Visual hierarchy guides users toward key actions like donating or joining events.",
		architecture:
			"Real-time system using Firestore listeners for event updates. NewsAPI provides external data, normalized client-side. Stripe handles payments asynchronously.",
		performance:
			"Real-time updates propagate instantly without requiring refresh, improving user engagement.",
		challenges:
			"Coordinating multiple async data sources, handling inconsistent API responses, and maintaining UI stability during real-time updates.",
		future:
			"Add backend validation, caching layers, and improved error handling for network failures.",
		lessons: [
			"Real-time systems require careful state synchronization.",
			"External APIs demand defensive programming.",
			"Immediate feedback loops improve user engagement.",
		],
	},
};
