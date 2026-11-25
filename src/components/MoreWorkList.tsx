import { Link } from "react-router-dom";
import { getMoreWorkProjects } from "../data/projects";
import { getStarColor, starCss } from "../data/starSystems";
import { ProjectStatusPill } from "./ProjectStatusPill";

const projects = getMoreWorkProjects();
const linkClass = "inline-flex min-h-11 items-center gap-2 text-caption font-semibold text-rose hover:underline";

export function MoreWorkList({ compact = false }: { compact?: boolean }) {
	return (
		<section aria-labelledby="more-work-heading" className="mt-12">
			<h2 id="more-work-heading" className="mb-4 font-serif text-3xl">More work</h2>
			<ul className={`grid gap-x-10 ${compact ? "lg:grid-cols-2" : ""}`}>
				{projects.map((project) => {
					const color = project.onMap ? getStarColor(project.slug) : undefined;
					const live = project.kind === "case-study" ? project.links.live : undefined;
					const github = project.kind === "case-study" ? project.links.github : undefined;
					return (
						<li key={project.slug} className="border-t border-white/10 py-4">
							<div className="mb-1 flex flex-wrap items-center gap-x-3 gap-y-1">
								<span aria-hidden="true" className="h-2 w-2 rounded-full bg-muted-foreground" style={color ? { backgroundColor: starCss(color) } : undefined} />
								<h3 className="font-serif text-lead">{project.title}</h3>
								<ProjectStatusPill status={project.status} />
							</div>
							<p className="text-body text-muted-foreground">{project.oneLine}</p>
							<div className="flex flex-wrap gap-x-5">
								{project.onMap ? (
									<Link to={project.kind === "brief" ? `/projects/${project.slug}` : project.links.caseStudy ?? `/projects/${project.slug}`} className={linkClass}>
										{project.kind === "brief" ? "Project brief" : "Case study"}
										<span className="sr-only"> for {project.title}</span>
										<span aria-hidden="true">→</span>
									</Link>
								) : null}
								{live && (!compact || !project.onMap) ? (
									<a href={live} className={linkClass}>
										{project.status === "prototype" ? "Live demo" : "Live site"}
										<span className="sr-only"> for {project.title}</span>
										<span aria-hidden="true">↗</span>
									</a>
								) : null}
								{github && !compact ? (
									<a href={github} className={linkClass}>
										GitHub<span className="sr-only"> for {project.title}</span>
										<span aria-hidden="true">↗</span>
									</a>
								) : null}
							</div>
						</li>
					);
				})}
			</ul>
		</section>
	);
}
