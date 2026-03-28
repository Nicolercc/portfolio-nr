import { useParams, Link } from "react-router-dom";
import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { projectsData } from "../data/projects";
import { ArrowUpRight, Play } from "lucide-react";

export default function CaseStudy() {
	const { slug } = useParams();
	const project = projectsData[slug as keyof typeof projectsData];

	const projectKeys = Object.keys(projectsData);
	const currentIndex = projectKeys.indexOf(slug || "");
	const nextIndex = (currentIndex + 1) % projectKeys.length;
	const nextProjectKey = projectKeys[nextIndex];
	const nextProject = projectsData[nextProjectKey as keyof typeof projectsData];

	useEffect(() => {
		window.scrollTo(0, 0);
	}, [slug]);

	if (!project) return null;

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
						{"heroVideo" in project && project.heroVideo ? (
							<video
								src={project.heroVideo as string}
								autoPlay
								loop
								muted
								playsInline
								className="absolute inset-0 h-full w-full object-cover object-top grayscale hover:grayscale-0 transition-all duration-1000 scale-105 group-hover:scale-100"
							/>
						) : "heroImage" in project && project.heroImage ? (
							<img
								src={project.heroImage as string}
								alt={`${project.title} hero`}
								className="absolute inset-0 h-full w-full object-cover object-top grayscale hover:grayscale-0 transition-all duration-1000 scale-105 group-hover:scale-100"
								loading="eager"
								decoding="async"
							/>
						) : (
							<>
								{/* Screenshot placeholder — projectsData doesn't currently include image fields */}
								<div className="absolute inset-0 bg-rose/5 mix-blend-multiply" />
								<div className="absolute inset-0 opacity-[0.18] bg-[linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:28px_28px]" />
								<div className="relative h-full w-full flex items-center justify-center">
									<p className="text-[10px] uppercase tracking-[0.28em] font-mono text-muted-foreground">
										Screenshot coming soon
									</p>
								</div>
							</>
						)}
					</motion.div>
				</header>

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
						<a
							href={project.live}
							target="_blank"
							rel="noreferrer"
							className="inline-flex items-center gap-3 text-rose font-mono text-[10px] uppercase tracking-widest hover:gap-5 transition-all duration-300"
						>
							Explore Site <ArrowUpRight size={14} />
						</a>
					</aside>

					{/* Main Story Content */}
					<div className="md:col-span-8 space-y-32">
						{/* 2. THE FEATURE SPLIT: TEXT + VISUAL */}
						<div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
							<motion.div {...fadeUp} className="space-y-6">
								<h3 className="font-mono text-[10px] uppercase tracking-[0.3em] text-rose italic opacity-80">
									The Vision
								</h3>
								<p className="text-2xl md:text-3xl font-serif italic leading-relaxed">
									{project.why}
								</p>
							</motion.div>

							<motion.div
								{...fadeUp}
								className="aspect-square bg-muted rounded-lg overflow-hidden border border-white/5 relative group"
							>
								{"detailImage" in project && project.detailImage ? (
									<img
										src={project.detailImage as string}
										alt={`${project.title} product detail`}
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

						{/* Core Decisions Section */}
						<div className="grid grid-cols-1 md:grid-cols-2 gap-16 pt-16 border-t border-white/5">
							<div className="space-y-6">
								<h3 className="font-mono text-[10px] uppercase tracking-[0.3em] text-rose italic opacity-80">
									Strategic Logic
								</h3>
								<p className="font-light text-muted-foreground leading-relaxed">
									{project.decisions}
								</p>
							</div>
							<div className="space-y-6">
								<h3 className="font-mono text-[10px] uppercase tracking-[0.3em] text-rose italic opacity-80">
									UX Philosophy
								</h3>
								<p className="font-light text-muted-foreground leading-relaxed">
									{project.ux}
								</p>
							</div>
						</div>
					</div>
				</section>

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
