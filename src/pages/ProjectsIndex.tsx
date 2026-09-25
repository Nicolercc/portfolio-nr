import { useEffect } from "react";
import { Link } from "react-router-dom";
import { getShowcaseProjects } from "../data/projects";
import { useInView } from "../hooks/useInView";
import { PROFILE } from "../data/profile";
import { setDocumentMeta } from "../lib/documentMeta";

export default function ProjectsIndex() {
	const projects = getShowcaseProjects();
	const { ref, inView } = useInView();

	useEffect(() => {
		setDocumentMeta({
			title: `Projects — ${PROFILE.name}`,
			description:
				"Selected full-stack, applied AI, and public-data systems case studies by Nicole Rodriguez.",
			path: "/projects",
			structuredData: {
				"@context": "https://schema.org",
				"@type": "CollectionPage",
				name: `Projects — ${PROFILE.name}`,
				url: `${PROFILE.website}/projects`,
				description:
					"Selected full-stack, applied AI, and public-data systems case studies by Nicole Rodriguez.",
				hasPart: projects.map((project) => ({
					"@type": "CreativeWork",
					name: project.title,
					url: `${PROFILE.website}/projects/${project.slug}`,
				})),
			},
		});
	}, [projects]);

	return (
		<main id="main-content" tabIndex={-1} className="min-h-screen bg-background text-foreground px-6 md:px-12 py-16 md:py-20 focus:outline-none">
			<div className="max-w-7xl mx-auto">
				<header className="mb-14 md:mb-16">
					<p className="text-[10px] uppercase tracking-[0.35em] font-mono font-bold text-rose mb-5">
						/ work
					</p>
					<h1
						data-route-heading
						tabIndex={-1}
						className="text-5xl md:text-8xl font-serif tracking-tight leading-[0.9] focus:outline-none"
					>
						Selected Projects
					</h1>
					<p className="mt-5 max-w-2xl text-muted-foreground font-light leading-relaxed">
						A curated index of case studies focused on public-data systems,
						full-stack product engineering, and evidence-backed technical decisions.
					</p>
				</header>

				<section
					ref={ref}
					className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6"
				>
					{projects.map((project, idx) => {
						const num = String(idx + 1).padStart(2, "0");
						return (
							<article
								key={project.slug}
								style={{
									opacity: inView ? 1 : 0,
									transform: inView ? "none" : "translateY(18px)",
									transition:
										"opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
									transitionDelay: `${idx * 0.1}s`,
								}}
							>
								<div className="glass-panel rounded-3xl border border-white/8 p-7 md:p-8 transition-all duration-300 hover:-translate-y-1 hover:border-white/20">
									<p className="text-xs font-mono text-rose mb-5">{num}</p>
									<h2 className="text-3xl md:text-4xl font-serif mb-3 tracking-tight">
										{project.title}
									</h2>
									<p className="text-[10px] uppercase tracking-[0.28em] font-mono text-muted-foreground mb-5">
										{project.year} · {project.category}
									</p>
									<p className="text-muted-foreground font-light leading-relaxed mb-7">
										{project.tagline}
									</p>

									<Link
										to={`/projects/${project.slug}`}
										className="inline-flex items-center gap-2 text-sm font-semibold text-foreground hover:text-rose transition-colors"
									>
										View Case Study <span aria-hidden>→</span>
									</Link>
								</div>
							</article>
						);
					})}
				</section>
			</div>
		</main>
	);
}
