import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { PROFILE } from "../data/profile";
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
		<main id="main-content" tabIndex={-1} className="min-h-screen flex items-center justify-center bg-[#0d0d0d] text-white focus:outline-none">
			<div className="text-center space-y-4">
				<h1 data-route-heading tabIndex={-1} className="text-8xl font-serif opacity-40 focus:outline-none">404</h1>
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
		</main>
	);
}
