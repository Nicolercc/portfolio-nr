import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight, ExternalLink } from "lucide-react";

const caseStudies = [
	{
		index: "01",
		category: "Civic Tech · Full-Stack",
		title: "Impactify",
		tagline:
			"An activism hub that turns awareness into action — events, donations, and curated news in one place.",
		description:
			"Fragmented activism tools meant people gave up before they acted. Impactify centralizes event discovery, cause-driven donations, and live news in one cohesive platform — built to remove every barrier between intention and impact.",
		highlights: [
			"Real-time event maps powered by Google Maps API",
			"Stripe-integrated donation flows with campaign tracking",
			"Live news feed via NewsAPI filtered by cause category",
			"Firebase auth with community-level access controls",
		],
		stack: [
			"React",
			"Firebase",
			"Stripe",
			"Bootstrap",
			"NewsAPI",
			"Google Maps",
			"Netlify",
		],
		accent: "burgundy",
		year: "2024",
		images: [
			{
				label: "Event Discovery",
				bg: "from-burgundy/30 to-burgundy/5",
				icon: "🗺️",
			},
			{ label: "Donation Flow", bg: "from-forest/30 to-forest/5", icon: "💳" },
		],
	},
	{
		index: "02",
		category: "Corporate · Static Site",
		title: "Elite Global Cleaning",
		tagline:
			"A professional digital presence for an industrial asbestos removal and commercial cleaning company.",
		description:
			"Industrial clients judge fast — a slow or generic site means lost contracts. This fast-loading, fully accessible static site projects trust and authority the moment the page opens.",
		highlights: [
			"100/100 Lighthouse performance score",
			"Fully accessible — WCAG AA compliant markup",
			"SSG-first architecture with zero JavaScript overhead",
			"Content structured for industrial B2B conversion",
		],
		stack: ["Astro", "TypeScript", "Tailwind CSS", "Netlify"],
		accent: "forest",
		year: "2023",
		images: [
			{ label: "Homepage", bg: "from-forest/30 to-forest/5", icon: "🏢" },
			{ label: "Services", bg: "from-zinc-700/40 to-zinc-900/10", icon: "🛡️" },
		],
	},
	{
		index: "03",
		category: "Frontend Engineering · Clone",
		title: "YouTube Clone",
		tagline:
			"A faithful recreation of YouTube's core experience — a deep study in React architecture at scale.",
		description:
			"Building a clone sounds simple. Building one that handles real API data, complex routing, global state, and responsive media playback without shortcuts — that's the real challenge.",
		highlights: [
			"Component-driven architecture mirroring YouTube's layout system",
			"YouTube Data API v3 integration for real video content",
			"Global state management with Context + useReducer",
			"Responsive video player with custom controls",
		],
		stack: ["React", "YouTube API", "Context API", "CSS Modules", "Vercel"],
		accent: "neutral",
		year: "2023",
		images: [
			{ label: "Home Feed", bg: "from-red-900/20 to-red-900/5", icon: "▶️" },
			{
				label: "Video Player",
				bg: "from-zinc-700/40 to-zinc-900/10",
				icon: "🎬",
			},
		],
	},
];

function ScreenshotPlaceholder({
	label,
	bg,
	icon,
}: {
	label: string;
	bg: string;
	icon: string;
}) {
	return (
		<div
			className={`relative w-full rounded-2xl overflow-hidden aspect-video bg-gradient-to-br ${bg} border border-white/[0.06] flex flex-col items-center justify-center gap-3 group`}
		>
			<span className="text-4xl group-hover:scale-110 transition-transform duration-300">
				{icon}
			</span>
			<span className="text-xs uppercase tracking-widest text-white/30 font-mono">
				{label}
			</span>
			<div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
			<div className="absolute bottom-3 right-3">
				<span className="text-[9px] text-white/20 font-mono uppercase">
					placeholder — swap with screenshot
				</span>
			</div>
		</div>
	);
}

function CaseStudyCard({
	study,
	i,
}: {
	study: (typeof caseStudies)[0];
	i: number;
}) {
	const cardRef = useRef<HTMLDivElement>(null);
	const { scrollYProgress } = useScroll({
		target: cardRef,
		offset: ["0 1", "0.6 1"],
	});
	const opacity = useTransform(scrollYProgress, [0, 1], [0, 1]);
	const y = useTransform(scrollYProgress, [0, 1], [60, 0]);

	const accentColor =
		study.accent === "burgundy"
			? "text-burgundy"
			: study.accent === "forest"
				? "text-forest"
				: "text-muted-foreground";
	const accentBorder =
		study.accent === "burgundy"
			? "border-burgundy/30"
			: study.accent === "forest"
				? "border-forest/30"
				: "border-white/10";

	return (
		<motion.article
			ref={cardRef}
			style={{ opacity, y }}
			className="relative border-t border-white/10 pt-12 pb-20"
		>
			<div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-10">
				<div className="flex items-center gap-4">
					<span className={`text-xs font-mono ${accentColor} opacity-60`}>
						{study.index}
					</span>
					<span className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
						{study.category}
					</span>
				</div>
				<div className="flex items-center gap-3">
					<span className="text-xs font-mono text-muted-foreground">
						{study.year}
					</span>
					<button className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors group">
						View project{" "}
						<ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
					</button>
				</div>
			</div>

			<h2 className="text-5xl md:text-7xl lg:text-8xl font-serif leading-none tracking-tight mb-6 group flex items-end gap-4 cursor-default">
				{study.title}
				<ArrowUpRight
					className={`w-10 h-10 opacity-0 -translate-x-4 translate-y-4 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-300 ${accentColor}`}
				/>
			</h2>

			<p className="text-lg md:text-xl text-muted-foreground font-light max-w-2xl leading-relaxed mb-12">
				{study.tagline}
			</p>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
				{study.images.map((img) => (
					<ScreenshotPlaceholder key={img.label} {...img} />
				))}
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
				<div>
					<h3 className="text-xs uppercase tracking-[0.25em] text-muted-foreground mb-4">
						The Story
					</h3>
					<p className="text-base text-foreground/80 font-light leading-relaxed">
						{study.description}
					</p>
				</div>
				<div>
					<h3 className="text-xs uppercase tracking-[0.25em] text-muted-foreground mb-4">
						The Craft
					</h3>
					<ul className="space-y-3">
						{study.highlights.map((h) => (
							<li key={h} className="flex items-start gap-3">
								<span
									className={`mt-1.5 w-1 h-1 rounded-full shrink-0 bg-current ${accentColor} opacity-60`}
								/>
								<span className="text-sm text-foreground/75 font-light leading-relaxed">
									{h}
								</span>
							</li>
						))}
					</ul>
				</div>
			</div>

			<div
				className={`mt-10 pt-6 border-t ${accentBorder} flex flex-wrap gap-2`}
			>
				{study.stack.map((tech) => (
					<span
						key={tech}
						className="px-3 py-1 rounded-full border border-white/10 bg-white/[0.03] text-xs text-foreground/60 font-mono"
					>
						{tech}
					</span>
				))}
			</div>
		</motion.article>
	);
}

export function Projects() {
	return (
		<section
			id="work"
			className="relative py-24 px-6 md:px-12 max-w-7xl mx-auto"
		>
			<div className="mb-20">
				<motion.p
					initial={{ opacity: 0, y: 10 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-3"
				>
					Curated work
				</motion.p>
				<motion.h2
					initial={{ opacity: 0, y: 16 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ delay: 0.1 }}
					className="text-3xl md:text-5xl font-serif max-w-xl leading-tight"
				>
					Projects built with intention, shipped with precision.
				</motion.h2>
			</div>
			{caseStudies.map((study, i) => (
				<CaseStudyCard key={study.title} study={study} i={i} />
			))}
		</section>
	);
}
