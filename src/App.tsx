import { lazy, Suspense } from "react";
import { Link, Route, Routes } from "react-router-dom";
import Home from "./pages/home";

// We only need the CaseStudy (the design you like)
const ProjectsIndex = lazy(() => import("./pages/ProjectsIndex"));
const CaseStudy = lazy(() => import("./pages/CaseStudy"));

function NotFound() {
	return (
		<div className="min-h-screen flex items-center justify-center bg-[#0d0d0d] text-white">
			<div className="text-center space-y-4">
				<h1 className="text-8xl font-serif opacity-20">404</h1>
				<p className="text-xl font-light tracking-widest uppercase">
					Page not found
				</p>
				<Link
					to="/"
					className="inline-block mt-4 border-b border-white/20 pb-1 hover:border-white transition-all"
				>
					Return Home
				</Link>
			</div>
		</div>
	);
}

export default function App() {
	return (
		<Suspense fallback={<div className="bg-[#0d0d0d] min-h-screen" />}>
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/projects" element={<ProjectsIndex />} />

				<Route path="/projects/:slug" element={<CaseStudy />} />
				{/* Legacy URL; same case study as /projects/:slug */}
				<Route path="/work/:slug" element={<CaseStudy />} />

				<Route path="*" element={<NotFound />} />
			</Routes>
		</Suspense>
	);
}
