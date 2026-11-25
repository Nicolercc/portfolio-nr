import { Sky } from "../components/layouts/Sky";
import { useEffect } from "react";
import type { ReactNode } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { getBlogPost } from "../data/blog";
import { formatBlogDate } from "../lib/parseBlogPost";
import { PROFILE } from "../data/profile";
import { setDocumentMeta } from "../lib/documentMeta";
import NotFound from "./NotFound";

const ease = [0.16, 1, 0.3, 1] as const;

function renderInline(text: string) {
	const nodes: ReactNode[] = [];
	const pattern = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|\[[^\]]+\]\(https?:\/\/[^)]+\))/g;
	let cursor = 0;
	let match: RegExpExecArray | null;

	while ((match = pattern.exec(text)) !== null) {
		if (match.index > cursor) {
			nodes.push(text.slice(cursor, match.index));
		}

		const token = match[0];
		const key = `${match.index}-${token}`;
		if (token.startsWith("**")) {
			nodes.push(<strong key={key}>{token.slice(2, -2)}</strong>);
		} else if (token.startsWith("*")) {
			nodes.push(<em key={key}>{token.slice(1, -1)}</em>);
		} else if (token.startsWith("`")) {
			nodes.push(<code key={key}>{token.slice(1, -1)}</code>);
		} else {
			const linkMatch = token.match(/^\[([^\]]+)\]\((https?:\/\/[^)]+)\)$/);
			if (linkMatch) {
				nodes.push(
					<a key={key} href={linkMatch[2]} target="_blank" rel="noopener noreferrer">
						{linkMatch[1]}
					</a>,
				);
			} else {
				nodes.push(token);
			}
		}

		cursor = match.index + token.length;
	}

	if (cursor < text.length) {
		nodes.push(text.slice(cursor));
	}

	return nodes;
}

function MarkdownContent({ body }: { body: string }) {
	const blocks: ReactNode[] = [];
	const lines = body.split(/\r?\n/);
	let paragraph: string[] = [];
	let list: string[] = [];

	const flushParagraph = () => {
		if (!paragraph.length) return;
		const text = paragraph.join(" ");
		blocks.push(<p key={`p-${blocks.length}`}>{renderInline(text)}</p>);
		paragraph = [];
	};

	const flushList = () => {
		if (!list.length) return;
		blocks.push(
			<ul key={`ul-${blocks.length}`}>
				{list.map((item) => (
					<li key={item}>{renderInline(item)}</li>
				))}
			</ul>,
		);
		list = [];
	};

	for (const rawLine of lines) {
		const line = rawLine.trim();
		if (!line) {
			flushParagraph();
			flushList();
			continue;
		}

		if (line === "---") {
			flushParagraph();
			flushList();
			blocks.push(<hr key={`hr-${blocks.length}`} />);
			continue;
		}

		if (line.startsWith("## ")) {
			flushParagraph();
			flushList();
			blocks.push(<h2 key={`h2-${blocks.length}`}>{renderInline(line.slice(3))}</h2>);
			continue;
		}

		if (line.startsWith("### ")) {
			flushParagraph();
			flushList();
			blocks.push(<h3 key={`h3-${blocks.length}`}>{renderInline(line.slice(4))}</h3>);
			continue;
		}

		if (/^[-*]\s+/.test(line)) {
			flushParagraph();
			list.push(line.replace(/^[-*]\s+/, ""));
			continue;
		}

		paragraph.push(line);
	}

	flushParagraph();
	flushList();

	return <>{blocks}</>;
}

export default function BlogPost() {
	const { slug } = useParams();
	const post = slug ? getBlogPost(slug) : undefined;

	useEffect(() => {
		window.scrollTo(0, 0);
	}, [slug]);

	useEffect(() => {
		if (post) {
			setDocumentMeta({
				title: `${post.title} — ${PROFILE.name}`,
				description: post.excerpt,
				path: `/blog/${post.slug}`,
				type: "article",
				structuredData: {
					"@context": "https://schema.org",
					"@type": "BlogPosting",
					headline: post.title,
					description: post.excerpt,
					url: `${PROFILE.website}/blog/${post.slug}`,
					datePublished: post.date,
					author: {
						"@type": "Person",
						name: PROFILE.name,
						url: PROFILE.website,
					},
				},
			});
		}
	}, [post]);

	if (!post) {
		return <NotFound />;
	}

	const fadeUp = {
		initial: { opacity: 0, y: 16 },
		animate: { opacity: 1, y: 0 },
		transition: { duration: 0.7, ease },
	};

	return (
		<>
		<Sky mode={{ kind: "record" }} />
		<main id="main-content" tabIndex={-1} className="text-foreground min-h-screen selection:bg-rose/30 pb-24 isolate focus:outline-none">

				<header className="relative pt-40 md:pt-52 px-6 md:px-20">
					<motion.div {...fadeUp} className="max-w-[65ch] mx-auto">
						<span className="section-label block">
							{formatBlogDate(post.date)} · {post.readTime}
						</span>
						<h1
							data-route-heading
							tabIndex={-1}
							className="text-5xl md:text-7xl font-serif leading-[0.95] mb-8 tracking-tighter focus:outline-none"
						>
							{post.title}
						</h1>
						{post.tags.length > 0 && (
							<p className="text-caption uppercase font-sans font-semibold tracking-[0.12em] text-rose-light">
								{post.tags.join(" · ")}
							</p>
						)}
					</motion.div>
				</header>

				<article className="px-6 md:px-20 pt-12 md:pt-16">
					<div className="blog-prose mx-auto max-w-[65ch]">
						<MarkdownContent body={post.body} />
					</div>
				</article>

				<footer className="px-6 md:px-20 pt-20 pb-8">
					<div className="max-w-[65ch] mx-auto flex flex-col sm:flex-row items-center justify-center gap-4">
						<Link
							to="/blog"
							className="btn-secondary"
						>
							More writing
						</Link>
						<Link
							to="/#contact"
							className="btn-primary"
						>
							Get in touch
						</Link>
					</div>
				</footer>
		</main>
		</>
	);
}
