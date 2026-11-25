import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { PROFILE } from "../../data/profile";

export function Experience() {
	const containerRef = useRef<HTMLDivElement>(null);
	const reduceMotion = useReducedMotion();
	const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
	// Highest entry index that has reached the viewport. Based on position, not on
	// an intersection event, so a fast jump past an entry still reveals it.
	const [revealed, setRevealed] = useState(-1);

	useEffect(() => {
		const update = () => {
			const limit = window.innerHeight * 0.9;
			let max = -1;
			itemRefs.current.forEach((el, i) => {
				if (el && el.getBoundingClientRect().top < limit) max = i;
			});
			setRevealed((cur) => Math.max(cur, max));
		};
		update();
		window.addEventListener("scroll", update, { passive: true });
		window.addEventListener("resize", update);
		return () => {
			window.removeEventListener("scroll", update);
			window.removeEventListener("resize", update);
		};
	}, []);

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
			oneLine:
				"Built a drift-proof evaluation harness for an AI inbox triage tool and rebuilt Impactify on the Next.js App Router.",
			role: "AI-Native Software Engineering Fellow",
			period: PROFILE.pursuitPeriod,
		},
		{
			type: "Capstone",
			company: "Van Alen Institute",
			oneLine:
				"Built the institute's Airtable data model and migrated and verified 590+ records.",
			role: "Data Model & Migration Specialist · Pursuit capstone team",
			period: "Oct — Nov 2026",
		},
		{
			type: "Freelance",
			company: "Elite Global Cleaning Services",
			oneLine:
				"Built and maintained a bilingual client site through real infrastructure failures.",
			projectHref: "/projects/elite-global",
			role: "Freelance Full-Stack Developer",
			period: "Nov 2024 — May 2025",
		},
		{
			type: "Editorial",
			company: "POPSUGAR",
			oneLine:
				"Wrote plain-language articles for a national audience, which is why I care about clear product copy.",
			role: "Freelance Writer",
			period: "2022 — 2023",
		},
	];

	return (
		<section
			id="experience"
			ref={containerRef}
			className="py-[88px] lg:py-32 px-6 md:px-12 bg-transparent relative"
		>
			<div className="max-w-7xl mx-auto border-t border-white/[0.05] pt-20">
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
					{/* LEFT: Sticky Header */}
					<div className="lg:col-span-4 lg:sticky lg:top-32 h-fit space-y-4">
						<h2 className="section-label">Experience</h2>
						<p className="text-4xl md:text-5xl font-serif text-white leading-tight">
							Built end to end, <br />
							<span className="italic text-rose">
								designed with care.
							</span>
						</p>
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
								className="absolute inset-0 w-full bg-rose"
							/>
						</div>

						{/* EXPERIENCE ITEMS */}
						<div className="space-y-24 pl-8 md:pl-24">
							{experiences.map((exp, i) => (
								<motion.div
									key={i}
									ref={(el) => {
										itemRefs.current[i] = el;
									}}
									// Reveal once; never hide content again after it has been read.
									initial={reduceMotion ? false : { opacity: 0, x: 20 }}
									animate={reduceMotion || i <= revealed ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
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

										<div className="flex flex-wrap items-center gap-3">
											<span className="text-caption font-mono text-rose/90 border border-rose/30 px-2 py-0.5 rounded tracking-tighter uppercase">
												{exp.type}
											</span>
											<span className="min-w-0 text-sm text-white/65 font-mono tracking-tight [overflow-wrap:anywhere]">
												{exp.role}
											</span>
										</div>

										<p className="text-muted-foreground font-light leading-relaxed max-w-2xl">
											{exp.oneLine}
											{"projectHref" in exp && exp.projectHref ? (
												<>
													{" "}
													<Link to={exp.projectHref} className="text-rose underline underline-offset-4">
														Project
													</Link>
												</>
											) : null}
										</p>
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
