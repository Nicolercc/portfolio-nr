import { motion } from "framer-motion";
import { useReducedMotion } from "../../lib/motionPreference";
import { Cpu, Globe } from "lucide-react";
import { LocationGlobe } from "./LocationGlobe";

// The "Tech Stack" rows for the marquee
const techRows = [
	[
		"React",
		"TypeScript",
		"Tailwind CSS",
		"Framer Motion",
		"Vite",
		"React Router",
		"Astro",
	],
	[
		"Node.js",
		"Express.js",
		"Firebase",
		"PostgreSQL",
		"Stripe",
		"Socket.io",
		"Axios",
	],
	[
		"Google Maps API",
		"React Hook Form",
		"Nodemailer",
		"COBE",
		"React Spring",
		"Material UI",
		"Bootstrap",
	],
	["Git", "GitHub", "GitHub Actions", "Vercel", "Netlify", "Render", "Figma"],
	["PostHog", "Notion", "Trello", "Slack", "Python"],
];

const stackLanes = [
	{
		label: "Product UI",
		dotClass: "bg-rose",
	},
	{
		label: "Systems & data",
		dotClass: "bg-secondary-foreground",
	},
	{
		label: "Ship & observe",
		dotClass: "bg-muted-foreground",
	},
] as const;

function TechBadge({ name }: { name: string }) {
	return (
		<span
			className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/10 bg-white/[0.03] text-xs text-muted-foreground whitespace-nowrap shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)] hover:border-rose/45 hover:text-foreground transition-[border-color,color] duration-150"
		>
			{name}
		</span>
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
	const reduceMotion = useReducedMotion();

	// Paused, the marquee becomes a complete list that wraps instead of scrolling.
	if (reduceMotion) {
		return (
			<div className="flex flex-wrap gap-2 py-1">
				{items.map((t) => (
					<TechBadge key={t} name={t} />
				))}
			</div>
		);
	}

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
				<span className="contents" aria-hidden="true">
					{items.map((t) => (
						<TechBadge key={`d-${t}`} name={t} />
					))}
				</span>
			</motion.div>
		</div>
	);
}

function EngineRoomCard() {
	const reduceMotion = useReducedMotion();

	return (
		<motion.div
			initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 16 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true, margin: "-60px" }}
			transition={reduceMotion ? { duration: 0 } : { duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
			className="group relative lg:col-span-2 glass-panel rounded-2xl p-6 overflow-hidden flex flex-col justify-between min-h-[240px] border-white/[0.07]"
		>
			{/* Ambient: soft grid */}
			<div
				className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl"
				aria-hidden
			>
				<div className="absolute inset-0 opacity-[0.45] bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:28px_28px] [mask-image:radial-gradient(ellipse_80%_70%_at_50%_40%,black,transparent)]" />
			</div>

			<div className="relative z-10 flex flex-col gap-5 min-h-0">
				<div className="flex items-start justify-between gap-4">
					<div className="min-w-0 space-y-2">
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
									className="inline-flex items-center gap-1.5 text-caption uppercase font-sans font-semibold tracking-[0.12em] text-rose-light"
								>
									<span
										className={`h-1.5 w-1.5 shrink-0 rounded-full ${lane.dotClass}`}
									/>
									{lane.label}
								</span>
							))}
						</div>
					</div>
					<div className="shrink-0 rounded-2xl border border-white/10 bg-white/[0.04] p-3 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]">
						<Cpu
							className="h-9 w-9 text-rose/85"
							strokeWidth={1.25}
							aria-hidden
						/>
					</div>
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

export function Capabilities() {
	return (
		<section
			id="capabilities"
			data-chapter="3"
			className="section-rhythm relative flex flex-col justify-center px-6 md:px-12 overflow-hidden"
		>
			<div className="max-w-7xl mx-auto w-full relative z-10">
				<h2 className="section-label">Stack</h2>

				{/* Engine Room (two thirds) and the NYC globe (one third); stacked on phones. */}
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
					<EngineRoomCard />

					<div className="lg:col-span-1 glass-panel rounded-2xl p-6 flex flex-col justify-between gap-4">
						<div className="flex justify-between items-start">
							<div className="w-8 h-8 rounded-full bg-rose/10 flex items-center justify-center">
								<Globe className="w-4 h-4 text-rose" aria-hidden />
							</div>
							<span className="flex items-center gap-1.5 px-2 py-1 rounded-full border border-white/15 font-mono text-caption text-secondary-foreground">
								NYC / remote
							</span>
						</div>
						<LocationGlobe className="w-full" size={180} />
					</div>
				</div>

				<p className="mt-8 max-w-3xl text-base leading-relaxed text-muted-foreground">
					<a
						href="https://github.com/Nicolercc/portfolio-nr/actions"
						target="_blank"
						rel="noopener noreferrer"
						className="text-foreground underline decoration-rose/50 underline-offset-4 hover:text-rose"
					>
						Every page of this site is checked for accessibility in CI, and its code and images stay under size budgets.
					</a>
				</p>
			</div>
		</section>
	);
}
