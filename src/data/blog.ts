import iWasTaughtToBuild from "../content/blog/i-was-taught-to-build.md?raw";
import { parseBlogPost, type BlogPost } from "../lib/parseBlogPost";

/** Canonical blog registry — metadata lives in each .md frontmatter; body in src/content/blog/ */
const posts: BlogPost[] = [
	parseBlogPost(iWasTaughtToBuild, "i-was-taught-to-build"),
];

export const blogPosts: Record<string, BlogPost> = Object.fromEntries(
	posts.map((post) => [post.slug, post]),
);

export const blogPostList: BlogPost[] = [...posts].sort(
	(a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
);

export function getBlogPost(slug: string): BlogPost | undefined {
	return blogPosts[slug];
}
