import { marked } from "marked";

export type BlogPost = {
	slug: string;
	title: string;
	date: string;
	tags: string[];
	excerpt: string;
	readTime: string;
	body: string;
	html: string;
};

type Frontmatter = {
	slug?: string;
	title?: string;
	date?: string;
	tags?: string[] | string;
	excerpt?: string;
	readTime?: string;
};

function parseFrontmatter(raw: string): {
	frontmatter: Frontmatter;
	body: string;
} {
	const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
	if (!match) {
		return { frontmatter: {}, body: raw.trim() };
	}

	const frontmatter: Frontmatter = {};
	for (const line of match[1].split("\n")) {
		const colon = line.indexOf(":");
		if (colon === -1) continue;
		const key = line.slice(0, colon).trim();
		let value = line.slice(colon + 1).trim();
		if (value.startsWith("[") && value.endsWith("]")) {
			frontmatter.tags = value
				.slice(1, -1)
				.split(",")
				.map((t) => t.trim().replace(/^['"]|['"]$/g, ""));
		} else {
			value = value.replace(/^['"]|['"]$/g, "");
			(frontmatter as Record<string, string>)[key] = value;
		}
	}

	return { frontmatter, body: match[2].trim() };
}

export function parseBlogPost(raw: string, fallbackSlug?: string): BlogPost {
	const { frontmatter, body } = parseFrontmatter(raw);
	const slug = frontmatter.slug ?? fallbackSlug ?? "untitled";

	return {
		slug,
		title: frontmatter.title ?? slug,
		date: frontmatter.date ?? new Date().toISOString().slice(0, 10),
		tags: Array.isArray(frontmatter.tags)
			? frontmatter.tags
			: frontmatter.tags
				? [frontmatter.tags]
				: [],
		excerpt: frontmatter.excerpt ?? "",
		readTime: frontmatter.readTime ?? "",
		body,
		html: marked.parse(body, { async: false }) as string,
	};
}

export function formatBlogDate(isoDate: string): string {
	return new Intl.DateTimeFormat("en-US", {
		month: "long",
		day: "numeric",
		year: "numeric",
	}).format(new Date(isoDate + "T12:00:00"));
}
