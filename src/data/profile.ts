export const PROFILE = {
	name: "Nicole Rodriguez",
	title: "Full-Stack Product Engineer",
	specialties: ["Full-Stack Development", "Product Design", "Accessibility", "Applied AI", "Data Systems"],
	positioning: "Full-Stack Product Engineer - Product Design and Accessibility",
	eyebrow: "Full-Stack Engineer · Product Design · Accessibility",
	email: "nicolerodriguezcab@gmail.com",
	github: "https://github.com/Nicolercc",
	linkedin: "https://www.linkedin.com/in/nicolerodriguezz/",
	website: "https://nicolerodriguez.dev",
	location: "New York, NY",
	locationShort: "NYC",
	background: "Dominican Republic-raised",
	resumePath: "/Nicole_Rodriguez_Resume.pdf",
	pursuitPeriod: "2026 — Present",
	/** Roles and locations Nicole wants, shown in the closing section. Empty hides the line. */
	lookingFor: "" as string,
	summary:
		"NYC-based full-stack product engineer. I build products end to end, from data pipelines and AI features to accessible, carefully designed interfaces.",
	tagline:
		"I build products end to end, for people who don't use them the way I do.",
} as const;

export const mailtoHref = `mailto:${PROFILE.email}`;
