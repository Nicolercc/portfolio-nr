import { useEffect, useState } from "react";
import {
	motion,
	useScroll,
	useMotionValueEvent,
	AnimatePresence,
} from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";

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
		const threshold = window.innerHeight; // exactly one full landing height
		setVisible(latest > threshold);
		setScrolled(latest > threshold + 50); // slight extra scroll = condensed state
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
						{/* Logo */}
						<div
							className="w-9 h-9 rounded-lg bg-foreground text-background flex items-center justify-center font-sans font-bold text-xs cursor-pointer select-none tracking-tight"
							onClick={() => (isHome ? scrollTo("hero") : navigate("/"))}
						>
							NR
						</div>

						{/* Links */}
						<div className="flex items-center gap-1 rounded-full px-2 py-1.5 glass-panel">
							{isHome ? (
								[
									{ label: "Home", id: "hero" },
									{ label: "About", id: "about" },
									{ label: "Work", id: "work" },
									{ label: "Blog", id: "blog" },
								].map((link) => (
									<button
										key={link.id}
										onClick={() => scrollTo(link.id)}
										className="px-4 py-1.5 text-sm font-medium text-muted-foreground hover:text-rose hover:bg-rose/5 rounded-full transition-all duration-200"
									>
										{link.label}
									</button>
								))
							) : (
								<>
									<Link
										to="/"
										className="px-4 py-1.5 text-sm font-medium text-muted-foreground hover:text-rose hover:bg-rose/5 rounded-full transition-all duration-200"
									>
										Home
									</Link>
									<Link
										to="/projects"
										className="px-4 py-1.5 text-sm font-medium text-muted-foreground hover:text-rose hover:bg-rose/5 rounded-full transition-all duration-200"
									>
										Work
									</Link>
									<Link
										to="/"
										className="px-4 py-1.5 text-sm font-medium text-muted-foreground hover:text-rose hover:bg-rose/5 rounded-full transition-all duration-200"
									>
										About
									</Link>
									<Link
										to="/"
										className="px-4 py-1.5 text-sm font-medium text-muted-foreground hover:text-rose hover:bg-rose/5 rounded-full transition-all duration-200"
									>
										Blog
									</Link>
								</>
							)}
						</div>

						{/* CTA — primary action */}
						<button
							onClick={() => scrollTo("contact")}
							className="hidden md:flex items-center gap-2 px-5 py-2 rounded-full bg-green text-[#0d0d0d] text-sm font-medium hover:bg-green/85 transition-colors duration-200"
						>
							Book a Call
						</button>
					</div>
				</motion.nav>
			)}
		</AnimatePresence>
	);
}
