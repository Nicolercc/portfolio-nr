import { motion, useScroll, useTransform } from "framer-motion";

export function GlobalCanvas() {
	const { scrollY } = useScroll();

	// Grid fades from 100% → 30% as user scrolls 500px (unchanged)
	const gridOpacity = useTransform(scrollY, [0, 500], [1, 0.3]);

	return (
		<div className="fixed inset-0 pointer-events-none -z-50 bg-[#0D0D0D] overflow-hidden">
			{/* 1. THE GRID — unchanged visually, opacity still responds to scroll */}
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

			{/* 2. AMBIENT GLOWS — same colors/positions, but no longer inside a
          scrolling motion.div. Removing the parallax wrapper stops Safari
          from repainting two giant blur layers on every scroll event.
          will-change + translateZ promotes each glow to its own GPU layer
          so Safari composites them once and never touches them again. */}
			<div className="absolute inset-0">
				{/* Top Left Rose Glow */}
				<div
					className="absolute top-[-10%] left-[-10%] w-[70vw] h-[70vw] rounded-full opacity-[0.10]"
					style={{
						background: "radial-gradient(circle, #D4849A 0%, transparent 80%)",
						filter: "blur(80px)",
						willChange: "transform",
						transform: "translateZ(0)",
					}}
				/>

				{/* Bottom Right Green Glow */}
				<div
					className="absolute bottom-[-5%] right-[-10%] w-[60vw] w-[60vw] h-[60vw] rounded-full opacity-[0.07]"
					style={{
						background: "radial-gradient(circle, #4ADE80 0%, transparent 70%)",
						filter: "blur(70px)",
						willChange: "transform",
						transform: "translateZ(0)",
					}}
				/>
			</div>

			{/* 3. NOISE TEXTURE — moved to a local inline SVG data URI so there's
          no cross-origin fetch on every load. mix-blend-overlay is kept.
          Visually identical to the external URL version. */}
			<div
				className="absolute inset-0 opacity-[0.015] mix-blend-overlay pointer-events-none"
				style={{
					backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
					backgroundRepeat: "repeat",
					backgroundSize: "256px 256px",
				}}
			/>
		</div>
	);
}
