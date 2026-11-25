import { MoreWorkList } from "../MoreWorkList";
import { Fragment, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { useReducedMotion } from "../../lib/motionPreference";
import { ArrowUpRight } from "lucide-react";
import { getShowcaseProjects, type CaseStudyProject } from "../../data/projects";

/* ─────────────────────────────────────────────
   SUB-COMPONENT: The Project Visuals
───────────────────────────────────────────── */
function ProjectVisuals({ project }: { project: CaseStudyProject }) {
	const { media } = project;

	return (
		<figure>
			<div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-zinc-950 border border-white/[0.08] shadow-[0_24px_60px_-28px_rgba(0,0,0,0.8)]">
				{media.hero ? (
					<img
						src={media.hero}
						alt={media.alt ?? `${project.title} interface`}
						width={1440}
						height={900}
						loading="lazy"
						decoding="async"
						className="absolute inset-0 h-full w-full object-cover object-top transition-transform duration-700 motion-safe:group-hover:scale-[1.015]"
					/>
				) : null}
			</div>
		</figure>
	);
}

/* ─────────────────────────────────────────────
   SUB-COMPONENT: Case Study Row
───────────────────────────────────────────── */
function CaseStudyCard({ project, position }: { project: CaseStudyProject; position: number }) {
	const cardRef = useRef<HTMLDivElement>(null);
	const reduceMotion = useReducedMotion();
	const { scrollYProgress } = useScroll({
		target: cardRef,
		offset: ["start end", "end start"],
	});

	// Fade in once; never hide a project again after it has been read.
	const opacity = useTransform(scrollYProgress, [0, 0.2, 1], [0, 1, 1]);

	const accentClass = "text-rose";

	return (
		<motion.article
			ref={cardRef}
			style={reduceMotion ? undefined : { opacity }}
			className="relative py-8 lg:py-12 border-white/10 group"
		>
			<div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-start">
				{/* Left Side: Info */}
				<div className="lg:col-span-5 lg:sticky lg:top-32">
					<div className="flex items-center gap-4 mb-4 lg:mb-6">
						<span className={`text-xs font-mono ${accentClass}`}>
							{String(position).padStart(2, "0")}
						</span>
						<span className="text-caption uppercase tracking-[0.3em] text-muted-foreground">
							{project.category}
						</span>
					</div>

					<h3 className="text-4xl md:text-7xl font-serif leading-none mb-4 lg:mb-6">
						{project.title}
					</h3>

					<p className="text-base md:text-lg text-foreground leading-relaxed mb-3 lg:mb-4 max-w-md">
						{project.outcome ?? project.tagline}
					</p>

					<p className="mb-6 lg:mb-10 font-mono text-caption text-muted-foreground">
						{(project.keyStack ?? project.stack).slice(0, 4).join(" · ")}
					</p>

					<Link
						to={`/projects/${project.slug}`}
						className={`inline-flex min-h-[44px] items-center gap-2 text-xs uppercase tracking-widest font-bold ${accentClass} group/link`}
					>
						Explore Case Study
						<ArrowUpRight className="w-4 h-4 group-hover/link:translate-x-1 group-hover/link:-translate-y-1 transition-transform" />
					</Link>
				</div>

				{/* Right Side: Visuals */}
				<div
					className="order-first lg:order-none lg:col-span-7"
				>
					<ProjectVisuals project={project} />
				</div>
			</div>
		</motion.article>
	);
}

/* ─────────────────────────────────────────────
   MAIN COMPONENT: The Projects Section
───────────────────────────────────────────── */
export function Projects() {
	const showcaseProjects = getShowcaseProjects();
	const reduceMotion = useReducedMotion();

	return (
		<section
			id="work"
			className="relative scroll-mt-24 px-6 md:px-12 bg-transparent overflow-hidden"
		>
			<div className="max-w-7xl mx-auto relative z-10 border-t border-white/[0.05] pt-16">
				{/* Editorial Header */}
				<header className="mb-16 overflow-hidden">
					<h2 className="section-label">Case studies</h2>
					<p className="text-6xl md:text-9xl font-serif tracking-tighter leading-[0.85]">
						<span className="sr-only">Crafting with intention.</span>
						<span aria-hidden="true">
						{/* Letters animate one by one, but each word stays unbreakable. */}
						{["Crafting", "with"].map((word, w) => (
							<Fragment key={word}>
							{w > 0 ? " " : null}
							<span className="inline-block whitespace-nowrap">
								{word.split("").map((char, i) => (
									<motion.span
										key={i}
										initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 60 }}
										whileInView={{ opacity: 1, y: 0 }}
										viewport={{ once: true }}
										transition={{
											duration: 0.5,
											delay: (w * 9 + i) * 0.03,
											ease: [0.16, 1, 0.3, 1],
										}}
										className="inline-block"
									>
										{char}
									</motion.span>
								))}
							</span>
							</Fragment>
						))}
						<br />
						<span className="italic text-rose">
							{"intention.".split("").map((char, i) => (
								<motion.span
									key={i}
									initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 60 }}
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
						</span>
					</p>
				</header>

				{/* The Timeline of Projects */}
				<div className="space-y-0">
					{showcaseProjects.map((project, i) => (
						<CaseStudyCard key={project.slug} project={project} position={i + 1} />
					))}
				</div>
				<MoreWorkList compact />
			</div>
		</section>
	);
}
