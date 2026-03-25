import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

const caseStudies = [
	{
		index: "01",
		title: "Impactify",
		category: "Full-Stack · Civic Tech",
		description:
			"A centralized hub for activism, bridging the gap between social awareness and direct community action.",
		stack: ["React", "Firebase", "Stripe", "Google Maps"],
		accent: "burgundy",
	},
	{
		index: "02",
		title: "Elite Global",
		category: "Performance · B2B",
		description:
			"A high-conversion digital presence for industrial cleaning, optimized for trust and sub-second load times.",
		stack: ["Astro", "TypeScript", "Tailwind CSS"],
		accent: "forest",
	},
];

function ProjectCard({ study }: { study: (typeof caseStudies)[0] }) {
	const container = useRef(null);
	const { scrollYProgress } = useScroll({
		target: container,
		offset: ["start end", "end start"],
	});

	const y = useTransform(scrollYProgress, [0, 1], [100, -100]);

	return (
		<div ref={container} className="py-24 border-t border-white/5 group">
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
				<div className="space-y-6">
					<div className="flex items-center gap-4">
						<span
							className={`text-xs font-mono opacity-50 ${study.accent === "burgundy" ? "text-burgundy" : "text-forest"}`}
						>
							{study.index}
						</span>
						<span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
							{study.category}
						</span>
					</div>

					<h2 className="text-5xl md:text-7xl font-serif tracking-tight group-hover:italic transition-all duration-500">
						{study.title}
					</h2>

					<p className="text-lg text-muted-foreground font-light leading-relaxed max-w-md">
						{study.description}
					</p>

					<div className="flex flex-wrap gap-2">
						{study.stack.map((tech) => (
							<span
								key={tech}
								className="px-3 py-1 rounded-full border border-white/5 bg-white/[0.02] text-[10px] font-mono uppercase tracking-widest text-muted-foreground"
							>
								{tech}
							</span>
						))}
					</div>

					<button className="flex items-center gap-2 text-sm font-medium pt-4 group/link">
						View Project
						<ArrowUpRight className="w-4 h-4 group-hover/link:translate-x-1 group-hover/link:-translate-y-1 transition-transform" />
					</button>
				</div>

				<div className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-white/[0.03] border border-white/10">
					<motion.div
						style={{ y }}
						className="absolute inset-0 flex items-center justify-center italic text-muted-foreground/10 text-4xl"
					>
						Project Visual
					</motion.div>
				</div>
			</div>
		</div>
	);
}

export function Projects() {
	return (
		<section id="work" className="py-32 px-6 md:px-12 max-w-7xl mx-auto">
			<div className="mb-20">
				<h2 className="text-4xl md:text-6xl font-serif">Selected Works</h2>
			</div>
			{caseStudies.map((study) => (
				<ProjectCard key={study.index} study={study} />
			))}
		</section>
	);
}
