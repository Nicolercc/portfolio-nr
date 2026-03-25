import { Navbar } from "../components/layouts/Navbar";
import { useEffect } from "react";
import Landing from "../components/sections/landing";
import { Hero } from "../components/sections/Hero";
import { Projects } from "../components/sections/projects";
import { Bento } from "../components/sections/bento";
import { Contact } from "../components/sections/contact";
import { Marquee } from "../components/sections/Marquee";
import { CustomCursor } from "../components/ui/CustomCursor";
import { GlobalCanvas } from "../components/layouts/GlobalCanvas";

export default function Home() {
	useEffect(() => {
		document.documentElement.style.scrollBehavior = "smooth";
		return () => {
			document.documentElement.style.scrollBehavior = "auto";
		};
	}, []);

	return (
		<div className="relative min-h-screen text-foreground selection:bg-rose/30">
			<GlobalCanvas />
			{/* The Grainy Overlay */}
			<div className="fixed inset-0 z-50 pointer-events-none opacity-[0.03] bg-noise" />

			<div className="hidden md:block">
				<CustomCursor />
			</div>

			{/* Navbar is hidden on landing, appears sticky after scroll */}
			<Navbar />

			<main>
				<Landing />
				<section id="hero">
					<Hero />
				</section>
				<Bento />
				<Projects />
				<Marquee />
				<Contact />
			</main>
		</div>
	);
}
