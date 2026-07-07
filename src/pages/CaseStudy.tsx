import { useParams, Link } from "react-router-dom";
import { useEffect, useId, useState, type ReactNode } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
	getProject,
	getNextProjectSlug,
	type ProjectMedia,
	type ProjectCaseStudy,
	type CaseStudyGlanceItem,
	type CaseStudyWalkthroughStep,
	type CaseStudyDecisionCard,
	type CaseStudyArchitectureLayer,
	type CaseStudyPersona,
} from "../data/projects";
import { ArrowUpRight, GitBranch, Play } from "lucide-react";
import NotFound from "./NotFound";

const GLANCE_PROOF_LABELS = new Set([
	"Status",
	"Capstone",
	"Integrations",
	"Core stack",
]);

type ImpactifyIssue = {
	id: string;
	label: string;
	briefing: string;
	sourceNote: string;
	actionLabel: string;
	actionPath: string;
};

const IMPACTIFY_ISSUES: ImpactifyIssue[] = [
	{
		id: "housing",
		label: "Housing",
		briefing:
			"Rent and zoning decisions are moving faster than most residents can track. Impactify turns the week into one plain-English briefing, then points the user toward the representative or local action most connected to the issue.",
		sourceNote:
			"Illustrative Guardian briefing pattern + rep context (portfolio sample state).",
		actionLabel: "Read housing briefings",
		actionPath: "/news",
	},
	{
		id: "immigration",
		label: "Immigration",
		briefing:
			"Immigration coverage often leaves readers with urgency but no next step. This loop frames what changed, who is affected, and one concrete civic action a busy user can take without opening five tabs.",
		sourceNote:
			"Illustrative issue coverage + action copy (portfolio sample state).",
		actionLabel: "Open civic news",
		actionPath: "/news",
	},
	{
		id: "democracy",
		label: "Democracy",
		briefing:
			"Voting-rights and representation stories only become useful when they connect back to the person reading. Impactify pairs the briefing with a reps pathway so the user can move from context to contact.",
		sourceNote:
			"Illustrative briefing pattern + reps scorecard context (portfolio sample state).",
		actionLabel: "Find representatives",
		actionPath: "/reps",
	},
];

function getImpactifyActionHref(liveHref: string | undefined, actionPath: string) {
	if (!liveHref) {
		return undefined;
	}

	try {
		return new URL(actionPath, liveHref).toString();
	} catch {
		return liveHref;
	}
}

function hasStructuredCaseStudyContent(cs: ProjectCaseStudy): boolean {
	return Boolean(
		cs.atAGlance?.length ||
			cs.walkthrough?.length ||
			cs.persona ||
			cs.architectureLayers?.length ||
			cs.decisionCards?.length,
	);
}

function hasDecisionCardFields(card: CaseStudyDecisionCard): boolean {
	return Boolean(card.context || card.tradeOff || card.result || card.body);
}

type FadeUpProps = {
	initial: { opacity: number; y?: number };
	whileInView: { opacity: number; y?: number };
	viewport: { once: boolean };
	transition: { duration: number; ease: readonly [number, number, number, number] };
};

function SectionLabel({
	children,
	accent = "rose",
}: {
	children: ReactNode;
	accent?: "rose" | "green";
}) {
	return (
		<h3
			className={`font-mono text-[10px] uppercase tracking-[0.3em] italic opacity-80 ${
				accent === "green" ? "text-green" : "text-rose"
			}`}
		>
			{children}
		</h3>
	);
}

function FeaturedDecisionSection({
	card,
	fadeUp,
}: {
	card: CaseStudyDecisionCard;
	fadeUp: FadeUpProps;
}) {
	return (
		<section className="px-6 md:px-20 py-12 border-b border-white/5 bg-white/[0.015]">
			<motion.div {...fadeUp} className="max-w-screen-xl mx-auto space-y-5">
				<SectionLabel accent="green">Key Engineering Decision</SectionLabel>
				<DecisionCardItem card={card} />
			</motion.div>
		</section>
	);
}

function AtAGlanceSection({
	items,
	fadeUp,
}: {
	items: CaseStudyGlanceItem[];
	fadeUp: FadeUpProps;
}) {
	return (
		<section className="px-6 md:px-20 py-14 border-b border-white/5 bg-white/[0.01]">
			<div className="max-w-screen-xl mx-auto space-y-8">
				<SectionLabel>At a Glance</SectionLabel>
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
					{items.map((item) => (
						<motion.div
							key={item.label}
							{...fadeUp}
							className="rounded-sm border border-white/5 bg-white/[0.02] p-5 space-y-2"
						>
							<p className="font-mono text-[10px] uppercase tracking-[0.25em] text-rose/80">
								{item.label}
							</p>
							<p
								className={`text-sm leading-relaxed ${
									GLANCE_PROOF_LABELS.has(item.label)
										? "text-green/90 font-mono text-[11px] uppercase tracking-wider"
										: "text-muted-foreground font-light"
								}`}
							>
								{item.value}
							</p>
						</motion.div>
					))}
				</div>
			</div>
		</section>
	);
}

function PersonaSection({
	persona,
	fadeUp,
}: {
	persona: CaseStudyPersona;
	fadeUp: FadeUpProps;
}) {
	return (
		<motion.div {...fadeUp} className="space-y-6 border-t border-white/5 pt-16">
			<div className="space-y-2">
				<SectionLabel>Design Persona</SectionLabel>
				<p className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground/70">
					Not validated user research — a scenario for product decisions
				</p>
			</div>
			<div className="rounded-sm border border-white/5 bg-white/[0.02] p-6 md:p-8 space-y-5">
				<p className="font-serif text-2xl italic text-white/90">{persona.name}</p>
				<p className="font-light text-muted-foreground leading-relaxed text-sm max-w-2xl">
					{persona.summary}
				</p>
				<div className="flex flex-wrap gap-2">
					{persona.issueAreas.map((area) => (
						<span
							key={area}
							className="px-3 py-1 border border-green/20 rounded-full font-mono text-[9px] uppercase tracking-wider text-green/80"
						>
							{area}
						</span>
					))}
				</div>
				<p className="font-mono text-[10px] uppercase tracking-[0.2em] text-rose/60">
					Time budget · {persona.timeConstraint}
				</p>
			</div>
		</motion.div>
	);
}

function ImpactifyIssueLoopCard({ liveHref }: { liveHref?: string }) {
	const reduceMotion = useReducedMotion();
	const [selectedIssueId, setSelectedIssueId] = useState(IMPACTIFY_ISSUES[0].id);
	const selectedIssue =
		IMPACTIFY_ISSUES.find((issue) => issue.id === selectedIssueId) ??
		IMPACTIFY_ISSUES[0];
	const contentId = useId();
	const actionHref = getImpactifyActionHref(liveHref, selectedIssue.actionPath);
	const transition = reduceMotion
		? { duration: 0.18, ease: "easeOut" as const }
		: { duration: 0.28, ease: [0.16, 1, 0.3, 1] as const };

	return (
		<motion.div
			initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 16 }}
			whileInView={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
			viewport={{ once: true }}
			transition={transition}
			className="space-y-6 border-t border-white/5 pt-16"
		>
			<div className="space-y-2">
				<SectionLabel>Core Loop Prototype</SectionLabel>
				<p className="font-light text-muted-foreground leading-relaxed text-sm max-w-2xl">
					Pick an issue, get the briefing, then take one clear next step.
				</p>
			</div>

			<div className="rounded-sm border border-white/5 bg-white/[0.02] p-5 md:p-6 space-y-6 min-w-0 overflow-hidden">
				<div
					className="flex flex-wrap gap-3"
					role="group"
					aria-label="Select a civic issue"
				>
					{IMPACTIFY_ISSUES.slice(0, 3).map((issue) => {
						const selected = issue.id === selectedIssue.id;

						return (
							<button
								key={issue.id}
								type="button"
								aria-pressed={selected}
								aria-controls={contentId}
								onClick={() => setSelectedIssueId(issue.id)}
								className={`min-h-[44px] rounded-full border px-4 py-2 font-mono text-[10px] uppercase tracking-[0.18em] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green ${
									selected
										? "border-green/60 bg-green/15 text-green"
										: "border-white/10 bg-black/20 text-muted-foreground hover:border-rose/40 hover:text-white"
								}`}
							>
								{issue.label}
							</button>
						);
					})}
				</div>

				<div
					id={contentId}
					aria-live="polite"
					className="rounded-sm border border-white/5 bg-black/20 p-5 md:p-6 min-h-[260px] md:min-h-[236px]"
				>
					<AnimatePresence mode="wait">
						<motion.div
							key={selectedIssue.id}
							initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 8 }}
							animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
							exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
							transition={transition}
							className="space-y-5"
						>
							<div className="flex items-start justify-between gap-4">
								<div className="space-y-2">
									<p className="font-mono text-[9px] uppercase tracking-[0.24em] text-rose/70">
										Selected Issue
									</p>
									<h4 className="font-serif text-2xl italic text-white/90">
										{selectedIssue.label}
									</h4>
								</div>
								<span className="shrink-0 rounded-full border border-green/20 px-3 py-1 font-mono text-[9px] uppercase tracking-[0.18em] text-green/80">
									One action
								</span>
							</div>

							<p className="font-light text-muted-foreground leading-relaxed text-sm md:text-base break-words">
								{selectedIssue.briefing}
							</p>
							<p className="border-l border-white/10 pl-4 font-mono text-[10px] normal-case tracking-normal leading-relaxed text-white/40 break-words">
								<span className="uppercase tracking-[0.14em] text-white/30">
									Source note ·{" "}
								</span>
								{selectedIssue.sourceNote}
							</p>
							{actionHref && (
								<a
									href={actionHref}
									target="_blank"
									rel="noreferrer"
									className="inline-flex min-h-[44px] items-center justify-center gap-3 rounded-full border border-rose/30 bg-rose/5 px-5 py-3 font-mono text-[10px] uppercase tracking-widest text-rose transition-colors hover:border-rose/60 hover:bg-rose/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green"
								>
									{selectedIssue.actionLabel}
									<ArrowUpRight size={12} aria-hidden="true" />
								</a>
							)}
						</motion.div>
					</AnimatePresence>
				</div>
			</div>
		</motion.div>
	);
}

function WalkthroughSection({
	steps,
	media,
	title,
	fadeUp,
}: {
	steps: CaseStudyWalkthroughStep[];
	media: ProjectMedia;
	title: string;
	fadeUp: FadeUpProps;
}) {
	const stepMedia = [media.detail, media.hero].filter(Boolean) as string[];

	return (
		<motion.div {...fadeUp} className="space-y-10 border-t border-white/5 pt-16">
			<SectionLabel>Product Walkthrough</SectionLabel>
			<ol className="space-y-10">
				{steps.map((step, index) => {
					const visual = step.media ?? stepMedia[index];

					return (
						<li
							key={step.title}
							className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start"
						>
							<div className="md:col-span-5 space-y-4">
								<span className="font-mono text-[10px] text-rose/40">
									/0{index + 1}
								</span>
								<h4 className="font-serif text-xl italic text-white/85">
									{step.title}
								</h4>
								<p className="font-light text-muted-foreground leading-relaxed text-sm">
									{step.description}
								</p>
							</div>
							<div className="md:col-span-7 aspect-video bg-muted rounded-lg overflow-hidden border border-white/5 relative">
								{visual ? (
									<img
										src={visual}
										alt={`${title} — ${step.title}`}
										className="absolute inset-0 h-full w-full object-cover object-top grayscale hover:grayscale-0 transition-all duration-700"
										loading="lazy"
										decoding="async"
									/>
								) : (
									<CaseStudyMediaPlaceholder label={`${step.title} — screenshot soon`} />
								)}
							</div>
						</li>
					);
				})}
			</ol>
		</motion.div>
	);
}

function ArchitectureLayersSection({
	layers,
	fadeUp,
}: {
	layers: CaseStudyArchitectureLayer[];
	fadeUp: FadeUpProps;
}) {
	return (
		<motion.div {...fadeUp} className="space-y-8 border-t border-white/5 pt-16">
			<SectionLabel accent="green">Technical Architecture</SectionLabel>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				{layers.map((layer, index) => (
					<div
						key={layer.title}
						className="rounded-sm border border-white/5 bg-white/[0.02] p-5 space-y-3"
					>
						<div className="flex items-center gap-3">
							<span className="font-mono text-[10px] text-green/50">
								{String(index + 1).padStart(2, "0")}
							</span>
							<h4 className="font-mono text-[10px] uppercase tracking-[0.2em] text-green/90">
								{layer.title}
							</h4>
						</div>
						<p className="font-light text-muted-foreground leading-relaxed text-sm">
							{layer.description}
						</p>
					</div>
				))}
			</div>
		</motion.div>
	);
}

function DecisionCardItem({ card }: { card: CaseStudyDecisionCard }) {
	if (!hasDecisionCardFields(card)) {
		return (
			<div className="rounded-sm border border-white/5 bg-white/[0.02] p-5 space-y-3">
				<h4 className="font-serif text-lg italic text-white/85">{card.title}</h4>
			</div>
		);
	}

	return (
		<div className="rounded-sm border border-white/5 bg-white/[0.02] p-5 md:p-6 space-y-4">
			<dl className="space-y-3 text-sm">
				<div>
					<dt className="font-mono text-[9px] uppercase tracking-[0.2em] text-rose/70 mb-1">
						Decision
					</dt>
					<dd className="font-serif text-lg italic text-white/85">{card.title}</dd>
				</div>
				{card.context && (
					<div>
						<dt className="font-mono text-[9px] uppercase tracking-[0.2em] text-rose/70 mb-1">
							Context
						</dt>
						<dd className="font-light text-muted-foreground leading-relaxed">
							{card.context}
						</dd>
					</div>
				)}
				{card.tradeOff && (
					<div className="border-l-2 border-amber-500/40 pl-4">
						<dt className="font-mono text-[9px] uppercase tracking-[0.2em] text-amber-200/80 mb-1">
							Trade-off
						</dt>
						<dd className="font-light text-muted-foreground leading-relaxed">
							{card.tradeOff}
						</dd>
					</div>
				)}
				{card.result && (
					<div>
						<dt className="font-mono text-[9px] uppercase tracking-[0.2em] text-green/70 mb-1">
							Result
						</dt>
						<dd className="font-light text-muted-foreground leading-relaxed">
							{card.result}
						</dd>
					</div>
				)}
				{card.body && (
					<div>
						<dt className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground/70 mb-1">
							Notes
						</dt>
						<dd className="font-light text-muted-foreground leading-relaxed">
							{card.body}
						</dd>
					</div>
				)}
			</dl>
		</div>
	);
}

function DecisionCardsSection({
	cards,
	fadeUp,
}: {
	cards: CaseStudyDecisionCard[];
	fadeUp: FadeUpProps;
}) {
	return (
		<motion.div {...fadeUp} className="space-y-8">
			<SectionLabel>Engineering Decisions</SectionLabel>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				{cards.map((card) => (
					<DecisionCardItem key={card.title} card={card} />
				))}
			</div>
		</motion.div>
	);
}

function CaseStudyMediaPlaceholder({ label }: { label: string }) {
	return (
		<>
			<div className="absolute inset-0 bg-rose/5 mix-blend-multiply" />
			<div className="absolute inset-0 opacity-[0.18] bg-[linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:28px_28px]" />
			<div className="relative flex h-full w-full items-center justify-center">
				<p className="text-[10px] uppercase tracking-[0.28em] font-mono text-muted-foreground">
					{label}
				</p>
			</div>
		</>
	);
}

function CaseStudyHeroMedia({
	media,
	title,
}: {
	media: ProjectMedia;
	title: string;
}) {
	const reduceMotion = useReducedMotion();
	const [videoError, setVideoError] = useState(false);
	const staticFrame = media.poster ?? media.hero;
	const alt = media.alt ?? `${title} hero`;
	const motionClass = reduceMotion
		? "absolute inset-0 h-full w-full object-cover object-top"
		: "absolute inset-0 h-full w-full object-cover object-top grayscale hover:grayscale-0 transition-all duration-1000 scale-105 group-hover:scale-100";
	const canPlayVideo = Boolean(media.video && !videoError);

	if (canPlayVideo) {
		if (reduceMotion) {
			if (staticFrame) {
				return (
					<img
						src={staticFrame}
						alt={alt}
						className={motionClass}
						loading="eager"
						decoding="async"
					/>
				);
			}

			return (
				<CaseStudyMediaPlaceholder label="Product demo" />
			);
		}

		return (
			<>
				{!staticFrame && <CaseStudyMediaPlaceholder label="" />}
				<video
					src={media.video}
					poster={staticFrame}
					controls
					preload="none"
					playsInline
					aria-label={`${title} demo video`}
					onError={() => setVideoError(true)}
					className={`${motionClass} z-[1]`}
				/>
				{!staticFrame && (
					<div className="pointer-events-none absolute inset-0 z-[2] flex flex-col items-center justify-center gap-4">
						<div className="rounded-full border border-white/10 bg-black/35 p-4 backdrop-blur-sm">
							<Play size={22} className="text-rose/80" fill="currentColor" />
						</div>
						<p className="font-mono text-[10px] uppercase tracking-[0.28em] text-white/45">
							Product demo · press play
						</p>
					</div>
				)}
			</>
		);
	}

	if (staticFrame) {
		return (
			<img
				src={staticFrame}
				alt={alt}
				className={motionClass}
				loading="eager"
				decoding="async"
			/>
		);
	}

	if (media.video && videoError) {
		return <CaseStudyMediaPlaceholder label="Demo video unavailable" />;
	}

	return <CaseStudyMediaPlaceholder label="Screenshot coming soon" />;
}

export default function CaseStudy() {
	const { slug } = useParams();
	const project = slug ? getProject(slug) : undefined;
	const reduceMotion = useReducedMotion();

	useEffect(() => {
		window.scrollTo(0, 0);
	}, [slug]);

	if (!project) {
		return <NotFound />;
	}

	const nextProjectKey = getNextProjectSlug(project.slug);
	const nextProject = getProject(nextProjectKey);

	if (!nextProject) {
		return <NotFound />;
	}

	const { caseStudy: cs, media, links, metrics } = project;
	const hasStructuredContent = hasStructuredCaseStudyContent(cs);
	const featuredDecision =
		cs.featuredDecisionTitle && cs.decisionCards?.length
			? cs.decisionCards.find((card) => card.title === cs.featuredDecisionTitle)
			: undefined;

	// Framer Motion Variants for smooth entrance
	const fadeUp = reduceMotion
		? {
				initial: { opacity: 0 },
				whileInView: { opacity: 1 },
				viewport: { once: true },
				transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] as const },
			}
		: {
				initial: { opacity: 0, y: 20 },
				whileInView: { opacity: 1, y: 0 },
				viewport: { once: true },
				transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const },
			};

	return (
		<AnimatePresence mode="wait">
			<motion.main
				key={slug}
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				exit={{ opacity: 0 }}
				className="bg-background text-foreground min-h-screen overflow-x-hidden selection:bg-rose/30 pb-20"
			>
				{/* ── GHOST NAV ── */}
				<nav className="fixed top-0 left-0 w-full z-50 p-6 md:p-10 flex justify-between items-start mix-blend-difference pointer-events-none">
					<Link
						to="/#work"
						className="pointer-events-auto group flex items-center gap-4 font-mono text-[10px] uppercase tracking-[0.4em] text-rose/60 hover:text-rose transition-all duration-500"
					>
						<span className="h-[1px] w-8 bg-rose/30 group-hover:w-12 group-hover:bg-rose transition-all" />
						Back to Work
					</Link>
				</nav>

				{/* ── HERO SECTION ── */}
				<header className="relative pt-40 md:pt-60 px-6 md:px-20 mb-20 max-w-full">
					<motion.div {...fadeUp}>
						<span className="section-label mb-6 block max-w-full font-mono text-rose uppercase tracking-[0.3em] md:tracking-[0.5em] text-pretty">
							{project.category} — {project.year}
						</span>
						<h1 className="max-w-full text-[11vw] sm:text-[10vw] md:text-[9vw] font-serif italic leading-[0.85] mb-12 tracking-tighter break-words">
							{project.title}
						</h1>
						<p className="max-w-2xl text-xl md:text-2xl font-light text-muted-foreground italic border-l border-rose/20 pl-8 mb-12">
							{project.tagline}
						</p>
					</motion.div>

					{/* 1. CINEMATIC HERO IMAGE/VIDEO */}
					<motion.div
						initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.95 }}
						animate={reduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1 }}
						transition={reduceMotion ? { duration: 0.2 } : { duration: 1.2, ease: "easeOut" }}
						className="relative w-full aspect-[21/9] bg-muted rounded-sm overflow-hidden group border border-white/5"
					>
						<CaseStudyHeroMedia media={media} title={project.title} />
					</motion.div>
				</header>

				{metrics && metrics.length > 0 && (
					<div className="px-6 md:px-20 py-10 border-y border-white/5 bg-white/[0.01]">
						<div className="max-w-screen-xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
							{metrics.map((m) => (
								<div key={m.label} className="space-y-1">
									<p className="font-mono text-3xl md:text-4xl font-bold text-white tracking-tighter">
										{m.value}
									</p>
									<p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/50 mt-1">
										{m.label}
									</p>
								</div>
							))}
						</div>
					</div>
				)}

				{cs.atAGlance && cs.atAGlance.length > 0 && (
					<AtAGlanceSection items={cs.atAGlance} fadeUp={fadeUp} />
				)}

				{featuredDecision && (
					<FeaturedDecisionSection card={featuredDecision} fadeUp={fadeUp} />
				)}

				{/* ── NARRATIVE GRID ── */}
				<section className="px-6 md:px-20 py-20 grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-20 max-w-full">
					{/* Metadata Sidebar */}
					<aside className="md:col-span-4 space-y-16 min-w-0">
						<div className="space-y-4">
							<h3 className="font-mono text-[10px] uppercase tracking-[0.3em] text-rose italic opacity-80">
								Tech Stack
							</h3>
							<div className="flex flex-wrap gap-2">
								{project.stack.map((tech) => (
									<span
										key={tech}
										className="px-3 py-1 border border-white/10 rounded-full font-mono text-[9px] uppercase tracking-wider text-muted-foreground"
									>
										{tech}
									</span>
								))}
							</div>
						</div>
						<div className="space-y-4">
							<h3 className="font-mono text-[10px] uppercase tracking-[0.3em] text-rose italic opacity-80">
								Role
							</h3>
							<p className="font-serif text-lg italic opacity-70 leading-relaxed">
								{project.role}
							</p>
						</div>
						<div className="space-y-3 pt-4 border-t border-white/5">
							{links.live && (
								<a
									href={links.live}
									target="_blank"
									rel="noreferrer"
									className="group inline-flex items-center gap-3 px-5 py-3 rounded-full border border-rose/30 bg-rose/5 hover:bg-rose/10 hover:border-rose/60 w-full justify-center text-rose font-mono text-[11px] uppercase tracking-widest transition-all duration-300"
								>
									<span
										className={`w-1.5 h-1.5 rounded-full bg-rose ${reduceMotion ? "" : "animate-pulse"}`}
									/>
									View Live Site
									<ArrowUpRight
										size={12}
										className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
									/>
								</a>
							)}
							{links.github && (
								<a
									href={links.github}
									target="_blank"
									rel="noreferrer"
									className="inline-flex items-center justify-center gap-2 w-full font-mono text-[10px] uppercase tracking-widest text-white/30 hover:text-white/60 transition-colors py-2"
								>
									<GitBranch size={10} />
									Source Code
								</a>
							)}
						</div>
					</aside>

					{/* Main Story Content */}
					<div className="md:col-span-8 space-y-20 min-w-0">
						{hasStructuredContent && (
							<motion.div {...fadeUp} className="space-y-6">
								<SectionLabel>Product Thesis</SectionLabel>
								<p className="text-2xl md:text-3xl font-serif italic leading-relaxed text-white/90">
									{cs.thesis}
								</p>
							</motion.div>
						)}

						{/* 2. THE FEATURE SPLIT: TEXT + VISUAL */}
						<div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
							<motion.div {...fadeUp} className="space-y-6">
								<SectionLabel>
									{hasStructuredContent ? "The Problem" : "The Vision"}
								</SectionLabel>
								<p className="text-2xl md:text-3xl font-serif italic leading-relaxed">
									{hasStructuredContent
										? cs.problem
										: `${cs.problem.split(".")[0]}.`}
								</p>
							</motion.div>

							<motion.div
								{...fadeUp}
								className="aspect-video bg-muted rounded-lg overflow-hidden border border-white/5 relative group"
							>
								{media.detail ? (
									<img
										src={media.detail}
										alt={media.alt ?? `${project.title} product detail`}
										className="absolute inset-0 h-full w-full object-cover object-top-left grayscale hover:grayscale-0 transition-all duration-700"
										loading="lazy"
										decoding="async"
									/>
								) : (
									<>
										<div className="absolute inset-0 opacity-[0.16] bg-[linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:28px_28px]" />
										<div className="relative z-[1] flex h-full w-full items-center justify-center">
											<p className="text-[10px] uppercase tracking-[0.28em] font-mono text-muted-foreground">
												Detail shot coming soon
											</p>
										</div>
										<div className="absolute inset-0 z-[2] flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
											<div className="rounded-full bg-rose/80 p-4 text-background backdrop-blur-sm">
												<Play size={20} fill="currentColor" />
											</div>
										</div>
									</>
								)}
							</motion.div>
						</div>

						{cs.persona && (
							<PersonaSection persona={cs.persona} fadeUp={fadeUp} />
						)}

						{hasStructuredContent && (
							<motion.div {...fadeUp} className="space-y-6 border-t border-white/5 pt-16">
								<SectionLabel>The Solution</SectionLabel>
								<p className="font-light text-muted-foreground leading-relaxed max-w-3xl text-base">
									{cs.solution}
								</p>
							</motion.div>
						)}

						{project.slug === "impactify" && (
							<ImpactifyIssueLoopCard liveHref={links.live} />
						)}

						{cs.walkthrough && cs.walkthrough.length > 0 && (
							<WalkthroughSection
								steps={cs.walkthrough}
								media={media}
								title={project.title}
								fadeUp={fadeUp}
							/>
						)}

						{/* 3. DOUBLE SPREAD: MOBILE/DESKTOP OR TWO SCREENS // UNCOMMENT WHEN IMAGES ARE READY */}
						{/* <div className="space-y-12">
							<h3 className="font-mono text-[10px] uppercase tracking-[0.3em] text-rose italic opacity-80 text-center">
								Interface Dynamics
							</h3>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								<motion.div
									{...fadeUp}
									className="aspect-[4/5] bg-card rounded-md border border-white/5 overflow-hidden"
								>
									<div className="relative h-full w-full flex items-center justify-center bg-white/[0.02]">
										<p className="text-[10px] uppercase tracking-[0.28em] font-mono text-muted-foreground">
											Mobile screenshot soon
										</p>
									</div>
								</motion.div>
								<motion.div
									{...fadeUp}
									className="aspect-[4/5] bg-card rounded-md border border-white/5 overflow-hidden"
								>
									<div className="relative h-full w-full flex items-center justify-center bg-white/[0.02]">
										<p className="text-[10px] uppercase tracking-[0.28em] font-mono text-muted-foreground">
											Desktop screenshot soon
										</p>
									</div>
								</motion.div>
							</div>
						</div> */}

						<div className="space-y-16 pt-16 border-t border-white/5">
							{(() => {
								const remainingDecisions = cs.decisionCards?.filter(
									(card) => card.title !== cs.featuredDecisionTitle,
								);

								if (remainingDecisions && remainingDecisions.length > 0) {
									return (
										<DecisionCardsSection
											cards={remainingDecisions}
											fadeUp={fadeUp}
										/>
									);
								}

								if (!cs.featuredDecisionTitle && cs.decisionCards?.length) {
									return (
										<DecisionCardsSection
											cards={cs.decisionCards}
											fadeUp={fadeUp}
										/>
									);
								}

								if (!cs.decisionCards?.length) {
									return (
										<div className="space-y-6">
											<SectionLabel>Engineering Decisions</SectionLabel>
											<p className="font-light text-muted-foreground leading-relaxed max-w-3xl text-base">
												{cs.decisions}
											</p>
										</div>
									);
								}

								return null;
							})()}

							{cs.architectureLayers && cs.architectureLayers.length > 0 && (
								<ArchitectureLayersSection
									layers={cs.architectureLayers}
									fadeUp={fadeUp}
								/>
							)}

							<div className="grid grid-cols-1 md:grid-cols-2 gap-12 border-t border-white/5 pt-12">
								<div className="space-y-4">
									<SectionLabel>UX Philosophy</SectionLabel>
									<p className="font-light text-muted-foreground leading-relaxed text-sm">
										{cs.ux}
									</p>
								</div>
								<div className="space-y-4">
									<SectionLabel accent="green">Performance</SectionLabel>
									<p className="font-light text-muted-foreground leading-relaxed text-sm">
										{cs.performance}
									</p>
								</div>
							</div>
						</div>
					</div>
				</section>

				<section className="px-6 md:px-20 py-14 border-t border-white/5 max-w-screen-xl mx-auto">
					<div className="grid grid-cols-1 md:grid-cols-12 gap-20">
						<div className="md:col-span-4 space-y-4">
							<h3 className="font-mono text-[10px] uppercase tracking-[0.3em] text-green italic opacity-80">
								Impact
							</h3>
							<p className="font-serif text-xl italic leading-relaxed text-muted-foreground">
								{cs.impact}
							</p>
						</div>
						<div className="md:col-span-8 space-y-8">
							<h3 className="font-mono text-[10px] uppercase tracking-[0.3em] text-rose italic opacity-80">
								Retrospective
							</h3>
							<ul className="space-y-6">
								{cs.lessons.map((lesson, i) => (
									<li
										key={i}
										className="flex gap-6 items-start border-b border-white/5 pb-6 last:border-0"
									>
										<span className="font-mono text-[10px] text-rose/40 mt-1 shrink-0">
											/0{i + 1}
										</span>
										<p className="text-sm font-light text-muted-foreground leading-relaxed">
											{lesson}
										</p>
									</li>
								))}
							</ul>
						</div>
					</div>
				</section>

				{cs.nextSteps && (
					<section className="px-6 md:px-20 py-16 border-t border-white/5">
						<div className="max-w-screen-xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12">
							<div className="md:col-span-4">
								<h3 className="font-mono text-[10px] uppercase tracking-[0.3em] text-rose/60 italic mb-4">
									If I Had More Time
								</h3>
								<p className="font-serif text-2xl italic text-white/70 leading-relaxed">
									What comes next.
								</p>
							</div>
							<div className="md:col-span-8">
								<p className="font-light text-muted-foreground leading-relaxed text-sm border-l border-white/10 pl-8">
									{cs.nextSteps}
								</p>
							</div>
						</div>
					</section>
				)}

				{/* ── NEXT PROJECT FOOTER ── */}
				<footer className="relative py-60 px-6 overflow-hidden border-t border-white/5 group mt-40">
					<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[25vw] font-serif italic text-white/[0.015] whitespace-nowrap select-none pointer-events-none transition-transform duration-1000 group-hover:scale-110">
						{nextProject.title}
					</div>

					<div className="relative z-10 max-w-screen-xl mx-auto text-center">
						<span className="section-label mb-10 block font-mono text-rose/60">
							Next Journey
						</span>
						<Link
							to={`/projects/${nextProjectKey}`}
							className="group relative inline-block"
						>
							<h2 className="text-7xl md:text-[9vw] font-serif italic leading-none transition-all duration-700 group-hover:text-rose">
								{nextProject.title}
							</h2>
							<div className="mt-10 flex flex-col items-center">
								<div className="h-[1px] w-12 bg-rose transition-all duration-700 group-hover:w-48" />
								<div className="mt-6 font-mono text-[10px] uppercase tracking-[0.6em] opacity-40 group-hover:opacity-100 group-hover:translate-y-2 transition-all">
									Discover More
								</div>
							</div>
						</Link>
					</div>
				</footer>
			</motion.main>
		</AnimatePresence>
	);
}
