import { Navbar } from "../components/layouts/Navbar";
import { useEffect } from "react";
import { Hero } from "../components/sections/Hero";
import { Projects } from "../components/sections/projects";
import { Bento } from "../components/sections/bento";
import { Contact } from "../components/sections/contact";
import { Marquee } from "../components/sections/Marquee";
import { CustomCursor } from "../components/ui/CustomCursor";

export default function Home() {
	useEffect(() => {
		document.documentElement.style.scrollBehavior = "smooth";
		return () => {
			document.documentElement.style.scrollBehavior = "auto";
		};
	}, []);

	return (
		<div className="relative bg-background min-h-screen text-foreground selection:bg-burgundy/30">
			{/* The Grainy Overlay */}
			<div className="fixed inset-0 z-50 pointer-events-none opacity-[0.03] bg-noise" />

			<div className="hidden md:block">
				<CustomCursor />
			</div>

			<Navbar />

			<main>
				<Hero />
				<Projects />
				<Bento />
				<Marquee />
				<Contact />
			</main>
		</div>
	);
}
