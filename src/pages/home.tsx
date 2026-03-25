import { useEffect } from "react";
import { Navbar } from "../components/layouts/Navbar";
import { Hero } from "../components/sections/Hero";

export default function Home() {
	// Senior Move: Smooth scroll behavior globally
	useEffect(() => {
		document.documentElement.style.scrollBehavior = "smooth";
		return () => {
			document.documentElement.style.scrollBehavior = "auto";
		};
	}, []);

	return (
		<div className="relative bg-background min-h-screen text-foreground selection:bg-burgundy/30">
			{/* The "Grainy" Overlay - adds that high-end editorial texture */}
			<div className="bg-noise" />

			<Navbar />

			<main>
				<Hero />
				{/* We will add Projects, Bento, and Contact next */}
			</main>
		</div>
	);
}
