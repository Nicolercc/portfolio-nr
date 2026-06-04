import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

/* ─────────────────────────────────────────────
   DATA: The Portfolio Content
───────────────────────────────────────────── */
// upgraded caseStudies data (hire-level)

type CaseStudyImage = {
	label: string;
	bg: string;
	icon: string;
	stat?: string;
};

const caseStudies = [
	{
		slug: "nuclear-router",
		index: "01",
		category: "Hackathon · Community & Safety Response",
		title: "Nuclear Escape Router",
		tagline: "Real routing, live weather, AI triage — survival guidance in under 3 seconds.",
		description:
			"Full-stack nuclear emergency simulator deployed on Google Cloud Run + Vercel. Architected a pnpm monorepo, decoded Google's encoded polyline format for real road geometry, and built a geospatial scoring algorithm that routes escape destinations away from — not through — the blast zone.",
		highlights: [
			"Claude AI generates a personalized 3-sentence survival brief server-side on every analysis",
			"Geospatial scoring algorithm selects safe city destinations by flee-from-blast bearing weighted against wind direction",
			"Real Google Directions polyline decoded client-side — escape route follows actual roads",
			"Shareable URLs encode full scenario; shared links auto-run analysis on load",
			"Won Community Favorite + Best Alignment with Theme",
		],
		stack: [
			"React 19",
			"TypeScript",
			"Express 5",
			"Google Maps APIs",
			"OpenWeather",
			"Claude AI",
			"Leaflet",
			"Cloud Run",
			"Vercel",
			"Docker",
			"pnpm Monorepo",
		],
		accent: "rose",
		year: "2026",
		images: [
			{
				label: "Real-Road Routing",
				bg: "from-green/20 to-transparent",
				icon: "🧭",
				stat: "Google Directions API · Encoded polyline decoded client-side",
			},
			{
				label: "AI Survival Brief",
				bg: "from-rose/20 to-transparent",
				icon: "⚡",
				stat: "Claude AI · 3-sentence brief · server-side",
			},
		],
	},
	{
		slug: "impactify",
		index: "02",
		category: "Civic Tech · Full-Stack · BlackRock Capstone",
		title: "Impactify",
		tagline: "Civic engagement for the overwhelmed but informed. Actions, not awareness.",
		description:
			"Rebuilt the entire stack from Firebase/Vite to Next.js App Router under deadline for a BlackRock capstone demo. Guardian News API + Claude AI generate plain-English issue summaries cached to Supabase — confident prose with one citation beats source carousels.",
		highlights: [
			"Full stack rebuild under deadline: Firebase/Stripe/Vite → Next.js App Router for BlackRock real estate demo",
			"Claude AI generates bill summaries server-side, cached to Supabase — no repeated API calls",
			"Promise.all parallelizes all briefing fetches, cutting load from 3s sequential waterfall to under 800ms",
			"Designed around Sofia — a named 27-year-old NYC persona — not a generic user",
		],
		stack: [
			"Next.js 14",
			"TypeScript",
			"Tailwind CSS",
			"Supabase",
			"Anthropic API",
			"Guardian News API",
			"VolunteerMatch API",
			"Vercel",
		],
		accent: "green",
		year: "2024–2025",
		images: [
			{
				label: "Weekly Briefing",
				bg: "from-green/20 to-transparent",
				icon: "📰",
				stat: "Guardian API · Claude AI · Supabase cache",
			},
			{
				label: "BlackRock Demo",
				bg: "from-rose/20 to-transparent",
				icon: "🗳️",
				stat: "Next.js App Router · rebuilt under deadline",
			},
		],
	},
	{
		slug: "elite-global",
		index: "03",
		category: "Corporate · Client Work",
		title: "Elite Global Cleaning Services",
		tagline: "Production client site maintained through real infrastructure failures.",
		description:
			"Astro-powered static site for a Queens-based environmental remediation company. Resolved a production SSL certificate expiry post-launch — diagnosed Netlify webhook and Porkbun DNS propagation failure, restored HTTPS. Added English/Spanish i18n via Astro routing after initial delivery.",
		highlights: [
			"Resolved production SSL expiry: diagnosed Netlify webhook + Porkbun DNS failure, restored HTTPS",
			"Zero-JavaScript Astro architecture — sub-second load on mobile industrial connections",
			"English/Spanish bilingual routing via Astro i18n layer, no third-party translation service",
		],
		stack: [
			"Astro",
			"TypeScript",
			"Tailwind CSS",
			"React (Astro Islands)",
			"Netlify",
			"Porkbun DNS",
		],
		accent: "rose",
		year: "2023",
		images: [
			{
				label: "Production Site",
				bg: "from-green/20 to-transparent",
				icon: "🏢",
				stat: "Astro · zero JS · SSL incident resolved",
			},
			{
				label: "Bilingual i18n",
				bg: "from-zinc-800 to-transparent",
				icon: "🌐",
				stat: "EN/ES · Astro i18n routing layer",
			},
		],
	},
];

/* ─────────────────────────────────────────────
   SUB-COMPONENT: The Project Visuals
───────────────────────────────────────────── */
function ProjectVisuals({
	images,
}: {
	images: CaseStudyImage[];
}) {
	return (
		<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
			{images.map((img) => (
				<div
					key={img.label}
					className="relative aspect-video rounded-2xl overflow-hidden bg-zinc-950 border border-white/[0.06] group/img flex flex-col justify-between p-5"
				>
					<div
						className={`absolute inset-0 bg-gradient-to-br ${img.bg} opacity-20 group-hover/img:opacity-40 transition-opacity duration-500`}
					/>
					<div className="relative z-10 flex items-center justify-between">
						<span className="text-[9px] uppercase tracking-[0.25em] font-mono text-white/30">
							{img.label}
						</span>
						<span className="text-2xl">{img.icon}</span>
					</div>
					<div className="relative z-10">
						<div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent mb-3" />
						<p className="text-[10px] font-mono text-white/20 uppercase tracking-widest">
							{img.stat ?? "Case study"}
						</p>
					</div>
				</div>
			))}
		</div>
	);
}

/* ─────────────────────────────────────────────
   SUB-COMPONENT: Case Study Row
───────────────────────────────────────────── */
function CaseStudyCard({ study }: { study: (typeof caseStudies)[0] }) {
	const cardRef = useRef<HTMLDivElement>(null);
	const { scrollYProgress } = useScroll({
		target: cardRef,
		offset: ["start end", "end start"],
	});

	const yTranslate = useTransform(scrollYProgress, [0, 1], [50, -50]);
	const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

	const isRose = study.accent === "rose";
	const accentClass = isRose ? "text-rose" : "text-green";

	return (
		<motion.article
			ref={cardRef}
			style={{ opacity }}
			className="relative py-12 border-white/10 group"
		>
			<div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
				{/* Left Side: Info */}
				<div className="lg:col-span-5 sticky top-32">
					<div className="flex items-center gap-4 mb-6">
						<span className={`text-xs font-mono ${accentClass}`}>
							{study.index}
						</span>
						<span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
							{study.category}
						</span>
					</div>

					<h3 className="text-5xl md:text-7xl font-serif leading-none mb-6">
						{study.title}
					</h3>

					<p className="text-lg text-muted-foreground font-light leading-relaxed mb-8 max-w-md">
						{study.tagline}
					</p>

					<div className="flex flex-wrap gap-2 mb-10">
						{study.stack.map((tech) => (
							<span
								key={tech}
								className="px-3 py-1 rounded-full border border-white/5 bg-white/[0.02] text-[10px] font-mono opacity-50"
							>
								{tech}
							</span>
						))}
					</div>

					<Link
						to={`/projects/${study.slug}`}
						className={`inline-flex items-center gap-2 text-xs uppercase tracking-widest font-bold ${accentClass} group/link`}
					>
						Explore Case Study
						<ArrowUpRight className="w-4 h-4 group-hover/link:translate-x-1 group-hover/link:-translate-y-1 transition-transform" />
					</Link>
				</div>

				{/* Right Side: Visuals */}
				<motion.div style={{ y: yTranslate }} className="lg:col-span-7">
					<ProjectVisuals images={study.images} />
					<div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 text-sm text-muted-foreground font-light">
						<div>
							<h4 className="text-[10px] uppercase tracking-widest text-white/20 mb-3">
								Objective
							</h4>
							{study.description}
						</div>
						<div>
							<h4 className="text-[10px] uppercase tracking-widest text-white/20 mb-3">
								Key Solutions
							</h4>
							<ul className="space-y-2">
								{study.highlights.map((h) => (
									<li key={h} className="flex gap-2">
										<span
											className={`w-1 h-1 rounded-full mt-2 shrink-0 ${isRose ? "bg-rose" : "bg-green"}`}
										/>
										{h}
									</li>
								))}
							</ul>
						</div>
					</div>
				</motion.div>
			</div>
		</motion.article>
	);
}

/* ─────────────────────────────────────────────
   MAIN COMPONENT: The Projects Section
───────────────────────────────────────────── */
export function Projects() {
	return (
		<section
			id="work"
			className="relative  px-6 md:px-12 bg-transparent overflow-hidden"
		>
			<div className="max-w-7xl mx-auto relative z-10 border-t border-white/[0.05] pt-16">
				{/* Editorial Header */}
				<header className="mb-16 overflow-hidden">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						className="text-[10px] uppercase tracking-[0.4em] mb-8 font-mono font-bold text-rose"
					>
						Selected Works
					</motion.div>
					<h2 className="text-6xl md:text-9xl font-serif tracking-tighter leading-[0.85]">
						{"Crafting with".split("").map((char, i) => (
							<motion.span
								key={i}
								initial={{ opacity: 0, y: 60 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{
									duration: 0.5,
									delay: i * 0.03,
									ease: [0.16, 1, 0.3, 1],
								}}
								className="inline-block"
								style={{ whiteSpace: char === " " ? "pre" : "normal" }}
							>
								{char}
							</motion.span>
						))}
						<br />
						<span className="italic text-transparent bg-clip-text bg-gradient-to-r from-rose via-purple-400 to-green">
							{"Intention.".split("").map((char, i) => (
								<motion.span
									key={i}
									initial={{ opacity: 0, y: 60 }}
									whileInView={{ opacity: 1, y: 0 }}
									viewport={{ once: true }}
									transition={{
										duration: 0.5,
										delay: 0.2 + i * 0.04,
										ease: [0.16, 1, 0.3, 1],
									}}
									className="inline-block"
								>
									{char}
								</motion.span>
							))}
						</span>
					</h2>
				</header>

				{/* The Timeline of Projects */}
				<div className="space-y-0">
					{caseStudies.map((study) => (
						<CaseStudyCard key={study.title} study={study} />
					))}
				</div>
			</div>
		</section>
	);
}
