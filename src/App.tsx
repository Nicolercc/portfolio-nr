import { lazy, Suspense, useEffect, useRef } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Home from "./pages/home";
import NotFound from "./pages/NotFound";

const ProjectsIndex = lazy(() => import("./pages/ProjectsIndex"));
const CaseStudy = lazy(() => import("./pages/CaseStudy"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogPost = lazy(() => import("./pages/BlogPost"));

function RouteFocusManager() {
	const location = useLocation();
	const firstRender = useRef(true);

	useEffect(() => {
		if (firstRender.current) {
			firstRender.current = false;
			return;
		}

		if (location.hash) return;

		const frame = window.requestAnimationFrame(() => {
			const heading =
				document.querySelector<HTMLElement>("[data-route-heading]") ??
				document.querySelector<HTMLElement>("main h1, main h2");

			heading?.focus({ preventScroll: true });
		});

		return () => window.cancelAnimationFrame(frame);
	}, [location.pathname, location.hash]);

	return null;
}

export default function App() {
	return (
		<Suspense fallback={<div className="bg-[#0d0d0d] min-h-screen" />}>
			<RouteFocusManager />
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/projects" element={<ProjectsIndex />} />
				<Route path="/projects/:slug" element={<CaseStudy />} />
				{/* Legacy URL; same case study as /projects/:slug */}
				<Route path="/work/:slug" element={<CaseStudy />} />

				<Route path="/blog" element={<Blog />} />
				<Route path="/blog/:slug" element={<BlogPost />} />

				<Route path="*" element={<NotFound />} />
			</Routes>
		</Suspense>
	);
}
