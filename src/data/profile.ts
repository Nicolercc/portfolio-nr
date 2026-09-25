export const PROFILE = {
	name: "Nicole Rodriguez",
	displayName: "Nicole R.",
	title: "Software Engineer",
	specialties: ["Full-Stack", "Applied AI", "Data Systems"],
	positioning: "Software Engineer - Full-Stack, Applied AI, and Data Systems",
	eyebrow: "Software Engineer · Full-Stack · Applied AI · Data Systems",
	email: "nicolerodriguezcab@gmail.com",
	github: "https://github.com/Nicolercc",
	linkedin: "https://www.linkedin.com/in/nicolerodriguezz/",
	website: "https://nicolerodriguez.dev",
	location: "New York, NY",
	locationShort: "NYC",
	background: "Dominican Republic-raised",
	resumePath: "/Nicole_Rodriguez_Resume.pdf",
	pursuitPeriod: "2026 — Present",
	summary:
		"NYC-based software engineer building full-stack products, applied AI workflows, and public-data systems with TypeScript, Python, React, and PostgreSQL.",
} as const;

export const mailtoHref = `mailto:${PROFILE.email}`;
