import { MoreWorkList } from "../MoreWorkList";
import { Fragment } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useReducedMotion } from "../../lib/motionPreference";
import { Reveal } from "../ui/Reveal";
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
export function CaseStudyRow({ project, headingLevel = "h3" }: { project: CaseStudyProject; headingLevel?: "h2" | "h3" }) {
	const Heading = headingLevel;
	return (
		<Reveal as="article" className="relative py-8 lg:py-12">
			<div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-start">
				<div className="lg:col-span-5 lg:sticky lg:top-32">
					<p className="mb-3 font-mono text-caption text-muted-foreground">{project.category}</p>

					<Heading className="text-4xl md:text-7xl font-serif font-normal leading-none mb-4 lg:mb-6">
						{project.title}
					</Heading>

					<p className="text-base md:text-lg text-foreground leading-relaxed mb-3 lg:mb-4 max-w-md">
						{project.outcome ?? project.tagline}
					</p>

					<p className="mb-6 lg:mb-10 font-mono text-caption text-muted-foreground">
						{(project.keyStack ?? project.stack).slice(0, 4).join(" · ")}
					</p>

					<Link to={`/projects/${project.slug}`} className="text-link">
						Read the case study <span aria-hidden="true">→</span>
						<span className="sr-only"> for {project.title}</span>
					</Link>
				</div>

				<div className="order-first lg:order-none lg:col-span-7">
					<ProjectVisuals project={project} />
				</div>
			</div>
		</Reveal>
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
			data-chapter="2"
			className="section-rhythm relative scroll-mt-24 px-6 md:px-12 overflow-hidden"
		>
			<div className="max-w-7xl mx-auto relative z-10">
				{/* Editorial Header */}
				<header className="mb-12 overflow-hidden">
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
											duration: 0.7,
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
										duration: 0.7,
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
					{showcaseProjects.map((project) => (
						<CaseStudyRow key={project.slug} project={project} />
					))}
				</div>
				<MoreWorkList compact />
			</div>
		</section>
	);
}
