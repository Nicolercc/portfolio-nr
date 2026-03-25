import { motion, useScroll, useSpring } from "framer-motion";
import { useRef } from "react";

export function Experience() {
	const containerRef = useRef<HTMLDivElement>(null);

	// Track scroll progress through the entire section
	const { scrollYProgress } = useScroll({
		target: containerRef,
		offset: ["start center", "end center"],
	});

	// Smooth out the progress bar movement
	const scaleY = useSpring(scrollYProgress, {
		stiffness: 100,
		damping: 30,
		restDelta: 0.001,
	});

	const experiences = [
		{
			type: "Engineering",
			company: "Elite Global Cleaning Services",
			role: "Full-Stack Developer",
			period: "2023 — 2024",
			description:
				"Architected a high-performance digital presence focusing on B2B conversion. Optimized site performance to 100/100 Lighthouse scores and ensured WCAG AA accessibility compliance.",
			skills: ["Astro", "TypeScript", "Tailwind", "Performance"],
		},
		{
			type: "Collaboration",
			company: "Open Source Contributor",
			role: "GitHub Community",
			period: "2024",
			description:
				"Contributing to the global ecosystem by solving issues, refining documentation, and maintaining code quality in public repositories.",
			skills: ["Git Workflow", "Code Review", "Public Docs"],
		},
		{
			type: "Editorial",
			company: "POPSUGAR",
			role: "Contributing Writer",
			period: "Pre-Tech",
			description:
				"Crafting narratives for a global audience of millions. Developed a deep understanding of digital engagement, SEO, and the speed of modern media.",
			skills: ["Content Strategy", "Narrative Design", "SEO"],
		},
	];

	return (
		<section
			ref={containerRef}
			className="py-32 px-6 md:px-12 bg-transparent relative"
		>
			<div className="max-w-7xl mx-auto border-t border-white/[0.05] pt-20">
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
					{/* LEFT: Sticky Header */}
					<div className="lg:col-span-4 lg:sticky lg:top-32 h-fit space-y-4">
						<motion.p
							initial={{ opacity: 0 }}
							whileInView={{ opacity: 1 }}
							className="font-mono text-[10px] tracking-[0.5em] text-rose uppercase"
						>
							Evolution
						</motion.p>
						<h2 className="text-4xl md:text-5xl font-serif text-white leading-tight">
							The journey from <br />
							<span className="italic text-transparent bg-clip-text bg-gradient-to-r from-rose to-green">
								words to wires.
							</span>
						</h2>
						<p className="text-sm text-white/30 font-light max-w-xs leading-relaxed">
							A non-linear path into engineering, fueled by narrative precision
							and technical curiosity.
						</p>
					</div>

					{/* RIGHT: Interactive Timeline */}
					<div className="lg:col-span-8 relative">
						{/* THE SCROLL LINE */}
						<div className="absolute left-0 md:left-8 top-0 bottom-0 w-[1px] bg-white/10">
							<motion.div
								style={{ scaleY, transformOrigin: "top" }}
								className="absolute inset-0 w-full bg-gradient-to-b from-rose via-purple-400 to-green"
							/>
						</div>

						{/* EXPERIENCE ITEMS */}
						<div className="space-y-24 pl-8 md:pl-24">
							{experiences.map((exp, i) => (
								<motion.div
									key={i}
									initial={{ opacity: 0, x: 20 }}
									whileInView={{ opacity: 1, x: 0 }}
									transition={{ duration: 0.8, delay: i * 0.1 }}
									className="relative group"
								>
									{/* The "Node" on the line */}
									<div className="absolute -left-[33px] md:-left-[69px] top-2 w-3 h-3 rounded-full bg-[#0D0D0D] border border-white/20 z-10 group-hover:border-rose transition-colors duration-500">
										<motion.div
											initial={{ scale: 0 }}
											whileInView={{ scale: 1 }}
											className="absolute inset-1 rounded-full bg-rose opacity-0 group-hover:opacity-100 transition-opacity"
										/>
									</div>

									<div className="flex flex-col space-y-4">
										<div className="flex flex-col md:flex-row md:items-baseline justify-between gap-2">
											<h3 className="text-3xl font-serif text-white group-hover:text-rose transition-colors duration-500">
												{exp.company}
											</h3>
											<span className="font-mono text-[10px] text-white/20 tracking-widest uppercase italic">
												{exp.period}
											</span>
										</div>

										<div className="flex items-center gap-3">
											<span className="text-[10px] font-mono text-rose/60 border border-rose/20 px-2 py-0.5 rounded tracking-tighter uppercase">
												{exp.type}
											</span>
											<span className="text-sm text-white/50 font-mono tracking-tight">
												{exp.role}
											</span>
										</div>

										<p className="text-muted-foreground font-light leading-relaxed max-w-2xl">
											{exp.description}
										</p>

										<div className="flex flex-wrap gap-2 pt-2">
											{exp.skills.map((skill) => (
												<span
													key={skill}
													className="px-2 py-1 bg-white/[0.03] border border-white/5 rounded text-[9px] font-mono text-white/40 uppercase tracking-tighter"
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
				</div>
			</div>
		</section>
	);
}
