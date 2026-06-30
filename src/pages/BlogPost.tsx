import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { getBlogPost } from "../data/blog";
import { formatBlogDate } from "../lib/parseBlogPost";
import NotFound from "./NotFound";

const ease = [0.16, 1, 0.3, 1] as const;

export default function BlogPost() {
	const { slug } = useParams();
	const post = slug ? getBlogPost(slug) : undefined;

	useEffect(() => {
		window.scrollTo(0, 0);
	}, [slug]);

	useEffect(() => {
		if (post) {
			document.title = `${post.title} — Nicole Rodriguez`;
		}
	}, [post]);

	if (!post) {
		return <NotFound />;
	}

	const fadeUp = {
		initial: { opacity: 0, y: 20 },
		animate: { opacity: 1, y: 0 },
		transition: { duration: 0.8, ease },
	};

	return (
		<main className="bg-background text-foreground min-h-screen selection:bg-rose/30 pb-24 isolate">
			<nav className="fixed top-0 left-0 w-full z-50 p-6 md:p-10 flex justify-between items-start pointer-events-none">
				<Link
					to="/blog"
					className="pointer-events-auto group flex items-center gap-4 font-mono text-[10px] uppercase tracking-[0.4em] text-rose/60 hover:text-rose transition-all duration-500"
				>
						<span className="h-px w-8 bg-rose/30 group-hover:w-12 group-hover:bg-rose transition-all" />
						Back to Writing
					</Link>
				</nav>

				<header className="relative pt-40 md:pt-52 px-6 md:px-20">
					<motion.div {...fadeUp} className="max-w-[65ch] mx-auto">
						<span className="section-label mb-6 block font-mono text-rose uppercase tracking-[0.4em]">
							{formatBlogDate(post.date)} · {post.readTime}
						</span>
						<h1 className="text-5xl md:text-7xl font-serif italic leading-[0.95] mb-8 tracking-tighter">
							{post.title}
						</h1>
						{post.tags.length > 0 && (
							<p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
								{post.tags.join(" · ")}
							</p>
						)}
					</motion.div>
				</header>

				<article className="px-6 md:px-20 pt-12 md:pt-16">
					<div
						className="blog-prose mx-auto max-w-[65ch]"
						dangerouslySetInnerHTML={{ __html: post.html }}
					/>
				</article>

				<footer className="px-6 md:px-20 pt-20 pb-8">
					<div className="max-w-[65ch] mx-auto flex flex-col sm:flex-row items-center justify-center gap-4">
						<Link
							to="/blog"
							className="group inline-flex items-center gap-3 px-5 py-3 rounded-full border border-rose/30 bg-rose/5 hover:bg-rose/10 hover:border-rose/60 text-rose font-mono text-[11px] uppercase tracking-widest transition-all duration-300"
						>
							<span className="w-1.5 h-1.5 rounded-full bg-rose animate-pulse" />
							More Writing
						</Link>
						<Link
							to="/#contact"
							className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-green text-[#0d0d0d] text-sm font-medium hover:bg-green/85 transition-colors duration-200"
						>
							Get in Touch
						</Link>
					</div>
				</footer>
		</main>
	);
}
