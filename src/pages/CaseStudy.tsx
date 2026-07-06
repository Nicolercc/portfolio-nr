import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
	getProject,
	getNextProjectSlug,
	type ProjectMedia,
} from "../data/projects";
import { ArrowUpRight, GitBranch, Play } from "lucide-react";
import NotFound from "./NotFound";

function CaseStudyMediaPlaceholder({ label }: { label: string }) {
	return (
		<>
			<div className="absolute inset-0 bg-rose/5 mix-blend-multiply" />
			<div className="absolute inset-0 opacity-[0.18] bg-[linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:28px_28px]" />
			<div className="relative flex h-full w-full items-center justify-center">
				<p className="text-[10px] uppercase tracking-[0.28em] font-mono text-muted-foreground">
					{label}
				</p>
			</div>
		</>
	);
}

function CaseStudyHeroMedia({
	media,
	title,
}: {
	media: ProjectMedia;
	title: string;
}) {
	const reduceMotion = useReducedMotion();
	const [videoError, setVideoError] = useState(false);
	const poster = media.poster ?? media.hero;
	const alt = media.alt ?? `${title} hero`;
	const motionClass = reduceMotion
		? "absolute inset-0 h-full w-full object-cover object-top"
		: "absolute inset-0 h-full w-full object-cover object-top grayscale hover:grayscale-0 transition-all duration-1000 scale-105 group-hover:scale-100";

	if (media.video && !videoError) {
		if (reduceMotion && poster) {
			return (
				<img
					src={poster}
					alt={alt}
					className={motionClass}
					loading="eager"
					decoding="async"
				/>
			);
		}

		return (
			<video
				src={media.video}
				poster={poster}
				controls
				preload="none"
				playsInline
				aria-label={`${title} demo video`}
				onError={() => setVideoError(true)}
				className={motionClass}
			/>
		);
	}

	if (poster) {
		return (
			<img
				src={poster}
				alt={alt}
				className={motionClass}
				loading="eager"
				decoding="async"
			/>
		);
	}

	if (media.hero) {
		return (
			<img
				src={media.hero}
				alt={alt}
				className={motionClass}
				loading="eager"
				decoding="async"
			/>
		);
	}

	return <CaseStudyMediaPlaceholder label="Screenshot coming soon" />;
}

export default function CaseStudy() {
	const { slug } = useParams();
	const project = slug ? getProject(slug) : undefined;

	useEffect(() => {
		window.scrollTo(0, 0);
	}, [slug]);

	if (!project) {
		return <NotFound />;
	}

	const nextProjectKey = getNextProjectSlug(project.slug);
	const nextProject = getProject(nextProjectKey);

	if (!nextProject) {
		return <NotFound />;
	}

	const { caseStudy: cs, media, links, metrics } = project;

	// Framer Motion Variants for smooth entrance
	const fadeUp = {
		initial: { opacity: 0, y: 20 },
		whileInView: { opacity: 1, y: 0 },
		viewport: { once: true },
		transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const },
	};

	return (
		<AnimatePresence mode="wait">
			<motion.main
				key={slug}
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				exit={{ opacity: 0 }}
				className="bg-background text-foreground min-h-screen selection:bg-rose/30 pb-20"
			>
				{/* ── GHOST NAV ── */}
				<nav className="fixed top-0 left-0 w-full z-50 p-6 md:p-10 flex justify-between items-start mix-blend-difference pointer-events-none">
					<Link
						to="/#work"
						className="pointer-events-auto group flex items-center gap-4 font-mono text-[10px] uppercase tracking-[0.4em] text-rose/60 hover:text-rose transition-all duration-500"
					>
						<span className="h-[1px] w-8 bg-rose/30 group-hover:w-12 group-hover:bg-rose transition-all" />
						Back to Work
					</Link>
				</nav>

				{/* ── HERO SECTION ── */}
				<header className="relative pt-40 md:pt-60 px-6 md:px-20 mb-20">
					<motion.div {...fadeUp}>
						<span className="section-label mb-6 block font-mono text-rose uppercase tracking-[0.5em]">
							{project.category} — {project.year}
						</span>
						<h1 className="text-[12vw] md:text-[9vw] font-serif italic leading-[0.8] mb-12 tracking-tighter">
							{project.title}
						</h1>
						<p className="max-w-2xl text-xl md:text-2xl font-light text-muted-foreground italic border-l border-rose/20 pl-8 mb-12">
							{project.tagline}
						</p>
					</motion.div>

					{/* 1. CINEMATIC HERO IMAGE/VIDEO */}
					<motion.div
						initial={{ opacity: 0, scale: 0.95 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{ duration: 1.2, ease: "easeOut" }}
						className="relative w-full aspect-[21/9] bg-muted rounded-sm overflow-hidden group border border-white/5"
					>
						<CaseStudyHeroMedia media={media} title={project.title} />
					</motion.div>
				</header>

				{metrics && metrics.length > 0 && (
					<div className="px-6 md:px-20 py-10 border-y border-white/5 bg-white/[0.01]">
						<div className="max-w-screen-xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
							{metrics.map((m) => (
								<div key={m.label} className="space-y-1">
									<p className="font-mono text-3xl md:text-4xl font-bold text-white tracking-tighter">
										{m.value}
									</p>
									<p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/50 mt-1">
										{m.label}
									</p>
								</div>
							))}
						</div>
					</div>
				)}

				{/* ── NARRATIVE GRID ── */}
				<section className="px-6 md:px-20 py-20 grid grid-cols-1 md:grid-cols-12 gap-20">
					{/* Metadata Sidebar */}
					<aside className="md:col-span-4 space-y-16">
						<div className="space-y-4">
							<h3 className="font-mono text-[10px] uppercase tracking-[0.3em] text-rose italic opacity-80">
								Tech Stack
							</h3>
							<div className="flex flex-wrap gap-2">
								{project.stack.map((tech) => (
									<span
										key={tech}
										className="px-3 py-1 border border-white/10 rounded-full font-mono text-[9px] uppercase tracking-wider text-muted-foreground"
									>
										{tech}
									</span>
								))}
							</div>
						</div>
						<div className="space-y-4">
							<h3 className="font-mono text-[10px] uppercase tracking-[0.3em] text-rose italic opacity-80">
								Role
							</h3>
							<p className="font-serif text-lg italic opacity-70 leading-relaxed">
								{project.role}
							</p>
						</div>
						<div className="space-y-3 pt-4 border-t border-white/5">
							{links.live && (
								<a
									href={links.live}
									target="_blank"
									rel="noreferrer"
									className="group inline-flex items-center gap-3 px-5 py-3 rounded-full border border-rose/30 bg-rose/5 hover:bg-rose/10 hover:border-rose/60 w-full justify-center text-rose font-mono text-[11px] uppercase tracking-widest transition-all duration-300"
								>
									<span className="w-1.5 h-1.5 rounded-full bg-rose animate-pulse" />
									View Live Site
									<ArrowUpRight
										size={12}
										className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
									/>
								</a>
							)}
							{links.github && (
								<a
									href={links.github}
									target="_blank"
									rel="noreferrer"
									className="inline-flex items-center justify-center gap-2 w-full font-mono text-[10px] uppercase tracking-widest text-white/30 hover:text-white/60 transition-colors py-2"
								>
									<GitBranch size={10} />
									Source Code
								</a>
							)}
						</div>
					</aside>

					{/* Main Story Content */}
					<div className="md:col-span-8 space-y-20">
						{/* 2. THE FEATURE SPLIT: TEXT + VISUAL */}
						<div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
							<motion.div {...fadeUp} className="space-y-6">
								<h3 className="font-mono text-[10px] uppercase tracking-[0.3em] text-rose italic opacity-80">
									The Vision
								</h3>
								<p className="text-2xl md:text-3xl font-serif italic leading-relaxed">
									{cs.problem.split(".")[0]}.
								</p>
							</motion.div>

							<motion.div
								{...fadeUp}
								className="aspect-video bg-muted rounded-lg overflow-hidden border border-white/5 relative group"
							>
								{media.detail ? (
									<img
										src={media.detail}
										alt={media.alt ?? `${project.title} product detail`}
										className="absolute inset-0 h-full w-full object-cover object-top-left grayscale hover:grayscale-0 transition-all duration-700"
										loading="lazy"
										decoding="async"
									/>
								) : (
									<>
										<div className="absolute inset-0 opacity-[0.16] bg-[linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:28px_28px]" />
										<div className="relative z-[1] flex h-full w-full items-center justify-center">
											<p className="text-[10px] uppercase tracking-[0.28em] font-mono text-muted-foreground">
												Detail shot coming soon
											</p>
										</div>
										<div className="absolute inset-0 z-[2] flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
											<div className="rounded-full bg-rose/80 p-4 text-background backdrop-blur-sm">
												<Play size={20} fill="currentColor" />
											</div>
										</div>
									</>
								)}
							</motion.div>
						</div>

						{/* 3. DOUBLE SPREAD: MOBILE/DESKTOP OR TWO SCREENS // UNCOMMENT WHEN IMAGES ARE READY */}
						{/* <div className="space-y-12">
							<h3 className="font-mono text-[10px] uppercase tracking-[0.3em] text-rose italic opacity-80 text-center">
								Interface Dynamics
							</h3>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								<motion.div
									{...fadeUp}
									className="aspect-[4/5] bg-card rounded-md border border-white/5 overflow-hidden"
								>
									<div className="relative h-full w-full flex items-center justify-center bg-white/[0.02]">
										<p className="text-[10px] uppercase tracking-[0.28em] font-mono text-muted-foreground">
											Mobile screenshot soon
										</p>
									</div>
								</motion.div>
								<motion.div
									{...fadeUp}
									className="aspect-[4/5] bg-card rounded-md border border-white/5 overflow-hidden"
								>
									<div className="relative h-full w-full flex items-center justify-center bg-white/[0.02]">
										<p className="text-[10px] uppercase tracking-[0.28em] font-mono text-muted-foreground">
											Desktop screenshot soon
										</p>
									</div>
								</motion.div>
							</div>
						</div> */}

						<div className="space-y-16 pt-16 border-t border-white/5">
							<div className="space-y-6">
								<h3 className="font-mono text-[10px] uppercase tracking-[0.3em] text-rose italic opacity-80">
									Engineering Decisions
								</h3>
								<p className="font-light text-muted-foreground leading-relaxed max-w-3xl text-base">
									{cs.decisions}
								</p>
							</div>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-12 border-t border-white/5 pt-12">
								<div className="space-y-4">
									<h3 className="font-mono text-[10px] uppercase tracking-[0.3em] text-rose italic opacity-80">
										UX Philosophy
									</h3>
									<p className="font-light text-muted-foreground leading-relaxed text-sm">
										{cs.ux}
									</p>
								</div>
								<div className="space-y-4">
									<h3 className="font-mono text-[10px] uppercase tracking-[0.3em] text-green italic opacity-80">
										Performance
									</h3>
									<p className="font-light text-muted-foreground leading-relaxed text-sm">
										{cs.performance}
									</p>
								</div>
							</div>
						</div>
					</div>
				</section>

				<section className="px-6 md:px-20 py-14 border-t border-white/5 max-w-screen-xl mx-auto">
					<div className="grid grid-cols-1 md:grid-cols-12 gap-20">
						<div className="md:col-span-4 space-y-4">
							<h3 className="font-mono text-[10px] uppercase tracking-[0.3em] text-green italic opacity-80">
								Impact
							</h3>
							<p className="font-serif text-xl italic leading-relaxed text-muted-foreground">
								{cs.impact}
							</p>
						</div>
						<div className="md:col-span-8 space-y-8">
							<h3 className="font-mono text-[10px] uppercase tracking-[0.3em] text-rose italic opacity-80">
								Retrospective
							</h3>
							<ul className="space-y-6">
								{cs.lessons.map((lesson, i) => (
									<li
										key={i}
										className="flex gap-6 items-start border-b border-white/5 pb-6 last:border-0"
									>
										<span className="font-mono text-[10px] text-rose/40 mt-1 shrink-0">
											/0{i + 1}
										</span>
										<p className="text-sm font-light text-muted-foreground leading-relaxed">
											{lesson}
										</p>
									</li>
								))}
							</ul>
						</div>
					</div>
				</section>

				{cs.nextSteps && (
					<section className="px-6 md:px-20 py-16 border-t border-white/5">
						<div className="max-w-screen-xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12">
							<div className="md:col-span-4">
								<h3 className="font-mono text-[10px] uppercase tracking-[0.3em] text-rose/60 italic mb-4">
									If I Had More Time
								</h3>
								<p className="font-serif text-2xl italic text-white/70 leading-relaxed">
									What comes next.
								</p>
							</div>
							<div className="md:col-span-8">
								<p className="font-light text-muted-foreground leading-relaxed text-sm border-l border-white/10 pl-8">
									{cs.nextSteps}
								</p>
							</div>
						</div>
					</section>
				)}

				{/* ── NEXT PROJECT FOOTER ── */}
				<footer className="relative py-60 px-6 overflow-hidden border-t border-white/5 group mt-40">
					<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[25vw] font-serif italic text-white/[0.015] whitespace-nowrap select-none pointer-events-none transition-transform duration-1000 group-hover:scale-110">
						{nextProject.title}
					</div>

					<div className="relative z-10 max-w-screen-xl mx-auto text-center">
						<span className="section-label mb-10 block font-mono text-rose/60">
							Next Journey
						</span>
						<Link
							to={`/projects/${nextProjectKey}`}
							className="group relative inline-block"
						>
							<h2 className="text-7xl md:text-[9vw] font-serif italic leading-none transition-all duration-700 group-hover:text-rose">
								{nextProject.title}
							</h2>
							<div className="mt-10 flex flex-col items-center">
								<div className="h-[1px] w-12 bg-rose transition-all duration-700 group-hover:w-48" />
								<div className="mt-6 font-mono text-[10px] uppercase tracking-[0.6em] opacity-40 group-hover:opacity-100 group-hover:translate-y-2 transition-all">
									Discover More
								</div>
							</div>
						</Link>
					</div>
				</footer>
			</motion.main>
		</AnimatePresence>
	);
}
