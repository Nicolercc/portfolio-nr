/* ─────────────────────────────────────────────
   COMPONENT: The Professional Narrative
───────────────────────────────────────────── */
import { motion } from "framer-motion";

export function Experience() {
	const experiences = [
		{
			type: "Engineering",
			company: "Elite Global Cleaning Services",
			role: "Full-Stack Developer",
			period: "2023 — 2024",
			description:
				"Architected a high-performance digital presence focusing on B2B conversion. Optimized site performance to 100/100 Lighthouse scores and ensured WCAG AA accessibility compliance.",
			skills: ["Astro", "TypeScript", "Tailwind", "Performance Optimization"],
		},
		{
			type: "Collaboration",
			company: "Open Source Contributor",
			role: "GitHub Community",
			period: "2024",
			description:
				"Contributing to the global ecosystem by solving issues, refining documentation, and maintaining code quality in public repositories.",
			skills: ["Git Workflow", "Code Review", "Public Documentation"],
		},
		{
			type: "Editorial",
			company: "POPSUGAR",
			role: "Contributing Writer",
			period: "Pre-Tech",
			description:
				"Crafting narratives for a global audience of millions. Developed a deep understanding of digital engagement, SEO, and the speed of modern media.",
			skills: ["Content Strategy", "Narrative Design", "Digital Engagement"],
		},
	];

	return (
		<section className="py-32 px-6 md:px-12 bg-transparent">
			<div className="max-w-7xl mx-auto border-t border-white/[0.05] pt-20">
				<div className="mb-20">
					<motion.p
						initial={{ opacity: 0 }}
						whileInView={{ opacity: 1 }}
						className="font-mono text-[10px] tracking-[0.5em] text-rose uppercase mb-4"
					>
						Evolution
					</motion.p>
					<h2 className="text-4xl md:text-6xl font-serif text-white">
						The journey from <br />
						<span className="italic text-transparent bg-clip-text bg-gradient-to-r from-rose to-green">
							words to wires.
						</span>
					</h2>
				</div>

				<div className="grid grid-cols-1 gap-px bg-white/5 border border-white/5 rounded-3xl overflow-hidden">
					{experiences.map((exp, i) => (
						<motion.div
							key={i}
							initial={{ opacity: 0 }}
							whileInView={{ opacity: 1 }}
							transition={{ delay: i * 0.1 }}
							className="bg-card p-8 md:p-12 hover:bg-white/[0.02] transition-colors group"
						>
							<div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
								{/* Meta */}
								<div className="md:col-span-3">
									<span className="text-[10px] font-mono uppercase tracking-widest text-white/30 block mb-2">
										{exp.type}
									</span>
									<span className="text-xs text-rose/60 font-mono italic">
										{exp.period}
									</span>
								</div>

								{/* Content */}
								<div className="md:col-span-6">
									<h3 className="text-2xl font-serif text-white mb-2 group-hover:text-rose transition-colors">
										{exp.company}
									</h3>
									<p className="text-sm text-white/50 font-mono mb-4">
										{exp.role}
									</p>
									<p className="text-muted-foreground font-light leading-relaxed">
										{exp.description}
									</p>
								</div>

								{/* Tags */}
								<div className="md:col-span-3 flex flex-wrap gap-2 md:justify-end">
									{exp.skills.map((skill) => (
										<span
											key={skill}
											className="px-2 py-1 rounded border border-white/10 text-[9px] font-mono text-white/40 uppercase tracking-tighter"
										>
											{skill}
										</span>
									))}
								</div>
							</div>
						</motion.div>
					))}
				</div>
			</div>
		</section>
	);
}
