import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { PROFILE } from "../../data/profile";
import { getReducedMotion } from "../../lib/motionPreference";
import { MotionToggle } from "../ui/MotionToggle";

const linkClass =
	"min-h-[44px] items-center px-2 sm:px-3 md:px-4 text-xs sm:text-sm font-medium text-muted-foreground hover:text-rose hover:bg-rose/5 rounded-full transition-all duration-150 whitespace-nowrap";

// Always visible on every page: Resume and Contact are one click away from the first
// screen, and case studies get their way back to the work here instead of a floating link.
export function Navbar() {
	const location = useLocation();
	const navigate = useNavigate();
	const isHome = location.pathname === "/";
	// Transparent over the sky at the top; a thin translucent bar once the page scrolls.
	const [scrolled, setScrolled] = useState(false);
	useEffect(() => {
		const update = () => setScrolled(window.scrollY > 64);
		update();
		window.addEventListener("scroll", update, { passive: true });
		return () => window.removeEventListener("scroll", update);
	}, []);

	const scrollTo = (id: string) => {
		const reduceMotion = getReducedMotion();
		document
			.getElementById(id)
			?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
	};

	return (
		<nav
			aria-label="Primary"
			data-scrolled={scrolled}
			className={`fixed top-0 left-0 right-0 z-40 border-b transition-colors duration-300 ${scrolled ? "py-2 bg-background/70 backdrop-blur-md border-white/[0.06]" : "py-3 bg-transparent border-transparent"}`}
		>
		<div className="max-w-7xl mx-auto px-4 md:px-12 flex items-center justify-between gap-3">
				<button
					type="button"
					className="w-11 h-11 rounded-md bg-foreground text-background flex items-center justify-center font-sans font-bold text-xs cursor-pointer select-none shrink-0"
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
							<a href={PROFILE.resumePath} download className={`${linkClass} inline-flex max-[389px]:hidden`}>
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
							<a href={PROFILE.resumePath} download className={`${linkClass} inline-flex max-[389px]:hidden`}>
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

				<div className="ml-auto flex items-center gap-3 md:ml-0">
				<MotionToggle compact />
				{isHome ? (
					<button
						onClick={() => scrollTo("contact")}
						className="btn-primary hidden md:inline-flex"
					>
						Contact
					</button>
				) : (
					<Link
						to="/#contact"
						className="btn-primary hidden md:inline-flex"
					>
						Contact
					</Link>
				)}
				</div>
			</div>
		</nav>
	);
}
