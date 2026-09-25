export const PROFILE = {
	name: "Nicole Rodriguez",
	displayName: "Nicole R.",
	title: "Product Designer & Engineer",
	specialties: ["UX", "Accessibility", "Frontend Systems"],
	positioning: "Product Designer & Engineer - UX, Accessibility, and Frontend Systems",
	eyebrow: "Product Designer & Engineer · UX · Accessibility · Frontend Systems",
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
		"NYC-based product designer and engineer building accessible interfaces and public-data products from interaction decisions through implementation and validation.",
} as const;

export const mailtoHref = `mailto:${PROFILE.email}`;
