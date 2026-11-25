import { useState, useRef, useCallback, useEffect } from "react";
import { motion, useInView, useMotionValue, useTransform, animate, AnimatePresence, type PanInfo } from "framer-motion";
import { useReducedMotion } from "../../lib/motionPreference";
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
	muted: "rgba(245,240,232,0.62)",
	mutedLo: "rgba(245,240,232,0.55)",
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


/* ─────────────────────────────────────────────
   SOCIAL PILL
───────────────────────────────────────────── */
function SocialPill({ label, href }: { label: string; href: string }) {
	return (
		<a
			href={href}
			target="_blank"
			rel="noopener noreferrer"
			className="group inline-flex min-h-[44px] items-center gap-1.5 rounded-full border border-white/[0.08] bg-transparent px-[15px] py-1.5 text-caption font-medium tracking-wide no-underline transition-all duration-[220ms] hover:border-[#D4849A] hover:bg-[rgba(212,132,154,0.08)] hover:text-[#D4849A]"
			style={{
				fontFamily: "'Inter', sans-serif",
				color: "rgba(245,240,232,0.62)",
			}}
		>
			<span className="h-1 w-1 shrink-0 rounded-full bg-[rgba(245,240,232,0.2)] transition-colors group-hover:bg-[#D4849A]" />
			{label}
		</a>
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
						}}
					/>
					<span
						className="font-mono text-caption uppercase tracking-[0.1em]"
						style={{ color: hobby.accent }}
					>
						{hobby.tag}
					</span>
				</div>

				{/* Icon */}
				<div className="mb-3.5 text-section leading-none" aria-hidden="true">
					{hobby.icon}
				</div>

				{/* Title */}
				<p
					className="mb-2 text-lead font-semibold leading-tight tracking-tight"
					style={{
						fontFamily: "'Cormorant Garamond', serif",
						color: T.fg,
					}}
				>
					{hobby.title}
				</p>

				{/* Description */}
				<p
					className="m-0 text-caption leading-[1.65]"
					style={{
						fontFamily: "'Inter', sans-serif",
						color: T.muted,
					}}
				>
					{hobby.desc}
				</p>

				{/* Counter */}
				<div
					className="absolute bottom-4 right-[18px] font-mono text-caption tracking-[0.07em]"
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
	const reduceMotion = useReducedMotion();
	const [topIndex, setTopIndex] = useState(0);
	const total = HOBBIES.length;

	const advance = useCallback(() => {
		setTopIndex((prev) => (prev + 1) % total);
	}, [total]);

	const retreat = useCallback(() => {
		setTopIndex((prev) => (prev - 1 + total) % total);
	}, [total]);

	// Announce each change politely; focus stays on the control that was pressed (D25).
	const announcement = `Hobby ${topIndex + 1} of ${total}: ${HOBBIES[topIndex].title}`;

	const visibleDepths = [3, 2, 1, 0];
	const stackCards = visibleDepths.map((depth) => {
		const idx = (topIndex + depth) % total;
		return { hobby: HOBBIES[idx], depth, hobbyIndex: idx };
	});

	return (
		<div className="flex flex-col items-center gap-6">
			<p className="sr-only" aria-live="polite" aria-atomic="true" data-hobby-status>
				{announcement}
			</p>
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
				role="group"
				aria-label="Hobby card controls"
			>
				<motion.button
					type="button"
					aria-label="Previous hobby card"
					onClick={retreat}
					whileHover={{ scale: 1.08, borderColor: T.rose }}
					whileTap={{ scale: 0.94 }}
					className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-white/[0.08] bg-transparent text-base text-[#D4849A] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4849A]"
				>
					←
				</motion.button>

				<div className="hidden items-center sm:flex" role="group" aria-label="Select hobby">
					{HOBBIES.map((h, i) => {
						const active = i === topIndex;
						return (
							// 44px hit area around the same small visual dot; phones use the arrows instead.
							<button
								key={h.title}
								type="button"
								aria-current={active ? "true" : undefined}
								aria-label={`Show ${h.title}`}
								onClick={() => setTopIndex(i)}
								className="flex h-11 min-w-11 cursor-pointer items-center justify-center rounded-full border-0 bg-transparent p-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#4ADE80]"
							>
								<motion.span
									aria-hidden="true"
									animate={{
										width: active ? 18 : 5,
										background: active ? T.green : T.mutedLo,
									}}
									transition={
										reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 300, damping: 28 }
									}
									className="block h-[5px] rounded-full"
								/>
							</button>
						);
					})}
				</div>

				<motion.button
					type="button"
					aria-label="Next hobby card"
					onClick={advance}
					whileHover={{ scale: 1.08, borderColor: T.green }}
					whileTap={{ scale: 0.94 }}
					className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-white/[0.08] bg-transparent text-base text-[#4ADE80] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4ADE80]"
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
	const reduceMotion = useReducedMotion();
	const inView = useInView(sectionRef, { once: true, margin: "-80px" });

	return (
		<section
			ref={sectionRef}
			id="about"
			className="bento scroll-mt-24"
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
					initial={reduceMotion ? { opacity: 1 } : { opacity: 0, x: -28 }}
					animate={inView ? { opacity: 1, x: 0 } : {}}
					transition={reduceMotion ? { duration: 0 } : { duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
					className="bento__col"
				>
					<h2 className="section-label">About</h2>
					<img
						src={BIO.photo.src}
						alt={BIO.photo.alt}
						width={112}
						height={112}
						loading="lazy"
						decoding="async"
						className="bento__photo"
					/>
					<p className="bento__h2 bento__name">{BIO.name}</p>
					<p className="bento__h2 bento__role">{BIO.role}</p>

					{BIO.paragraphs.map((p, i) => (
						<p key={i} className="bento__p">
							{p}
						</p>
					))}

					<div className="bento__taglineBox">
						<p className="bento__taglineText">
							{BIO.tagline}
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
					initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 32 }}
					animate={inView ? { opacity: 1, y: 0 } : {}}
					transition={reduceMotion ? { duration: 0 } : { delay: 0.25, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
					className="bento__col"
				>
					<p className="bento__rightLabel">// what I love</p>
					<div className="bento__rightStack">
						<CardDeck />
					</div>
				</motion.div>
			</div>
		</section>
	);
}

export { BentoSection as Bento };
