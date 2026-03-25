import { motion, useReducedMotion } from "framer-motion";
import { Cpu, Globe, ShieldCheck, Zap } from "lucide-react";
import { LocationGlobe } from "./LocationGlobe";
import "./landing.css";

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

const stackLanes = [
	{
		label: "Product UI",
		dotClass: "bg-rose/90 shadow-[0_0_10px_rgba(212,132,154,0.45)]",
	},
	{
		label: "Systems & data",
		dotClass: "bg-foreground/40 ring-1 ring-white/15",
	},
	{
		label: "Ship & observe",
		dotClass: "bg-green/90 shadow-[0_0_10px_rgba(74,222,128,0.4)]",
	},
] as const;

function TechBadge({ name }: { name: string }) {
	return (
		<motion.span
			whileHover={{ scale: 1.04, y: -1 }}
			transition={{ type: "spring", stiffness: 400, damping: 22 }}
			className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/10 bg-white/[0.03] text-xs text-muted-foreground whitespace-nowrap shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)] hover:border-rose/45 hover:text-foreground hover:shadow-[0_0_20px_-6px_rgba(212,132,154,0.35)] transition-[border-color,color,box-shadow] duration-300"
		>
			{name}
		</motion.span>
	);
}

function MarqueeRow({
	items,
	reverse = false,
	duration = 32,
}: {
	items: string[];
	reverse?: boolean;
	duration?: number;
}) {
	return (
		<div className="flex overflow-hidden gap-2 py-1 mask-fade-edges">
			<motion.div
				animate={{ x: reverse ? [-1000, 0] : [0, -1000] }}
				transition={{ duration, repeat: Infinity, ease: "linear" }}
				className="flex gap-2 shrink-0 will-change-transform"
			>
				{items.map((t) => (
					<TechBadge key={t} name={t} />
				))}
				{items.map((t) => (
					<TechBadge key={`d-${t}`} name={t} />
				))}
			</motion.div>
		</div>
	);
}

function EngineRoomCard() {
	const reduceMotion = useReducedMotion();

	return (
		<motion.div
			initial={{ opacity: 0, y: 28 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true, margin: "-60px" }}
			transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
			whileHover={{ y: -5 }}
			className="group relative md:col-span-4 lg:col-span-4 row-span-1 glass-panel rounded-3xl p-6 overflow-hidden flex flex-col justify-between min-h-[240px] border-white/[0.07]"
		>
			{/* Ambient: soft grid + rotating wash + shimmer */}
			<div
				className="pointer-events-none absolute inset-0 overflow-hidden rounded-3xl"
				aria-hidden
			>
				<div className="absolute inset-0 opacity-[0.45] bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:28px_28px] [mask-image:radial-gradient(ellipse_80%_70%_at_50%_40%,black,transparent)]" />
				<motion.div
					className="absolute left-1/2 top-1/2 h-[120%] w-[120%] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.22] blur-3xl"
					style={{
						background:
							"conic-gradient(from 0deg, rgba(212,132,154,0.35), transparent 35%, rgba(74,222,128,0.2), transparent 70%)",
					}}
					animate={reduceMotion ? { rotate: 0 } : { rotate: [0, 360] }}
					transition={
						reduceMotion
							? { duration: 0 }
							: { duration: 36, repeat: Infinity, ease: "linear" }
					}
				/>
				<motion.div
					className="absolute inset-y-0 w-[40%] skew-x-[-16deg] bg-gradient-to-r from-transparent via-white/[0.06] to-transparent"
					initial={false}
					animate={reduceMotion ? { x: "-100%" } : { x: ["-120%", "220%"] }}
					transition={
						reduceMotion
							? { duration: 0 }
							: {
									duration: 5.5,
									repeat: Infinity,
									ease: "linear",
									repeatDelay: 1.2,
								}
					}
				/>
			</div>

			<div className="relative z-10 flex flex-col gap-5 min-h-0">
				<div className="flex items-start justify-between gap-4">
					<div className="min-w-0 space-y-2">
						<p className="text-[10px] uppercase tracking-[0.2em] text-rose font-bold">
							Capabilities
						</p>
						<h3 className="text-xl font-serif tracking-tight">
							The Engine Room
						</h3>
						<p className="text-xs text-muted-foreground leading-relaxed max-w-lg">
							Live stack — the tools I reach for to design interfaces, model
							data, and ship with confidence.
						</p>
						<div className="flex flex-wrap gap-x-4 gap-y-2 pt-1">
							{stackLanes.map((lane) => (
								<span
									key={lane.label}
									className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-[0.14em] text-muted-foreground/90"
								>
									<span
										className={`h-1.5 w-1.5 shrink-0 rounded-full ${lane.dotClass}`}
									/>
									{lane.label}
								</span>
							))}
						</div>
					</div>
					<motion.div
						className="shrink-0 rounded-2xl border border-white/10 bg-white/[0.04] p-3 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]"
						animate={reduceMotion ? {} : { y: [0, -4, 0] }}
						transition={
							reduceMotion
								? {}
								: { duration: 5, repeat: Infinity, ease: "easeInOut" }
						}
					>
						<Cpu
							className="h-9 w-9 text-rose/85"
							strokeWidth={1.25}
							aria-hidden
						/>
					</motion.div>
				</div>

				<div className="space-y-2.5 pt-1 border-t border-white/[0.06]">
					<MarqueeRow items={techRows[0]} duration={30} />
					<MarqueeRow items={techRows[1]} reverse duration={36} />
					<MarqueeRow items={techRows[2]} duration={33} />
				</div>
			</div>
		</motion.div>
	);
}

export function Hero() {
	return (
		<section
			id="top"
			className="relative min-h-screen flex flex-col justify-center px-6 md:px-12 pt-10 pb-16 overflow-hidden"
		>
			{/* Cinematic Background Glows */}
			<div className="absolute top-1/4 -left-1/4 w-[600px] h-[600px] bg-rose/10 rounded-full blur-[120px] pointer-events-none" />
			<div className="absolute bottom-1/4 -right-1/4 w-[500px] h-[500px] bg-green/10 rounded-full blur-[120px] pointer-events-none" />

			<div className="max-w-7xl mx-auto w-full relative z-10">
				{/* Intro — name lives on landing; hero continues with label + thesis */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8 }}
					className="mb-12"
				>
					{/* <span className="landing__eyebrow block text-left">
						Full Stack Developer
					</span> */}
					<p className="landing__tagline mx-auto max-w-xl text-center mt-2">
						<em>
							Full-stack engineer building high-fidelity digital experiences
							with a craftsman’s precision.
						</em>
					</p>
				</motion.div>

				{/* Bento Grid Layout */}
				<div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-4 auto-rows-[minmax(200px,auto)]">
					{/* 1. Tech Stack Card (Large) */}
					<EngineRoomCard />

					{/* 2. Available Card (Small) */}
					<motion.div
						whileHover={{ y: -5 }}
						className="md:col-span-2 lg:col-span-2 glass-panel rounded-3xl p-6 flex flex-col justify-between border-green/20"
					>
						<div className="flex justify-between items-start">
							<div className="w-8 h-8 rounded-full bg-green/15 flex items-center justify-center">
								<Globe className="w-4 h-4 text-green" />
							</div>
							<span className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-green/10 border border-green/25 text-[10px] text-green font-bold uppercase tracking-wide">
								<span className="landing__status-dot" aria-hidden />
								Available for Work
							</span>
						</div>
						<div className="space-y-4">
							<LocationGlobe className="w-full" size={160} />
							<div className="space-y-0.5 pt-0.5">
								<h3 className="font-serif text-lg leading-snug text-foreground">
									New York City
								</h3>
								<p className="text-xs text-muted-foreground leading-relaxed">
									Home base on the map · collaborating remote-first across time
									zones
								</p>
							</div>
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
								<div className="flex items-center gap-2 text-rose">
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
								<div className="flex items-center gap-2 text-green">
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
						className="md:col-span-3 lg:col-span-3 glass-panel rounded-3xl p-8 bg-gradient-to-br from-rose/5 to-transparent flex flex-col justify-center"
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
