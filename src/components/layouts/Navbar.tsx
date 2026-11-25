import { Link, useLocation, useNavigate } from "react-router-dom";
import { PROFILE } from "../../data/profile";

const linkClass =
	"min-h-[44px] items-center px-2 sm:px-3 md:px-4 text-xs sm:text-sm font-medium text-muted-foreground hover:text-rose hover:bg-rose/5 rounded-full transition-all duration-200 whitespace-nowrap";

// Always visible on every page: Resume and Contact are one click away from the first
// screen, and case studies get their way back to the work here instead of a floating link.
export function Navbar() {
	const location = useLocation();
	const navigate = useNavigate();
	const isHome = location.pathname === "/";

	const scrollTo = (id: string) => {
		const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
		document
			.getElementById(id)
			?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
	};

	return (
		<nav
			aria-label="Primary"
			className="fixed top-0 left-0 right-0 z-40 py-3 bg-[#0d0d0d]/90 backdrop-blur-md border-b border-white/[0.06]"
		>
		<div className="max-w-7xl mx-auto px-4 md:px-12 flex items-center justify-between gap-3">
				<button
					type="button"
					className="w-11 h-11 rounded-lg bg-foreground text-background flex items-center justify-center font-sans font-bold text-xs cursor-pointer select-none tracking-tight shrink-0"
					onClick={() => (isHome ? scrollTo("landing") : navigate("/"))}
					aria-label={isHome ? "Scroll to top" : "Go to homepage"}
				>
					NR
				</button>

				<div className="flex items-center gap-1 rounded-full px-1.5 sm:px-2 py-0.5 glass-panel overflow-x-auto max-w-[calc(100vw-5.75rem)] md:max-w-none">
					{isHome ? (
						<>
							<button onClick={() => scrollTo("work")} className={`${linkClass} inline-flex`}>
								Work
							</button>
							<button onClick={() => scrollTo("about")} className={`${linkClass} hidden sm:inline-flex`}>
								About
							</button>
							<a href={PROFILE.resumePath} download className={`${linkClass} inline-flex`}>
								Resume
							</a>
							<a
								href={PROFILE.github}
								target="_blank"
								rel="noopener noreferrer"
								className={`${linkClass} hidden md:inline-flex`}
							>
								GitHub
							</a>
							{/* The Contact pill is desktop-only, so phones get it here. */}
							<button
								onClick={() => scrollTo("contact")}
								className={`${linkClass} inline-flex md:hidden`}
							>
								Contact
							</button>
						</>
					) : (
						<>
							<Link to="/projects" className={`${linkClass} inline-flex`}>
								Work
							</Link>
							<Link to="/#about" className={`${linkClass} hidden sm:inline-flex`}>
								About
							</Link>
							<a href={PROFILE.resumePath} download className={`${linkClass} inline-flex`}>
								Resume
							</a>
							<a
								href={PROFILE.github}
								target="_blank"
								rel="noopener noreferrer"
								className={`${linkClass} hidden md:inline-flex`}
							>
								GitHub
							</a>
							<Link to="/#contact" className={`${linkClass} inline-flex md:hidden`}>
								Contact
							</Link>
						</>
					)}
				</div>

				{isHome ? (
					<button
						onClick={() => scrollTo("contact")}
						className="hidden md:flex min-h-[44px] items-center gap-2 px-5 rounded-full bg-action text-[#0d0d0d] text-sm font-medium hover:bg-action/85 transition-colors duration-200"
					>
						Contact
					</button>
				) : (
					<Link
						to="/#contact"
						className="hidden md:flex min-h-[44px] items-center gap-2 px-5 rounded-full bg-action text-[#0d0d0d] text-sm font-medium hover:bg-action/85 transition-colors duration-200"
					>
						Contact
					</Link>
				)}
			</div>
		</nav>
	);
}
