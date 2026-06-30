import { Link } from "react-router-dom";

export default function NotFound() {
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
