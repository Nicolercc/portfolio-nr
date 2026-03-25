import { useState } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";

export function Navbar() {
	const { scrollY } = useScroll();
	const [scrolled, setScrolled] = useState(false);

	// Shrink navbar on scroll for that premium feel
	useMotionValueEvent(scrollY, "change", (latest) => {
		setScrolled(latest > 50);
	});

	return (
		<motion.nav
			initial={{ y: -100, opacity: 0 }}
			animate={{ y: 0, opacity: 1 }}
			className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
				scrolled
					? "py-4 bg-background/80 backdrop-blur-md border-b border-white/5"
					: "py-8 bg-transparent"
			}`}
		>
			<div className="max-w-7xl mx-auto px-8 flex items-center justify-between">
				<div className="text-xl font-serif font-bold tracking-tighter">NR</div>

				<div className="flex items-center gap-8 text-sm uppercase tracking-widest text-muted-foreground font-medium">
					<a href="#work" className="hover:text-burgundy transition-colors">
						Work
					</a>
					<a href="#about" className="hover:text-forest transition-colors">
						About
					</a>
					<a
						href="#contact"
						className="px-5 py-2 bg-foreground text-background rounded-full hover:bg-white/90 transition-all"
					>
						Contact
					</a>
				</div>
			</div>
		</motion.nav>
	);
}
