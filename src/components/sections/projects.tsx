import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { getShowcaseProjects, type Project } from "../../data/projects";

/* ─────────────────────────────────────────────
   SUB-COMPONENT: The Project Visuals
───────────────────────────────────────────── */
function ProjectVisuals({
	images,
}: {
	images: Project["homepage"]["images"];
}) {
	return (
		<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
			{images.map((img) => (
				<div
					key={img.label}
					className="relative aspect-video rounded-2xl overflow-hidden bg-zinc-950 border border-white/[0.06] group/img flex flex-col justify-between p-5"
				>
					<div
						className={`absolute inset-0 bg-gradient-to-br ${img.bg} opacity-20 group-hover/img:opacity-40 transition-opacity duration-500`}
					/>
					<div className="relative z-10 flex items-center justify-between">
						<span className="text-[9px] uppercase tracking-[0.25em] font-mono text-white/30">
							{img.label}
						</span>
						<span className="text-2xl">{img.icon}</span>
					</div>
					<div className="relative z-10">
						<div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent mb-3" />
						<p className="text-[10px] font-mono text-white/20 uppercase tracking-widest">
							{img.stat ?? "Case study"}
						</p>
					</div>
				</div>
			))}
		</div>
	);
}

/* ─────────────────────────────────────────────
   SUB-COMPONENT: Case Study Row
───────────────────────────────────────────── */
function CaseStudyCard({ project }: { project: Project }) {
	const cardRef = useRef<HTMLDivElement>(null);
	const { scrollYProgress } = useScroll({
		target: cardRef,
		offset: ["start end", "end start"],
	});

	const yTranslate = useTransform(scrollYProgress, [0, 1], [50, -50]);
	const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

	const { homepage } = project;
	const isRose = homepage.accent === "rose";
	const accentClass = isRose ? "text-rose" : "text-green";

	return (
		<motion.article
			ref={cardRef}
			style={{ opacity }}
			className="relative py-12 border-white/10 group"
		>
			<div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
				{/* Left Side: Info */}
				<div className="lg:col-span-5 sticky top-32">
					<div className="flex items-center gap-4 mb-6">
						<span className={`text-xs font-mono ${accentClass}`}>
							{homepage.index}
						</span>
						<span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
							{project.category}
						</span>
					</div>

					<h3 className="text-5xl md:text-7xl font-serif leading-none mb-6">
						{project.title}
					</h3>

					<p className="text-lg text-muted-foreground font-light leading-relaxed mb-8 max-w-md">
						{project.tagline}
					</p>

					<div className="flex flex-wrap gap-2 mb-10">
						{project.stack.map((tech) => (
							<span
								key={tech}
								className="px-3 py-1 rounded-full border border-white/5 bg-white/[0.02] text-[10px] font-mono opacity-50"
							>
								{tech}
							</span>
						))}
					</div>

					<Link
						to={`/projects/${project.slug}`}
						className={`inline-flex items-center gap-2 text-xs uppercase tracking-widest font-bold ${accentClass} group/link`}
					>
						Explore Case Study
						<ArrowUpRight className="w-4 h-4 group-hover/link:translate-x-1 group-hover/link:-translate-y-1 transition-transform" />
					</Link>
				</div>

				{/* Right Side: Visuals */}
				<motion.div style={{ y: yTranslate }} className="lg:col-span-7">
					<ProjectVisuals images={homepage.images} />
					<div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 text-sm text-muted-foreground font-light">
						<div>
							<h4 className="text-[10px] uppercase tracking-widest text-white/20 mb-3">
								Objective
							</h4>
							{project.description}
						</div>
						<div>
							<h4 className="text-[10px] uppercase tracking-widest text-white/20 mb-3">
								Key Solutions
							</h4>
							<ul className="space-y-2">
								{homepage.highlights.map((h) => (
									<li key={h} className="flex gap-2">
										<span
											className={`w-1 h-1 rounded-full mt-2 shrink-0 ${isRose ? "bg-rose" : "bg-green"}`}
										/>
										{h}
									</li>
								))}
							</ul>
						</div>
					</div>
				</motion.div>
			</div>
		</motion.article>
	);
}

/* ─────────────────────────────────────────────
   MAIN COMPONENT: The Projects Section
───────────────────────────────────────────── */
export function Projects() {
	const showcaseProjects = getShowcaseProjects();

	return (
		<section
			id="work"
			className="relative  px-6 md:px-12 bg-transparent overflow-hidden"
		>
			<div className="max-w-7xl mx-auto relative z-10 border-t border-white/[0.05] pt-16">
				{/* Editorial Header */}
				<header className="mb-16 overflow-hidden">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						className="text-[10px] uppercase tracking-[0.4em] mb-8 font-mono font-bold text-rose"
					>
						Selected Works
					</motion.div>
					<h2 className="text-6xl md:text-9xl font-serif tracking-tighter leading-[0.85]">
						{"Crafting with".split("").map((char, i) => (
							<motion.span
								key={i}
								initial={{ opacity: 0, y: 60 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{
									duration: 0.5,
									delay: i * 0.03,
									ease: [0.16, 1, 0.3, 1],
								}}
								className="inline-block"
								style={{ whiteSpace: char === " " ? "pre" : "normal" }}
							>
								{char}
							</motion.span>
						))}
						<br />
						<span className="italic text-transparent bg-clip-text bg-gradient-to-r from-rose via-purple-400 to-green">
							{"Intention.".split("").map((char, i) => (
								<motion.span
									key={i}
									initial={{ opacity: 0, y: 60 }}
									whileInView={{ opacity: 1, y: 0 }}
									viewport={{ once: true }}
									transition={{
										duration: 0.5,
										delay: 0.2 + i * 0.04,
										ease: [0.16, 1, 0.3, 1],
									}}
									className="inline-block"
								>
									{char}
								</motion.span>
							))}
						</span>
					</h2>
				</header>

				{/* The Timeline of Projects */}
				<div className="space-y-0">
					{showcaseProjects.map((project) => (
						<CaseStudyCard key={project.slug} project={project} />
					))}
				</div>
			</div>
		</section>
	);
}
