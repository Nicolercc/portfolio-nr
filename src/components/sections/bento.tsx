import { useState, useRef, useCallback, useEffect } from "react";
import {
	motion,
	useInView,
	useMotionValue,
	useTransform,
	animate,
	AnimatePresence,
	type PanInfo,
} from "framer-motion";
import {
	BENTO_BIO as BIO,
	BENTO_HOBBIES as HOBBIES,
	type BentoHobby,
} from "../../data/about";
import "./bento.css";

/* ─────────────────────────────────────────────
   DESIGN TOKENS
───────────────────────────────────────────── */
const T = {
	bg: "#0D0D0D",
	fg: "#F5F0E8",
	rose: "#D4849A",
	green: "#4ADE80",
	card: "#141414",
	border: "rgba(255,255,255,0.08)",
	muted: "rgba(245,240,232,0.45)",
	mutedLo: "rgba(245,240,232,0.2)",
} as const;

/** Card deck drag / layout tuning */
const CARD = {
	dismissThresholdPx: 85,
	dismissDistancePx: 500,
	dismissLiftPx: -50,
	dismissDurationSec: 0.38,
	dismissEase: [0.36, 0, 0.66, -0.56] as const,
	minHeightPx: 230,
	depthScaleStep: 0.045,
	depthYOffsetPx: 10,
	bgBase: 20,
	bgPerDepth: 8,
	rotateInputRange: [-220, 0, 220] as const,
	rotateOutputDeg: [-22, 0, 22] as const,
	opacityInputRange: [-160, -60, 0, 60, 160] as const,
	roseOverlayRange: [0, -100] as const,
	greenOverlayRange: [0, 100] as const,
} as const;

/* ─────────────────────────────────────────────────────────────────────────────
   DATA — paste this into src/data/about.ts and update BENTO_BIO

   export const BENTO_BIO = {
     eyebrow: "About me",
     name: "I'm Nicole,",
     role: "full stack developer",
     paragraphs: [
       "NYC-based, Dominican Republic-raised. I build web products that are as thoughtful as they look — clean architecture, intentional UI, real performance.",
       "I care about technology that actually does something. When I'm not writing code I'm filming, hiking somewhere with no signal, or island hopping back to my roots.",
     ],
     tagline: "I make things. Usually with code. Sometimes with clay & paint.",
     links: [
       { label: "LinkedIn", href: "https://www.linkedin.com/in/nicolerodriguezz/" },
       { label: "GitHub",   href: "https://github.com/Nicolercc" },
       { label: "X",        href: "#" },
     ],
   };
─────────────────────────────────────────────────────────────────────────────── */

/* ─────────────────────────────────────────────
   TYPING EFFECT HOOK
───────────────────────────────────────────── */
function useTypingEffect(text: string, speed = 40, start = true): string {
	const [displayed, setDisplayed] = useState("");

	useEffect(() => {
		if (!start) return;
		setDisplayed("");
		let i = 0;
		const id = setInterval(() => {
			i++;
			setDisplayed(text.slice(0, i));
			if (i >= text.length) clearInterval(id);
		}, speed);
		return () => clearInterval(id);
	}, [text, speed, start]);

	return displayed;
}

/* ─────────────────────────────────────────────
   SOCIAL PILL
───────────────────────────────────────────── */
function SocialPill({ label, href }: { label: string; href: string }) {
	return (
		<a
			href={href}
			target="_blank"
			rel="noopener noreferrer"
			className="group inline-flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-transparent px-[15px] py-1.5 text-[0.78rem] font-medium tracking-wide no-underline transition-all duration-[220ms] hover:border-[#D4849A] hover:bg-[rgba(212,132,154,0.08)] hover:text-[#D4849A]"
			style={{
				fontFamily: "'DM Sans', sans-serif",
				color: "rgba(245,240,232,0.45)",
			}}
		>
			<span className="h-1 w-1 shrink-0 rounded-full bg-[rgba(245,240,232,0.2)] transition-colors group-hover:bg-[#D4849A]" />
			{label}
		</a>
	);
}

/* ─────────────────────────────────────────────
   ANIMATED ORB AVATAR
───────────────────────────────────────────── */
function BlobOrb() {
	return (
		<div className="bento__blobOrb">
			<motion.div
				className="bento__blobOrb-spin"
				animate={{ rotate: 360 }}
				transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
				style={{ willChange: "transform" }}
			/>
			<div className="bento__blobOrb-inner">🌺</div>
		</div>
	);
}

/* ─────────────────────────────────────────────
   STRATEGY CARD
   Updated: concrete copy replacing vague buzzwords.
───────────────────────────────────────────── */
function StrategyCard() {
	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true }}
			className="relative group overflow-hidden rounded-3xl border border-white/5 bg-zinc-900/40 p-7 h-full flex flex-col justify-between transition-colors hover:border-[rgba(212,132,154,0.2)]"
		>
			{/* Decorative background monogram */}
			<div
				className="pointer-events-none absolute right-0 top-0 p-4 opacity-10 transition-opacity group-hover:opacity-20"
				aria-hidden="true"
			>
				<span
					className="text-6xl italic"
					style={{ fontFamily: "'Cormorant Garamond', serif" }}
				>
					NR
				</span>
			</div>

			<div>
				<div className="mb-6 flex items-center gap-2">
					<span
						className="h-1.5 w-1.5 rounded-full bg-[#D4849A]"
						style={{ boxShadow: "0 0 8px #D4849A" }}
					/>
					<span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#D4849A]">
						Background
					</span>
				</div>

				<h3
					className="mb-4 text-2xl leading-tight"
					style={{ fontFamily: "'Cormorant Garamond', serif" }}
				>
					BA in Media &amp; Politics —{" "}
					<span className="italic" style={{ color: "#D4849A" }}>
						the other half
					</span>{" "}
					of the stack
				</h3>

				<p className="max-w-sm text-sm font-light leading-relaxed text-[rgba(245,240,232,0.45)]">
					I build interfaces with the same principles as good journalism:{" "}
					<strong className="font-medium text-[rgba(245,240,232,0.85)]">
						clarity
					</strong>
					,{" "}
					<strong className="font-medium text-[rgba(245,240,232,0.85)]">
						accessibility
					</strong>
					, and zero tolerance for dark patterns. My degree isn't a detour —
					it's why I understand the people using what I build.
				</p>
			</div>

			<div className="mt-8 flex items-center justify-between border-t border-white/5 pt-6">
				<span className="font-mono text-[9px] uppercase tracking-widest text-white/20">
					Engineer × Media Specialist
				</span>
				<div className="flex -space-x-2">
					<div className="flex h-6 w-6 items-center justify-center rounded-full border border-[rgba(212,132,154,0.4)] bg-[rgba(212,132,154,0.2)] text-[10px]">
						📰
					</div>
					<div className="flex h-6 w-6 items-center justify-center rounded-full border border-[rgba(74,222,128,0.4)] bg-[rgba(74,222,128,0.2)] text-[10px]">
						💻
					</div>
				</div>
			</div>
		</motion.div>
	);
}

/* ─────────────────────────────────────────────
   DRAGGABLE CARD
───────────────────────────────────────────── */
function DraggableCard({
	hobby,
	depth,
	total,
	currentIndex,
	onDismiss,
}: {
	hobby: BentoHobby;
	depth: number;
	total: number;
	currentIndex: number;
	onDismiss: () => void;
}) {
	const x = useMotionValue(0);
	const y = useMotionValue(0);
	const mountedRef = useRef(true);

	useEffect(() => {
		mountedRef.current = true;
		return () => {
			mountedRef.current = false;
		};
	}, []);

	const cardRotate = useTransform(
		x,
		[...CARD.rotateInputRange],
		[CARD.rotateOutputDeg[0], hobby.rot, CARD.rotateOutputDeg[2]],
	);
	const cardOpacity = useTransform(
		x,
		[...CARD.opacityInputRange],
		[0, 1, 1, 1, 0],
	);
	const roseOverlay = useTransform(x, [...CARD.roseOverlayRange], [0, 0.2]);
	const greenOverlay = useTransform(x, [...CARD.greenOverlayRange], [0, 0.2]);

	const isTop = depth === 0;
	const scale = 1 - depth * CARD.depthScaleStep;
	const yOffset = depth * CARD.depthYOffsetPx;
	const bgVal = CARD.bgBase + depth * CARD.bgPerDepth;

	const handleDragEnd = useCallback(
		(_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
			if (Math.abs(info.offset.x) > CARD.dismissThresholdPx) {
				const dir = info.offset.x > 0 ? 1 : -1;
				void animate(x, dir * CARD.dismissDistancePx, {
					duration: CARD.dismissDurationSec,
					ease: CARD.dismissEase,
					onComplete: () => {
						if (mountedRef.current) onDismiss();
					},
				});
				void animate(y, CARD.dismissLiftPx, {
					duration: CARD.dismissDurationSec,
					ease: CARD.dismissEase,
				});
			} else {
				void animate(x, 0, { type: "spring", stiffness: 320, damping: 30 });
				void animate(y, 0, { type: "spring", stiffness: 320, damping: 30 });
			}
		},
		[x, y, onDismiss],
	);

	return (
		<motion.div
			style={{
				position: "absolute",
				width: "100%",
				x: isTop ? x : 0,
				y: isTop ? y : yOffset,
				rotate: isTop ? cardRotate : hobby.rot,
				scale,
				zIndex: 10 - depth,
				opacity: isTop ? cardOpacity : 1,
				top: isTop ? 0 : undefined,
				cursor: isTop ? "grab" : "default",
			}}
			animate={{ scale, y: isTop ? 0 : yOffset }}
			transition={{ type: "spring", stiffness: 200, damping: 24 }}
			drag={isTop ? "x" : false}
			dragConstraints={{ left: 0, right: 0 }}
			dragElastic={0.9}
			onDragEnd={isTop ? handleDragEnd : undefined}
			whileTap={isTop ? { cursor: "grabbing" } : undefined}
			role={isTop ? "group" : undefined}
			aria-hidden={!isTop}
			aria-label={
				isTop
					? `${hobby.title}. Drag sideways or use arrow buttons to change card.`
					: undefined
			}
		>
			<div
				className={`relative select-none overflow-hidden rounded-[20px] border px-6 pb-[22px] pt-[26px] ${
					isTop
						? "shadow-[0_28px_70px_rgba(0,0,0,0.6),inset_0_2px_0_rgba(255,255,255,0.04)]"
						: "shadow-[0_8px_24px_rgba(0,0,0,0.4)]"
				}`}
				style={{
					background: `rgb(${bgVal},${bgVal},${bgVal})`,
					borderColor: T.border,
					minHeight: CARD.minHeightPx,
				}}
			>
				{/* Drag tint overlays — top card only */}
				{isTop && (
					<>
						<motion.div
							className="pointer-events-none absolute inset-0 rounded-[20px]"
							style={{ background: T.rose, opacity: roseOverlay }}
						/>
						<motion.div
							className="pointer-events-none absolute inset-0 rounded-[20px]"
							style={{ background: T.green, opacity: greenOverlay }}
						/>
					</>
				)}

				{/* Shimmer top line */}
				<div
					className="absolute left-[15%] right-[15%] top-0 h-px"
					style={{
						background: `linear-gradient(90deg, transparent, ${hobby.accent}55, transparent)`,
					}}
				/>

				{/* Tag chip */}
				<div
					className="mb-4 inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5"
					style={{
						borderColor: `${hobby.accent}33`,
						background: `${hobby.accent}0F`,
					}}
				>
					<span
						className="h-[5px] w-[5px] rounded-full"
						style={{
							background: hobby.accent,
							boxShadow: `0 0 6px ${hobby.accent}`,
						}}
					/>
					<span
						className="font-mono text-[0.63rem] uppercase tracking-[0.1em]"
						style={{ color: hobby.accent }}
					>
						{hobby.tag}
					</span>
				</div>

				{/* Icon */}
				<div className="mb-3.5 text-[34px] leading-none" aria-hidden="true">
					{hobby.icon}
				</div>

				{/* Title */}
				<p
					className="mb-2 text-[1.3rem] font-semibold leading-tight tracking-tight"
					style={{
						fontFamily: "'Cormorant Garamond', serif",
						color: T.fg,
					}}
				>
					{hobby.title}
				</p>

				{/* Description */}
				<p
					className="m-0 text-[0.81rem] leading-[1.65]"
					style={{
						fontFamily: "'DM Sans', sans-serif",
						color: T.muted,
					}}
				>
					{hobby.desc}
				</p>

				{/* Counter */}
				<div
					className="absolute bottom-4 right-[18px] font-mono text-[0.6rem] tracking-[0.07em]"
					style={{ color: T.mutedLo }}
					aria-label={`Card ${currentIndex + 1} of ${total}`}
				>
					{String(currentIndex + 1).padStart(2, "0")} /{" "}
					{String(total).padStart(2, "0")}
				</div>
			</div>
		</motion.div>
	);
}

/* ─────────────────────────────────────────────
   CARD DECK
───────────────────────────────────────────── */
function CardDeck() {
	const [topIndex, setTopIndex] = useState(0);
	const total = HOBBIES.length;

	const advance = useCallback(() => {
		setTopIndex((prev) => (prev + 1) % total);
	}, [total]);

	const retreat = useCallback(() => {
		setTopIndex((prev) => (prev - 1 + total) % total);
	}, [total]);

	const visibleDepths = [3, 2, 1, 0];
	const stackCards = visibleDepths.map((depth) => {
		const idx = (topIndex + depth) % total;
		return { hobby: HOBBIES[idx], depth, hobbyIndex: idx };
	});

	return (
		<div className="flex flex-col items-center gap-6">
			<div
				className="bento__deckWrap"
				role="region"
				aria-label="Hobbies. Swipe the top card or use the controls to browse."
			>
				<AnimatePresence mode="sync">
					{stackCards.map(({ hobby, depth, hobbyIndex }) => (
						<DraggableCard
							key={hobby.title}
							hobby={hobby}
							depth={depth}
							total={total}
							currentIndex={hobbyIndex}
							onDismiss={advance}
						/>
					))}
				</AnimatePresence>
			</div>

			{/* Controls */}
			<div
				className="flex items-center gap-[18px]"
				role="toolbar"
				aria-label="Hobby card controls"
			>
				<motion.button
					type="button"
					aria-label="Previous hobby card"
					onClick={retreat}
					whileHover={{ scale: 1.08, borderColor: T.rose }}
					whileTap={{ scale: 0.94 }}
					className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-white/[0.08] bg-transparent text-base text-[#D4849A] outline-none"
				>
					←
				</motion.button>

				<div
					className="flex items-center gap-1.5"
					role="tablist"
					aria-label="Select hobby"
				>
					{HOBBIES.map((h, i) => {
						const active = i === topIndex;
						return (
							<motion.button
								key={h.title}
								type="button"
								role="tab"
								aria-selected={active}
								aria-label={`Show ${h.title}`}
								onClick={() => setTopIndex(i)}
								animate={{
									width: active ? 18 : 5,
									background: active ? T.green : T.mutedLo,
									boxShadow: active ? `0 0 8px ${T.green}` : "none",
								}}
								transition={{ type: "spring", stiffness: 300, damping: 28 }}
								className="h-[5px] cursor-pointer rounded-full border-0 p-0 outline-none"
							/>
						);
					})}
				</div>

				<motion.button
					type="button"
					aria-label="Next hobby card"
					onClick={advance}
					whileHover={{ scale: 1.08, borderColor: T.green }}
					whileTap={{ scale: 0.94 }}
					className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-white/[0.08] bg-transparent text-base text-[#4ADE80] outline-none"
				>
					→
				</motion.button>
			</div>

			<p className="bento__hint">drag or tap arrows to shuffle</p>
		</div>
	);
}

/* ─────────────────────────────────────────────
   MAIN EXPORT
───────────────────────────────────────────── */
export default function BentoSection() {
	const sectionRef = useRef<HTMLElement>(null);
	const inView = useInView(sectionRef, { once: true, margin: "-80px" });
	const tagline = useTypingEffect(BIO.tagline, 40, inView);

	return (
		<section
			ref={sectionRef}
			id="about"
			className="bento"
			style={
				{
					"--bento-bg": T.bg,
					"--bento-fg": T.fg,
					"--bento-rose": T.rose,
					"--bento-green": T.green,
					"--bento-muted": T.muted,
					"--bento-mutedLo": T.mutedLo,
				} as React.CSSProperties
			}
		>
			<div className="bento__gridBg" aria-hidden="true" />
			<div className="bento__glowRose" aria-hidden="true" />
			<div className="bento__glowGreen" aria-hidden="true" />

			<div className="bento__container">
				{/* ── LEFT: Bio ── */}
				<motion.div
					initial={{ opacity: 0, x: -28 }}
					animate={inView ? { opacity: 1, x: 0 } : {}}
					transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
					className="bento__col"
				>
					<BlobOrb />

					<p className="bento__eyebrow">{BIO.eyebrow}</p>
					<h2 className="bento__h2 bento__name">{BIO.name}</h2>
					<h2 className="bento__h2 bento__role">{BIO.role}</h2>

					{BIO.paragraphs.map((p, i) => (
						<p key={i} className="bento__p">
							{p}
						</p>
					))}

					<div className="bento__taglineBox">
						<p className="bento__taglineText">
							{tagline}
							<motion.span
								animate={{ opacity: [1, 0, 1] }}
								transition={{ duration: 0.85, repeat: Infinity }}
								className="ml-0.5 inline-block w-0.5 align-middle"
								style={{ height: "0.85em", background: T.rose }}
								aria-hidden="true"
							/>
						</p>
					</div>

					<div className="bento__socialRow">
						{BIO.links.map((l) => (
							<SocialPill key={l.label} {...l} />
						))}
					</div>
				</motion.div>

				{/* ── RIGHT: Deck + Strategy Card ── */}
				<motion.div
					initial={{ opacity: 0, y: 32 }}
					animate={inView ? { opacity: 1, y: 0 } : {}}
					transition={{ delay: 0.25, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
					className="bento__col"
				>
					<p className="bento__rightLabel">// what I love</p>
					<div className="bento__rightStack">
						<CardDeck />
						<div className="bento__strategyWrap">
							<StrategyCard />
						</div>
					</div>
				</motion.div>
			</div>
		</section>
	);
}

export { BentoSection as Bento };
