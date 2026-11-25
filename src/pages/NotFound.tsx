import { Sky } from "../components/layouts/Sky";
import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { PROFILE } from "../data/profile";
import { getShowcaseProjects } from "../data/projects";
import { setDocumentMeta } from "../lib/documentMeta";

export default function NotFound() {
	const { pathname } = useLocation();

	useEffect(() => {
		setDocumentMeta({
			title: `Page not found — ${PROFILE.name}`,
			path: pathname,
			noindex: true,
		});
	}, [pathname]);

	return (
		<>
		<Sky mode={{ kind: "lost" }} />
		<main id="main-content" tabIndex={-1} className="min-h-screen flex items-center justify-center px-6 py-[88px] text-foreground focus:outline-none">
			<div className="max-w-xl text-center">
				<p className="section-label">Page not found</p>
				<h1 data-route-heading tabIndex={-1} className="mb-4 font-serif text-6xl font-normal focus:outline-none md:text-7xl">
					Lost in space
				</h1>
				<p className="mb-12 text-lg text-muted-foreground">This page drifted out of orbit. The rest of the sky is still here.</p>
				<div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
					<Link to="/#universe" className="btn-primary">
						Back to the star map
					</Link>
					<Link to="/" className="btn-secondary">
						Back home
					</Link>
				</div>
				<ul className="mt-12 flex flex-wrap justify-center gap-x-6" aria-label="Case studies">
					{getShowcaseProjects().map((project) => (
						<li key={project.slug}>
							<Link to={`/projects/${project.slug}`} className="text-link">
								{project.title} <span aria-hidden="true">→</span>
							</Link>
						</li>
					))}
				</ul>
			</div>
		</main>
		</>
	);
}
