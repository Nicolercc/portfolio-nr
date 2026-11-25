import { Sky } from "../components/layouts/Sky";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useReducedMotion } from "../lib/motionPreference";
import { blogPostList } from "../data/blog";
import { formatBlogDate } from "../lib/parseBlogPost";
import { PROFILE } from "../data/profile";
import { setDocumentMeta } from "../lib/documentMeta";

const ease = [0.16, 1, 0.3, 1] as const;

function StaggerHeadline({
	line1,
	line2,
}: {
	line1: string;
	line2: string;
}) {
	const reduceMotion = useReducedMotion();

	if (reduceMotion) {
		return (
			<h1
				data-route-heading
				tabIndex={-1}
				className="text-6xl md:text-9xl font-serif tracking-tighter leading-[0.85] focus:outline-none"
			>
				{line1} <br />
				<span className="italic text-rose">{line2}</span>
			</h1>
		);
	}

	return (
		<h1
			data-route-heading
			tabIndex={-1}
			className="text-6xl md:text-9xl font-serif tracking-tighter leading-[0.85] focus:outline-none"
		>
			{line1.split("").map((char, i) => (
				<motion.span
					key={`l1-${i}`}
					initial={{ opacity: 0, y: 16 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.3, delay: i * 0.03, ease }}
					className="inline-block"
					style={{ whiteSpace: char === " " ? "pre" : "normal" }}
				>
					{char}
				</motion.span>
			))}
			<br />
			<span className="italic text-rose">
				{line2.split("").map((char, i) => (
					<motion.span
						key={`l2-${i}`}
						initial={{ opacity: 0, y: 16 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.3, delay: 0.2 + i * 0.04, ease }}
						className="inline-block text-rose"
					>
						{char}
					</motion.span>
				))}
			</span>
		</h1>
	);
}

export default function Blog() {
	useEffect(() => {
		setDocumentMeta({
			title: `Writing — ${PROFILE.name}`,
			description: `Essays and notes by ${PROFILE.name}, ${PROFILE.positioning}.`,
			path: "/blog",
			structuredData: {
				"@context": "https://schema.org",
				"@type": "Blog",
				name: `Writing — ${PROFILE.name}`,
				url: `${PROFILE.website}/blog`,
				author: {
					"@type": "Person",
					name: PROFILE.name,
					url: PROFILE.website,
				},
				blogPost: blogPostList.map((post) => ({
					"@type": "BlogPosting",
					headline: post.title,
					url: `${PROFILE.website}/blog/${post.slug}`,
					datePublished: post.date,
				})),
			},
		});
	}, []);

	return (
		<>
		<Sky mode={{ kind: "record" }} />
		<main id="main-content" tabIndex={-1} className="min-h-screen text-foreground px-6 md:px-12 pt-28 pb-16 md:pt-32 md:pb-24 selection:bg-rose/30 focus:outline-none">
			<div className="max-w-7xl mx-auto">
				<header className="mb-16 overflow-hidden border-t border-white/[0.05] pt-16">
					<motion.div
						initial={{ opacity: 0, y: 16 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.7, ease }}
						className="text-caption uppercase mb-8 font-sans font-semibold tracking-[0.12em] text-rose-light"
					>
						Writing
					</motion.div>
					<StaggerHeadline line1="Thinking in" line2="Public." />
				</header>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
					{blogPostList.map((post, idx) => (
						<motion.article
							key={post.slug}
							initial={{ opacity: 0, y: 16 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.7, delay: idx * 0.08, ease }}
						>
							<Link
								to={`/blog/${post.slug}`}
								className="block glass-panel rounded-2xl border border-white/8 p-7 md:p-8 transition-all duration-300 hover:border-white/20 group"
							>
								<h2 className="text-3xl md:text-4xl font-serif mb-4 tracking-tight group-hover:text-rose transition-colors duration-300">
									{post.title}
								</h2>
								<p className="text-caption uppercase mb-3 font-sans font-semibold tracking-[0.12em] text-rose-light">
									{formatBlogDate(post.date)} · {post.readTime}
								</p>
								{post.tags.length > 0 && (
									<p className="text-caption uppercase mb-5 font-sans font-semibold tracking-[0.12em] text-rose-light">
										{post.tags.join(" · ")}
									</p>
								)}
								<p className="text-muted-foreground leading-relaxed">
									{post.excerpt}
								</p>
								<span className="text-link mt-7">
									Read essay <span aria-hidden>→</span>
								</span>
							</Link>
						</motion.article>
					))}
				</div>
			</div>
		</main>
		</>
	);
}
