import { motion, useScroll, useTransform } from "framer-motion";
import { GitBranch, Globe, ArrowLeft, Cpu, Layout } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { projectsData } from "../data/projects";

const CASE_STUDY_ORDER = [
	"nuclear-router",
	"elite-global",
	"impactify",
] as const satisfies readonly (keyof typeof projectsData)[];

export default function ProjectCaseStudy({ project }: any) {
	// FIX: Use React Router's useParams instead of wouter's useRoute
	const { slug, id } = useParams();
	const currentId = slug || id || "";

	const currentIndex = CASE_STUDY_ORDER.indexOf(currentId as any);
	const nextIdx = (currentIndex + 1) % CASE_STUDY_ORDER.length;
	const nextId = CASE_STUDY_ORDER[nextIdx];
	const nextProject = projectsData[nextId];

	const { scrollYProgress } = useScroll();
	const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

	return (
		<div className="min-h-screen bg-[#0D0D0D] text-[#F5F0E8] selection:bg-rose/30">
			{/* 1. HERO SECTION */}
			<section className="relative h-[90vh] flex flex-col justify-center px-6 md:px-12 max-w-7xl mx-auto">
				<motion.button
					onClick={() => window.history.back()}
					className="absolute top-10 flex items-center gap-2 text-xs font-mono uppercase tracking-widest opacity-50 hover:opacity-100 transition-opacity"
				>
					<ArrowLeft size={14} /> Back to Work
				</motion.button>

				<motion.div style={{ opacity }}>
					<span className="font-mono text-rose text-sm tracking-[0.3em] uppercase mb-6 block">
						{project.year} // {project.category}
					</span>
					<h1 className="text-6xl md:text-9xl font-serif leading-[0.85] tracking-tighter mb-8">
						{project.title}
					</h1>
					<p className="text-xl md:text-2xl font-light text-muted-foreground max-w-3xl leading-relaxed">
						{project.tagline}
					</p>
				</motion.div>

				<div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 border-t border-white/10 pt-10 font-mono text-[10px] uppercase tracking-widest text-white/40">
					<div>
						<p className="mb-2 text-rose/60">Role</p>
						<p className="text-white">{project.role}</p>
					</div>
					<div>
						<p className="mb-2 text-rose/60">Stack</p>
						<p className="text-white">{project.stack.slice(0, 3).join(", ")}</p>
					</div>
					<div>
						<p className="mb-2 text-rose/60">Live</p>
						<a
							href={project.live}
							className="text-white hover:text-green transition-colors flex items-center gap-1"
						>
							Visit Site <Globe size={10} />
						</a>
					</div>
					<div>
						<p className="mb-2 text-rose/60">Source</p>
						<a
							href={project.github}
							className="text-white hover:text-green transition-colors flex items-center gap-1"
						>
							Repository <GitBranch size={10} />
						</a>
					</div>
				</div>
			</section>

			{/* 2. CONTENT SECTION */}
			<section className="py-32 px-6 md:px-12 max-w-4xl mx-auto space-y-32">
				<div className="space-y-8">
					<div className="flex items-center gap-4">
						<span className="text-3xl font-serif italic text-rose">01</span>
						<h2 className="text-3xl font-serif">The Motivation</h2>
					</div>
					<p className="text-lg text-muted-foreground leading-relaxed font-light">
						{project.why}
					</p>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div className="p-8 bg-white/[0.02] border border-white/5 rounded-3xl">
						<Cpu className="text-green mb-6" size={24} />
						<h3 className="text-xl font-serif mb-4">Architecture Decisions</h3>
						<p className="text-sm text-muted-foreground leading-relaxed">
							{project.decisions}
						</p>
					</div>
					<div className="p-8 bg-white/[0.02] border border-white/5 rounded-3xl">
						<Layout className="text-rose mb-6" size={24} />
						<h3 className="text-xl font-serif mb-4">User Experience</h3>
						<p className="text-sm text-muted-foreground leading-relaxed">
							{project.ux}
						</p>
					</div>
				</div>

				<div className="space-y-8 border-t border-white/10 pt-20">
					<div className="flex items-center gap-4">
						<span className="text-3xl font-serif italic text-green">02</span>
						<h2 className="text-3xl font-serif">Retrospective</h2>
					</div>
					<ul className="space-y-6">
						{project.lessons.map((lesson: string, i: number) => (
							<li
								key={i}
								className="flex gap-4 text-muted-foreground font-light"
							>
								<span className="text-rose font-mono text-xs mt-1">
									/0{i + 1}
								</span>
								{lesson}
							</li>
						))}
					</ul>
				</div>
			</section>

			{/* 3. FINAL CTA */}
			<section className="py-40 text-center bg-gradient-to-t from-rose/5 to-transparent">
				<h2 className="text-4xl md:text-7xl font-serif mb-10">Next Project</h2>
				<Link
					to={`/projects/${nextId}`} // FIX: Use 'to' instead of 'href'
					className="inline-block px-10 py-4 rounded-full border border-white/20 hover:border-rose/50 transition-all font-serif italic text-2xl"
				>
					{nextProject.title} →
				</Link>
			</section>
		</div>
	);
}
