export const projectsData = {
	impactify: {
		title: "Impactify",
		year: "2024",
		category: "Civic Tech · Full-Stack",
		role: "Lead Developer",
		live: "https://impactifyyy.netlify.app/",
		github: "https://github.com/Nicolercc/impactify_fe",
		tagline:
			"An activism hub that turns awareness into action through real-time data.",
		stack: ["React", "Firebase", "Stripe", "NewsAPI"],
		why: "Activists often struggle with 'choice paralysis.' I built Impactify to centralize disparate resources into a single, high-integrity dashboard where users can see local events and donate securely in seconds.",
		decisions:
			"I opted for Firebase for its real-time listeners. When a user creates an activism event, it populates globally without a page refresh, fostering a sense of immediate community impact.",
		ux: "The interface uses a 'Dark Mode' aesthetic to reduce cognitive load while navigating heavy political news, utilizing Rose accents to draw the eye to critical action buttons.",
		lessons: [
			"Managing complex API state with real-time data requires robust error boundaries.",
			"Integrating Stripe webhooks taught me the importance of asynchronous event handling in financial flows.",
			"User agency increases when the UI provides immediate visual feedback for every action.",
		],
	},
	"elite-global": {
		title: "Elite Global",
		year: "2023",
		category: "Corporate · Performance",
		role: "Full-Stack Developer",
		live: "https://eliteglobalcleaningservices.netlify.app/",
		github: "https://github.com/Nicolercc/egcs",
		tagline:
			"A precision-built digital gateway for industrial B2B cleaning services.",
		stack: ["Astro", "TypeScript", "Tailwind", "Vercel"],
		why: "In the industrial sector, trust is built on reliability. Elite Global needed a digital presence that loaded instantly and felt as professional as the services they provide.",
		decisions:
			"I chose Astro to deliver zero-JavaScript by default. By shipping only necessary code, I achieved 100/100 Lighthouse scores, ensuring the site performs on low-bandwidth job sites.",
		ux: "The layout follows a minimalist, industrial grid. High-contrast typography ensures readability for clients who are often viewing the site on mobile devices in high-glare environments.",
		lessons: [
			"Performance is a feature, not an afterthought. Speed directly impacts B2B conversion rates.",
			"Static Site Generation (SSG) is the superior choice for SEO-driven corporate identities.",
			"Accessibility (WCAG AA) expanded the client's reach to larger government and corporate contracts.",
		],
	},
};
