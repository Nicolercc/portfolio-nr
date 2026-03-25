// import { useState } from "react";
// import { motion, useScroll, useMotionValueEvent } from "framer-motion";

// export function Navbar() {
// 	const { scrollY } = useScroll();
// 	const [scrolled, setScrolled] = useState(false);

// 	// Shrink navbar on scroll for that premium feel
// 	useMotionValueEvent(scrollY, "change", (latest) => {
// 		setScrolled(latest > 50);
// 	});

// 	return (
// 		<motion.nav
// 			initial={{ y: -100, opacity: 0 }}
// 			animate={{ y: 0, opacity: 1 }}
// 			className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
// 				scrolled
// 					? "py-4 bg-background/80 backdrop-blur-md border-b border-white/5"
// 					: "py-8 bg-transparent"
// 			}`}
// 		>
// 			<div className="max-w-7xl mx-auto px-8 flex items-center justify-between">
// 				<div className="text-xl font-serif font-bold tracking-tighter">NR</div>

// 				<div className="flex items-center gap-8 text-sm uppercase tracking-widest text-muted-foreground font-medium">
// 					<a href="#work" className="hover:text-burgundy transition-colors">
// 						Work
// 					</a>
// 					<a href="#about" className="hover:text-forest transition-colors">
// 						About
// 					</a>
// 					<a
// 						href="#contact"
// 						className="px-5 py-2 bg-foreground text-background rounded-full hover:bg-white/90 transition-all"
// 					>
// 						Contact
// 					</a>
// 				</div>
// 			</div>
// 		</motion.nav>
// 	);
// }
import { useState } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";

export function Navbar() {
	const { scrollY } = useScroll();
	const [scrolled, setScrolled] = useState(false);

	useMotionValueEvent(scrollY, "change", (latest) => {
		setScrolled(latest > 50);
	});

	const scrollTo = (id: string) => {
		document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
	};

	return (
		<motion.nav
			className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${scrolled ? "py-3" : "py-5"}`}
			initial={{ y: -100, opacity: 0 }}
			animate={{ y: 0, opacity: 1 }}
			transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
		>
			<div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
				<div
					className="w-9 h-9 rounded-lg bg-foreground text-background flex items-center justify-center font-sans font-bold text-xs cursor-pointer select-none tracking-tight"
					onClick={() => scrollTo("top")}
				>
					NR
				</div>

				<div className="flex items-center gap-1 rounded-full px-2 py-1.5 glass-panel">
					{[
						{ label: "Home", id: "top" },
						{ label: "About", id: "about" },
						{ label: "Work", id: "work" },
						{ label: "Blog", id: "blog" },
					].map((link) => (
						<button
							key={link.id}
							onClick={() => scrollTo(link.id)}
							className="px-4 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-white/5 rounded-full transition-all duration-200"
						>
							{link.label}
						</button>
					))}
				</div>

				<button
					onClick={() => scrollTo("contact")}
					className="hidden md:flex items-center gap-2 px-5 py-2 rounded-full bg-foreground text-background text-sm font-medium hover:bg-white/90 transition-all duration-200"
				>
					Book a Call
				</button>
			</div>
		</motion.nav>
	);
}
