import { useEffect, useState } from "react";
import {
	motion,
	useScroll,
	useMotionValueEvent,
	AnimatePresence,
} from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";

const linkClass =
	"px-4 py-1.5 text-sm font-medium text-muted-foreground hover:text-rose hover:bg-rose/5 rounded-full transition-all duration-200";

export function Navbar() {
	const location = useLocation();
	const navigate = useNavigate();
	const isHome = location.pathname === "/";
	const { scrollY } = useScroll();
	const [visible, setVisible] = useState(false);
	const [scrolled, setScrolled] = useState(false);

	useEffect(() => {
		if (!isHome) {
			setVisible(true);
			setScrolled(true);
			return;
		}

		const threshold = window.innerHeight;
		const latest = scrollY.get();
		setVisible(latest > threshold);
		setScrolled(latest > threshold + 50);
	}, [isHome, scrollY]);

	useMotionValueEvent(scrollY, "change", (latest) => {
		if (!isHome) return;
		const threshold = window.innerHeight;
		setVisible(latest > threshold);
		setScrolled(latest > threshold + 50);
	});

	const scrollTo = (id: string) => {
		document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
	};

	return (
		<AnimatePresence>
			{visible && (
				<motion.nav
					key="navbar"
					initial={{ y: -20, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					exit={{ y: -20, opacity: 0 }}
					transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
					className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
						scrolled ? "py-3" : "py-5"
					}`}
				>
					<div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
						<div
							className="w-9 h-9 rounded-lg bg-foreground text-background flex items-center justify-center font-sans font-bold text-xs cursor-pointer select-none tracking-tight"
							onClick={() => (isHome ? scrollTo("hero") : navigate("/"))}
						>
							NR
						</div>

						<div className="flex items-center gap-1 rounded-full px-2 py-1.5 glass-panel">
							{isHome ? (
								<>
									{[
										{ label: "Home", id: "hero" },
										{ label: "About", id: "about" },
										{ label: "Work", id: "work" },
									].map((link) => (
										<button
											key={link.id}
											onClick={() => scrollTo(link.id)}
											className={linkClass}
										>
											{link.label}
										</button>
									))}
									<Link to="/blog" className={linkClass}>
										Blog
									</Link>
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
									<Link to="/blog" className={linkClass}>
										Blog
									</Link>
								</>
							)}
						</div>

						{isHome ? (
							<button
								onClick={() => scrollTo("contact")}
								className="hidden md:flex items-center gap-2 px-5 py-2 rounded-full bg-green text-[#0d0d0d] text-sm font-medium hover:bg-green/85 transition-colors duration-200"
							>
								Book a Call
							</button>
						) : (
							<Link
								to="/#contact"
								className="hidden md:flex items-center gap-2 px-5 py-2 rounded-full bg-green text-[#0d0d0d] text-sm font-medium hover:bg-green/85 transition-colors duration-200"
							>
								Book a Call
							</Link>
						)}
					</div>
				</motion.nav>
			)}
		</AnimatePresence>
	);
}
