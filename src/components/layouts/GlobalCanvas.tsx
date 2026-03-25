import { motion, useScroll, useTransform } from "framer-motion";

export function GlobalCanvas() {
	const { scrollY } = useScroll();

	// High-end interaction: The grid is 100% visible at the top
	// and fades to 30% as the user scrolls 500px down.
	const gridOpacity = useTransform(scrollY, [0, 500], [1, 0.3]);

	// Subtle parallax: The background moves slower than the scroll
	const backgroundY = useTransform(scrollY, [0, 1000], [0, 100]);

	return (
		<div className="fixed inset-0 pointer-events-none -z-50 bg-[#0D0D0D] overflow-hidden">
			{/* 1. THE GRID (Your favorite element) */}
			<motion.div
				style={{
					opacity: gridOpacity,
					backgroundImage: `
            linear-gradient(rgba(245, 240, 232, 0.022) 1px, transparent 1px),
            linear-gradient(90deg, rgba(245, 240, 232, 0.022) 1px, transparent 1px)
          `,
					backgroundSize: "48px 48px",
					WebkitMaskImage:
						"radial-gradient(ellipse 80% 60% at 50% 50%, black 25%, transparent 100%)",
					maskImage:
						"radial-gradient(ellipse 80% 60% at 50% 50%, black 25%, transparent 100%)",
				}}
				className="absolute inset-0"
			/>

			{/* 2. AMBIENT GLOWS (Rose & Green) */}
			<motion.div style={{ y: backgroundY }} className="absolute inset-0">
				{/* Top Left Rose Glow */}
				<div
					className="absolute top-[-10%] left-[-10%] w-[70vw] h-[70vw] rounded-full opacity-[0.10] blur-[120px]"
					style={{
						background: "radial-gradient(circle, #D4849A 0%, transparent 80%)",
					}}
				/>

				{/* Bottom Right Green Glow */}
				<div
					className="absolute bottom-[-5%] right-[-10%] w-[60vw] h-[60vw] rounded-full opacity-[0.07] blur-[100px]"
					style={{
						background: "radial-gradient(circle, #4ADE80 0%, transparent 70%)",
					}}
				/>
			</motion.div>

			{/* 3. NOISE TEXTURE (The "Film Grain" look) */}
			<div className="absolute inset-0 opacity-[0.015] mix-blend-overlay pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
		</div>
	);
}
