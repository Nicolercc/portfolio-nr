import { motion } from "framer-motion";
import { Globe, Cpu, ShieldCheck, Zap } from "lucide-react";

// The "Tech Stack" rows for the marquee
const techRows = [
	[
		"React",
		"Next.js",
		"TypeScript",
		"Tailwind CSS",
		"Framer Motion",
		"Node.js",
		"Express.js",
	],
	["PostgreSQL", "MongoDB", "Prisma", "Python", "Firebase", "Astro", "Zustand"],
	["Vercel", "Docker", "AWS", "GitHub Actions", "Figma", "PostHog", "Bun"],
];

function TechBadge({ name }: { name: string }) {
	return (
		<span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/10 bg-white/[0.02] text-xs text-muted-foreground whitespace-nowrap hover:border-burgundy/50 hover:text-foreground transition-all duration-300">
			{name}
		</span>
	);
}

function MarqueeRow({
	items,
	reverse = false,
}: {
	items: string[];
	reverse?: boolean;
}) {
	return (
		<div className="flex overflow-hidden gap-2 py-1 mask-fade-edges">
			<motion.div
				animate={{ x: reverse ? [-1000, 0] : [0, -1000] }}
				transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
				className="flex gap-2 shrink-0"
			>
				{items.map((t) => (
					<TechBadge key={t} name={t} />
				))}
				{/* Duplicate for infinite loop */}
				{items.map((t) => (
					<TechBadge key={`d-${t}`} name={t} />
				))}
			</motion.div>
		</div>
	);
}

export function Hero() {
	return (
		<section
			id="top"
			className="relative min-h-screen flex flex-col justify-center px-6 md:px-12 pt-32 pb-16 overflow-hidden"
		>
			{/* Cinematic Background Glows */}
			<div className="absolute top-1/4 -left-1/4 w-[600px] h-[600px] bg-burgundy/10 rounded-full blur-[120px] pointer-events-none" />
			<div className="absolute bottom-1/4 -right-1/4 w-[500px] h-[500px] bg-forest/10 rounded-full blur-[120px] pointer-events-none" />

			<div className="max-w-7xl mx-auto w-full relative z-10">
				{/* Title Header */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8 }}
					className="mb-12"
				>
					<h1 className="text-5xl md:text-8xl font-serif tracking-tighter leading-[0.9]">
						Nicole <br />
						<span className="italic text-muted-foreground/40">Rodriguez</span>
					</h1>
					<p className="mt-6 text-lg md:text-xl font-light text-muted-foreground max-w-xl italic">
						Full-stack engineer building high-fidelity digital experiences with
						a craftsman’s precision.
					</p>
				</motion.div>

				{/* Bento Grid Layout */}
				<div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-4 auto-rows-[200px]">
					{/* 1. Tech Stack Card (Large) */}
					<motion.div
						whileHover={{ y: -5 }}
						className="md:col-span-4 lg:col-span-4 row-span-1 glass-panel rounded-3xl p-6 overflow-hidden flex flex-col justify-between"
					>
						<div>
							<p className="text-[10px] uppercase tracking-[0.2em] text-burgundy font-bold mb-2">
								Capabilities
							</p>
							<h3 className="text-xl font-serif">The Engine Room</h3>
						</div>
						<div className="space-y-1">
							<MarqueeRow items={techRows[0]} />
							<MarqueeRow items={techRows[1]} reverse />
						</div>
					</motion.div>

					{/* 2. Available Card (Small) */}
					<motion.div
						whileHover={{ y: -5 }}
						className="md:col-span-2 lg:col-span-2 glass-panel rounded-3xl p-6 flex flex-col justify-between border-forest/20"
					>
						<div className="flex justify-between items-start">
							<div className="w-8 h-8 rounded-full bg-forest/20 flex items-center justify-center">
								<Globe className="w-4 h-4 text-forest" />
							</div>
							<span className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-forest/10 border border-forest/20 text-[10px] text-forest font-bold uppercase tracking-wide">
								<span className="w-1 h-1 rounded-full bg-forest animate-pulse" />
								Available Now
							</span>
						</div>
						<div>
							<p className="text-xs text-muted-foreground uppercase tracking-widest">
								Location
							</p>
							<h3 className="text-lg font-serif">Global / Remote</h3>
						</div>
					</motion.div>

					{/* 3. Methodology Card (Medium) */}
					<motion.div
						whileHover={{ y: -5 }}
						className="md:col-span-3 lg:col-span-3 glass-panel rounded-3xl p-8 flex flex-col justify-center gap-6"
					>
						<p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-bold">
							What You Get
						</p>
						<div className="grid grid-cols-2 gap-4">
							<div className="space-y-1">
								<div className="flex items-center gap-2 text-burgundy">
									<Zap className="w-4 h-4" />
									<span className="text-sm font-medium text-foreground">
										Performance
									</span>
								</div>
								<p className="text-xs text-muted-foreground">
									Sub-second load times & SEO optimization.
								</p>
							</div>
							<div className="space-y-1">
								<div className="flex items-center gap-2 text-forest">
									<ShieldCheck className="w-4 h-4" />
									<span className="text-sm font-medium text-foreground">
										Accessibility
									</span>
								</div>
								<p className="text-xs text-muted-foreground">
									WCAG compliant & inclusive design.
								</p>
							</div>
						</div>
					</motion.div>

					{/* 4. Experience Card (Medium) */}
					<motion.div
						whileHover={{ y: -5 }}
						className="md:col-span-3 lg:col-span-3 glass-panel rounded-3xl p-8 bg-gradient-to-br from-burgundy/5 to-transparent flex flex-col justify-center"
					>
						<h3 className="text-3xl font-serif italic mb-2">
							"Code you keep."
						</h3>
						<p className="text-sm text-muted-foreground font-light leading-relaxed">
							I focus on clean handoffs, zero lock-in, and maintainable
							architecture. I don't just build for today; I build for the
							engineers who inherit my work.
						</p>
					</motion.div>
				</div>
			</div>
		</section>
	);
}
