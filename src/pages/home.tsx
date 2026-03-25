import { Navbar } from "../components/layouts/Navbar";
import { useEffect } from "react";
import Landing from "../components/sections/landing";
import { Hero } from "../components/sections/Hero";
import { Projects } from "../components/sections/projects";
import { Bento } from "../components/sections/bento";
import { Experience } from "../components/sections/experience";
import { Contact } from "../components/sections/contact";
import { Marquee } from "../components/sections/Marquee";
import { CustomCursor } from "../components/ui/CustomCursor";
import { GlobalCanvas } from "../components/layouts/GlobalCanvas";

export default function Home() {
	useEffect(() => {
		// High-end smooth scroll management
		document.documentElement.style.scrollBehavior = "smooth";
		return () => {
			document.documentElement.style.scrollBehavior = "auto";
		};
	}, []);

	return (
		/* Removing 'text-foreground' here because we want 
           our custom #F5F0E8 (Off-white) to take the lead 
        */
		<div className="relative min-h-screen selection:bg-rose/30">
			{/* 1. THE FOUNDATION: Handles Gradients, Grid, and Noise */}
			<GlobalCanvas />

			{/* 2. THE INTERACTION: Only for desktop users */}
			<div className="hidden md:block">
				<CustomCursor />
			</div>

			{/* 3. THE NAVIGATION */}
			<Navbar />

			{/* 4. THE CONTENT: Ensure 'relative z-10' so it sits on top of the canvas */}
			<main className="relative z-10">
				<Landing />
				<section id="hero">
					<Hero />
				</section>
				<Bento />
				<Projects />
				<Experience />
				<Marquee />
				<Contact />
			</main>
		</div>
	);
}
