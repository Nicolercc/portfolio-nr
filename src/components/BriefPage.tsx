import { Sky } from "./layouts/Sky";
import { starTint } from "../data/starSystems";
import { Link } from "react-router-dom";
import type { BriefProject } from "../data/projects";
import { RECEIPTS } from "../data/proofs";
import { BriefArtifactCard } from "./BriefArtifactCard";
import { ProjectReceipt } from "./ProjectReceipt";
import { ProjectStatusPill } from "./ProjectStatusPill";

export function BriefPage({ project }: { project: BriefProject }) {
	const receipt = RECEIPTS.find(({ id }) => id === project.receiptId);
	const linkClass = "inline-flex min-h-11 items-center font-semibold text-rose hover:underline";

	return (
		<>
		<Sky mode={{ kind: "record", tint: starTint(project.slug) }} />
		<main id="main-content" tabIndex={-1} className="mx-auto min-h-screen max-w-6xl px-6 pb-16 pt-28 md:px-12">
			<Link to="/projects" className={linkClass}>← Projects</Link>
			<header className="mb-8 mt-5">
				<ProjectStatusPill status={project.status} />
				<h1 data-route-heading tabIndex={-1} className="mt-3 font-serif text-5xl md:text-7xl">{project.title}</h1>
				<p className="mt-2 font-mono text-caption text-muted-foreground">{project.role}</p>
			</header>
			<div className="grid gap-8 md:grid-cols-2">
				<div>
					<p className="text-body leading-relaxed">{project.brief}</p>
					<a href={project.outbound.href} className={`mt-4 ${linkClass}`}>
						{project.outbound.label} <span aria-hidden="true" className="ml-2">→</span>
					</a>
				</div>
				<div className="min-w-0 space-y-5">
					<BriefArtifactCard artifact={project.artifact} />
					<dl className="grid grid-cols-1 gap-4 sm:grid-cols-3">
						{project.facts.map(({ label, value }) => (
							<div key={label} className="flex flex-col-reverse justify-end border-t border-white/10 pt-2">
								<dt className="text-caption text-muted-foreground">{label}</dt>
								<dd className="font-mono text-lead">{value}</dd>
							</div>
						))}
					</dl>
					{receipt ? <ProjectReceipt receipt={receipt} /> : null}
				</div>
			</div>
		</main>
		</>
	);
}
