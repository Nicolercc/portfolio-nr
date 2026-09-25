import { useEffect, useState } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { PROFILE } from "../../data/profile";

const linkClass =
	"px-2 sm:px-3 md:px-4 py-1.5 text-xs sm:text-sm font-medium text-muted-foreground hover:text-rose hover:bg-rose/5 rounded-full transition-all duration-200 whitespace-nowrap";

export function Navbar() {
	const location = useLocation();
	const navigate = useNavigate();
	const isHome = location.pathname === "/";
	const { scrollY } = useScroll();
	const [homeScrolled, setHomeScrolled] = useState(false);
	const scrolled = isHome ? homeScrolled : true;

	useEffect(() => {
		if (!isHome) return;

		const frame = requestAnimationFrame(() => {
			const threshold = window.innerHeight * 0.45;
			const latest = scrollY.get();
			setHomeScrolled(latest > threshold);
		});

		return () => cancelAnimationFrame(frame);
	}, [isHome, scrollY]);

	useMotionValueEvent(scrollY, "change", (latest) => {
		if (!isHome) return;
		const threshold = window.innerHeight * 0.45;
		setHomeScrolled(latest > threshold);
	});

	const scrollTo = (id: string) => {
		const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
		document
			.getElementById(id)
			?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
	};

	return (
		<motion.nav
			key="navbar"
			initial={false}
			animate={scrolled ? { y: 0, opacity: 1 } : { y: -16, opacity: 0 }}
			transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
			aria-hidden={isHome && !scrolled}
			className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
				scrolled
					? "visible pointer-events-auto py-3"
					: "invisible pointer-events-none py-5"
			}`}
		>
			<div className="max-w-7xl mx-auto px-4 md:px-12 flex items-center justify-between gap-3">
				<button
					type="button"
					className="w-9 h-9 rounded-lg bg-foreground text-background flex items-center justify-center font-sans font-bold text-xs cursor-pointer select-none tracking-tight shrink-0"
					onClick={() => (isHome ? scrollTo("landing") : navigate("/"))}
					aria-label={isHome ? "Scroll to top" : "Go to homepage"}
				>
					NR
				</button>

				<div className="flex items-center gap-1 rounded-full px-1.5 sm:px-2 py-1.5 glass-panel overflow-x-auto max-w-[calc(100vw-5.75rem)] md:max-w-none">
					{isHome ? (
						<>
							<button onClick={() => scrollTo("work")} className={linkClass}>
								Work
							</button>
							<button onClick={() => scrollTo("about")} className={linkClass}>
								About
							</button>
							<a href={PROFILE.resumePath} download className={linkClass}>
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
								className={`${linkClass} md:hidden`}
							>
								Contact
							</button>
						</>
					) : (
						<>
							<Link to="/" className={linkClass}>
								Home
							</Link>
							<Link to="/projects" className={linkClass}>
								Work
							</Link>
							<Link to="/#about" className={linkClass}>
								About
							</Link>
							<a href={PROFILE.resumePath} download className={linkClass}>
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
							<Link to="/#contact" className={`${linkClass} md:hidden`}>
								Contact
							</Link>
						</>
					)}
				</div>

				{isHome ? (
					<button
						onClick={() => scrollTo("contact")}
						className="hidden md:flex items-center gap-2 px-5 py-2 rounded-full bg-green text-[#0d0d0d] text-sm font-medium hover:bg-green/85 transition-colors duration-200"
					>
						Contact
					</button>
				) : (
					<Link
						to="/#contact"
						className="hidden md:flex items-center gap-2 px-5 py-2 rounded-full bg-green text-[#0d0d0d] text-sm font-medium hover:bg-green/85 transition-colors duration-200"
					>
						Contact
					</Link>
				)}
			</div>
		</motion.nav>
	);
}
