import { useEffect } from "react";
import { motion, useSpring } from "framer-motion";

export function CustomCursor() {
	const mouseX = useSpring(0, { damping: 20, stiffness: 100 });
	const mouseY = useSpring(0, { damping: 20, stiffness: 100 });

	useEffect(() => {
		const handleMouseMove = (e: MouseEvent) => {
			mouseX.set(e.clientX - 16);
			mouseY.set(e.clientY - 16);
		};

		window.addEventListener("mousemove", handleMouseMove);
		return () => window.removeEventListener("mousemove", handleMouseMove);
	}, [mouseX, mouseY]);

	return (
		<motion.div
			className="fixed top-0 left-0 w-8 h-8 rounded-full pointer-events-none z-[9999] border border-rose/70 shadow-[0_0_16px_rgba(74,222,128,0.4),0_0_4px_rgba(212,132,154,0.35)]"
			style={{
				x: mouseX,
				y: mouseY,
			}}
		>
			<div className="absolute inset-0 rounded-full bg-green/15 blur-sm" />
		</motion.div>
	);
}
