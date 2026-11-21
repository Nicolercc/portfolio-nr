import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion";
import { useRef } from "react";
import { PROFILE } from "../../data/profile";

export function Experience() {
	const containerRef = useRef<HTMLDivElement>(null);
	const reduceMotion = useReducedMotion();

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
			type: "Fellowship",
			company: "Pursuit",
			role: "AI-Native Software Engineering Fellow",
			period: PROFILE.pursuitPeriod,
			description:
				"Built a drift-proof evaluation harness for an AI customer-inbox triage tool: one shared inference path, an automated CI gate, a serverless proxy layer, and PII redaction before any message reaches the model, reaching 8/8 accuracy on urgency and category classification. Also rebuilt Impactify from React/Vite to the Next.js App Router.",
			skills: ["TypeScript", "Next.js", "Node.js", "Python", "PostgreSQL", "Claude API", "Cloud Run", "Docker", "Vercel"],
		},
		{
			type: "Capstone",
			company: "Van Alen Institute",
			role: "Data Model & Migration Specialist · Pursuit capstone team",
			period: "Oct — Nov 2026",
			description:
				"Built the institute's Airtable data model (12 linked tables) as one source of truth for programs, partners, projects, and funding; the staff dashboard reads from it. Migrated and verified 590+ records from spreadsheets, visitor logs, and event systems, set up permissions and staff entry forms, and wrote the 27-page staff guide.",
			skills: ["Data Modeling", "Airtable", "Data Migration", "Permissions", "Documentation"],
		},
		{
			type: "Freelance",
			company: "Elite Global Cleaning Services",
			role: "Freelance Full-Stack Developer",
			period: "Nov 2024 — May 2025",
			description:
				"Sole technical point of contact for a Queens-based environmental remediation company. Shipped a static-first Astro and TypeScript site with React integrations, customer contact flows, SEO, and English/Spanish i18n. After launch, diagnosed a Netlify webhook and Porkbun DNS failure behind an expired SSL certificate and restored HTTPS. Still provide occasional maintenance.",
			skills: ["Astro", "TypeScript", "React", "Tailwind", "Netlify", "Porkbun DNS", "i18n"],
		},
		{
			type: "Editorial",
			company: "POPSUGAR",
			role: "Freelance Writer",
			period: "2022 — 2023",
			description:
				"Published a plain-language article for a national digital audience on an editorial deadline. Writing for readers I'll never meet is why I care about clear product copy, onboarding, and documentation.",
			skills: ["Plain-Language Writing", "Editing", "Editorial Deadlines"],
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
							initial={reduceMotion ? false : { opacity: 0 }}
							whileInView={{ opacity: 1 }}
							viewport={{ once: true }}
							className="font-mono text-caption tracking-[0.5em] text-rose uppercase"
						>
							Experience
						</motion.p>
						<h2 className="text-4xl md:text-5xl font-serif text-white leading-tight">
							Built end to end, <br />
							<span className="italic text-transparent bg-clip-text bg-gradient-to-r from-rose to-green">
								designed with care.
							</span>
						</h2>
						<p className="text-sm text-white/60 font-light max-w-xs leading-relaxed">
							Full-stack training, a designer's eye, and the habit of checking my
							own work before anyone else has to.
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
									// Reveal once; never hide content again after it has been read.
									initial={reduceMotion ? false : { opacity: 0, x: 20 }}
									whileInView={{ opacity: 1, x: 0 }}
									viewport={{ once: true, margin: "0px 0px -10% 0px" }}
									transition={reduceMotion ? { duration: 0 } : { duration: 0.8, delay: i * 0.1 }}
									className="relative group"
								>
									{/* The "Node" on the line */}
									<div className="absolute -left-[33px] md:-left-[69px] top-2 w-3 h-3 rounded-full bg-[#0D0D0D] border border-white/20 z-10 group-hover:border-rose transition-colors duration-500">
										<motion.div
											initial={reduceMotion ? false : { scale: 0 }}
											whileInView={{ scale: 1 }}
											viewport={{ once: true }}
											className="absolute inset-1 rounded-full bg-rose opacity-0 group-hover:opacity-100 transition-opacity"
										/>
									</div>

									<div className="flex flex-col space-y-4">
										<div className="flex flex-col md:flex-row md:items-baseline justify-between gap-2">
											<h3 className="text-3xl font-serif text-white group-hover:text-rose transition-colors duration-500">
												{exp.company}
											</h3>
											<span className="font-mono text-caption text-white/60 tracking-widest uppercase italic">
												{exp.period}
											</span>
										</div>

										<div className="flex items-center gap-3">
											<span className="text-caption font-mono text-rose/90 border border-rose/30 px-2 py-0.5 rounded tracking-tighter uppercase">
												{exp.type}
											</span>
											<span className="text-sm text-white/65 font-mono tracking-tight">
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
													className="px-2 py-1 bg-white/[0.03] border border-white/10 rounded text-caption font-mono text-white/60 uppercase tracking-tighter"
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
