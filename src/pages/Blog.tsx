import { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { blogPostList } from "../data/blog";
import { formatBlogDate } from "../lib/parseBlogPost";

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
			<h1 className="text-6xl md:text-9xl font-serif tracking-tighter leading-[0.85]">
				{line1} <br />
				<span className="italic text-rose">{line2}</span>
			</h1>
		);
	}

	return (
		<h1 className="text-6xl md:text-9xl font-serif tracking-tighter leading-[0.85]">
			{line1.split("").map((char, i) => (
				<motion.span
					key={`l1-${i}`}
					initial={{ opacity: 0, y: 60 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.5, delay: i * 0.03, ease }}
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
						initial={{ opacity: 0, y: 60 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.5, delay: 0.2 + i * 0.04, ease }}
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
		document.title = "Writing — Nicole Rodriguez";
	}, []);

	return (
		<main className="min-h-screen bg-background text-foreground px-6 md:px-12 py-16 md:py-24 selection:bg-rose/30">
			<div className="max-w-7xl mx-auto">
				<header className="mb-16 overflow-hidden border-t border-white/[0.05] pt-16">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.6, ease }}
						className="text-[10px] uppercase tracking-[0.3em] mb-8 font-mono font-bold text-rose"
					>
						Writing
					</motion.div>
					<StaggerHeadline line1="Thinking in" line2="Public." />
				</header>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
					{blogPostList.map((post, idx) => (
						<motion.article
							key={post.slug}
							initial={{ opacity: 0, y: 24 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.6, delay: idx * 0.08, ease }}
						>
							<Link
								to={`/blog/${post.slug}`}
								className="block glass-panel rounded-3xl border border-white/8 p-7 md:p-8 transition-all duration-300 hover:-translate-y-1 hover:border-white/20 group"
							>
								<h2 className="text-3xl md:text-4xl font-serif italic mb-4 tracking-tight group-hover:text-rose transition-colors duration-300">
									{post.title}
								</h2>
								<p className="text-[10px] uppercase tracking-[0.2em] font-mono text-muted-foreground mb-3">
									{formatBlogDate(post.date)} · {post.readTime}
								</p>
								{post.tags.length > 0 && (
									<p className="text-[10px] uppercase tracking-[0.15em] font-mono text-rose/60 mb-5">
										{post.tags.join(" · ")}
									</p>
								)}
								<p className="text-muted-foreground font-light leading-relaxed">
									{post.excerpt}
								</p>
								<span className="inline-flex items-center gap-2 mt-7 text-sm font-medium text-foreground group-hover:text-rose transition-colors">
									Read essay <span aria-hidden>→</span>
								</span>
							</Link>
						</motion.article>
					))}
				</div>
			</div>
		</main>
	);
}
