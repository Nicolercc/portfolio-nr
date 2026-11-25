import { Sky } from "../components/layouts/Sky";
import { useEffect } from "react";
import { ArrowUpRight } from "lucide-react";
import { MoreWorkList } from "../components/MoreWorkList";
import { CaseStudyRow } from "../components/sections/projects";
import { OPEN_SOURCE_CONTRIBUTIONS } from "../data/openSource";
import { getShowcaseProjects } from "../data/projects";
import { PROFILE } from "../data/profile";
import { setDocumentMeta } from "../lib/documentMeta";

const projects = getShowcaseProjects();

export default function ProjectsIndex() {
	useEffect(() => {
		setDocumentMeta({
			title: `Projects — ${PROFILE.name}`,
			description:
				"Selected UX, accessibility, and frontend case studies by Nicole Rodriguez: interaction decisions taken from design through implementation and validation.",
			path: "/projects",
			structuredData: {
				"@context": "https://schema.org",
				"@type": "CollectionPage",
				name: `Projects — ${PROFILE.name}`,
				url: `${PROFILE.website}/projects`,
				description:
					"Selected UX, accessibility, and frontend case studies by Nicole Rodriguez: interaction decisions taken from design through implementation and validation.",
				hasPart: projects.map((project) => ({
					"@type": "CreativeWork",
					name: project.title,
					url: `${PROFILE.website}/projects/${project.slug}`,
				})),
			},
		});
	}, []);

	return (
		<>
		<Sky mode={{ kind: "record" }} />
		<main id="main-content" tabIndex={-1} className="min-h-screen text-foreground [overflow-wrap:anywhere] px-6 md:px-12 pt-28 pb-16 md:pt-32 md:pb-20 focus:outline-none">
			<div className="max-w-7xl mx-auto">
				<header className="mb-14 md:mb-16">
					<p className="section-label">Work</p>
					<h1
						data-route-heading
						tabIndex={-1}
						className="text-5xl md:text-8xl font-serif font-normal tracking-tight leading-[0.9] focus:outline-none"
					>
						Selected Projects
					</h1>
					<p className="mt-5 max-w-2xl text-muted-foreground leading-relaxed">
						Case studies in accessible, trustworthy interfaces: the UX decision,
						how I built it, and the evidence that it works.
					</p>
				</header>

				<section aria-label="Case studies" className="divide-y divide-white/10">
					{projects.map((project) => (
						<CaseStudyRow key={project.slug} project={project} headingLevel="h2" />
					))}
				</section>

				<MoreWorkList />

				{OPEN_SOURCE_CONTRIBUTIONS.length > 0 && (
					<section aria-labelledby="open-source-heading" className="mt-20 md:mt-24">
						<p className="section-label">Open source</p>
						<h2
							id="open-source-heading"
							className="text-3xl md:text-5xl font-serif tracking-tight mb-8"
						>
							Open Source
						</h2>
						<ul className="space-y-4">
							{OPEN_SOURCE_CONTRIBUTIONS.map((contribution) => (
								<li
									key={contribution.url}
									className="glass-panel rounded-2xl border border-white/8 p-6 md:p-7 flex flex-col md:flex-row md:items-center gap-4 md:gap-8"
								>
									<div className="min-w-0 flex-1">
										<div className="flex flex-wrap items-center gap-3 mb-2">
											<h3 className="text-xl md:text-2xl font-serif tracking-tight">
												{contribution.repository}
											</h3>
											<span
												className={`rounded-full border px-3 py-1 font-mono text-caption ${ contribution.status === "Merged" ? "border-green/40 text-green" : "border-white/20 text-white/75" }`}
											>
												{contribution.status}
											</span>
										</div>
										<p className="text-muted-foreground leading-relaxed">
											{contribution.summary}
										</p>
									</div>
									<a
										href={contribution.url}
										target="_blank"
										rel="noreferrer"
										className="group inline-flex shrink-0 items-center gap-2 min-h-11 text-sm font-semibold text-foreground hover:text-rose transition-colors"
									>
										{contribution.label}
										<span className="sr-only"> (opens in a new tab)</span>
										<ArrowUpRight
											size={14}
											aria-hidden
											className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
										/>
									</a>
								</li>
							))}
						</ul>
					</section>
				)}
			</div>
		</main>
		</>
	);
}
