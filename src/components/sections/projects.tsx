import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

/* ─────────────────────────────────────────────
   DATA: The Portfolio Content
───────────────────────────────────────────── */
const caseStudies = [
	{
		index: "01",
		category: "Civic Tech · Full-Stack",
		title: "Impactify",
		tagline: "An activism hub that turns awareness into action.",
		description:
			"Fragmented activism tools meant people gave up before they acted. Impactify centralizes event discovery and cause-driven donations into one cohesive platform.",
		highlights: [
			"Real-time event maps via Google Maps API",
			"Stripe-integrated donation flows",
			"Live news feed via NewsAPI",
		],
		stack: ["React", "Firebase", "Stripe", "Netlify"],
		accent: "rose",
		year: "2024",
		images: [
			{
				label: "Event Discovery",
				bg: "from-rose/20 to-transparent",
				icon: "🗺️",
			},
			{
				label: "Donation Flow",
				bg: "from-green/20 to-transparent",
				icon: "💳",
			},
		],
	},
	{
		index: "02",
		category: "Corporate · Static Site",
		title: "Elite Global",
		tagline: "High-performance digital presence for industrial B2B.",
		description:
			"Industrial clients judge fast. This 100/100 Lighthouse score site projects trust and authority the moment the page opens.",
		highlights: [
			"100/100 Lighthouse performance",
			"WCAG AA compliant markup",
			"Zero JavaScript overhead architecture",
		],
		stack: ["Astro", "TypeScript", "Tailwind CSS"],
		accent: "green",
		year: "2023",
		images: [
			{ label: "Homepage", bg: "from-green/20 to-transparent", icon: "🏢" },
			{ label: "Services", bg: "from-zinc-800 to-transparent", icon: "🛡️" },
		],
	},
];

/* ─────────────────────────────────────────────
   SUB-COMPONENT: The Project Visuals
───────────────────────────────────────────── */
function ProjectVisuals({
	images,
}: {
	images: (typeof caseStudies)[0]["images"];
}) {
	return (
		<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
			{images.map((img) => (
				<div
					key={img.label}
					className="relative aspect-video rounded-2xl overflow-hidden bg-zinc-900 border border-white/[0.05] group/img"
				>
					<div
						className={`absolute inset-0 bg-gradient-to-br ${img.bg} opacity-40 group-hover:opacity-60 transition-opacity duration-500`}
					/>
					<div className="absolute inset-0 flex items-center justify-center text-5xl grayscale group-hover/img:grayscale-0 group-hover/img:scale-110 transition-all duration-700">
						{img.icon}
					</div>
					<div className="absolute bottom-4 left-4 text-[10px] uppercase tracking-[0.2em] font-mono text-white/30">
						{img.label}
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
			className="relative py-20  border-white/10 group"
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

					<motion.a
						href="#"
						className={`inline-flex items-center gap-2 text-xs uppercase tracking-widest font-bold ${accentClass} group/link`}
					>
						Explore Case Study
						<ArrowUpRight className="w-4 h-4 group-hover/link:translate-x-1 group-hover/link:-translate-y-1 transition-transform" />
					</motion.a>
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
			<div className="max-w-7xl mx-auto relative z-10 border-t border-white/[0.05] pt-25">
				{/* Editorial Header */}
				<header className="mb-25">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						className="text-[10px] uppercase tracking-[0.4em] mb-8 font-mono font-bold text-rose"
					>
						Selected Works
					</motion.div>

					<motion.h2
						initial={{ opacity: 0, y: 30 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.1, duration: 0.8 }}
						viewport={{ once: true }}
						className="text-6xl md:text-9xl font-serif tracking-tighter leading-[0.85]"
					>
						Crafting with <br />
						<span className="italic text-transparent bg-clip-text bg-gradient-to-r from-rose via-purple-400 to-green">
							Intention.
						</span>
					</motion.h2>
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
