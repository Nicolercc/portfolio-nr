"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import {
	motion,
	useInView,
	useMotionValue,
	useTransform,
	animate,
	AnimatePresence,
} from "framer-motion";
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
};

/* ─────────────────────────────────────────────
   CONTENT
───────────────────────────────────────────── */
const BIO = {
	eyebrow: "More About Me",
	name: "I'm Nicole,",
	role: "a creative soul",
	paragraphs: [
		"I'm Nicole Rodriguez — drawn to the beauty in craft, the stillness of nature, and the thrill of discovering a new island shoreline. I believe the best ideas live at the intersection of art and adventure.",
		"Whether I'm throwing clay, mixing pigments, or reading under a palm tree, I'm always chasing that feeling of being fully present.",
	],
	tagline: "Life is better when you make things with your hands.",
	links: [
		{ label: "LinkedIn", href: "#" },
		{ label: "GitHub", href: "#" },
		{ label: "X", href: "#" },
	],
};

const HOBBIES = [
	{
		icon: "🏝️",
		title: "Island Hopping",
		desc: "Salt air and new shores. Every island has its own rhythm — I collect them.",
		tag: "wanderlust",
		rot: -4,
		accent: T.rose,
		border: "rgba(212,132,154,0.4)",
		glow: "rgba(212,132,154,0.15)",
	},
	{
		icon: "✈️",
		title: "Traveling",
		desc: "Passport stamps are my love language. The world is too big to stay in one place.",
		tag: "explorer",
		rot: 2,
		accent: "#9BA8F5",
		border: "rgba(155,168,245,0.4)",
		glow: "rgba(155,168,245,0.15)",
	},
	{
		icon: "🌿",
		title: "Being in Nature",
		desc: "Forests, coasts, and everything wild. Nature resets whatever the city breaks.",
		tag: "grounded",
		rot: -2,
		accent: T.green,
		border: "rgba(74,222,128,0.4)",
		glow: "rgba(74,222,128,0.15)",
	},
	{
		icon: "📖",
		title: "Reading",
		desc: "Slow afternoons and a good book. Fiction, philosophy, anything beautifully written.",
		tag: "curious",
		rot: 3,
		accent: "#F5C97A",
		border: "rgba(245,201,122,0.4)",
		glow: "rgba(245,201,122,0.15)",
	},
	{
		icon: "🏺",
		title: "Pottery",
		desc: "Centering clay is the closest thing I've found to meditation. Every piece is a conversation.",
		tag: "maker",
		rot: -3,
		accent: T.rose,
		border: "rgba(212,132,154,0.4)",
		glow: "rgba(212,132,154,0.15)",
	},
	{
		icon: "🎨",
		title: "Painting",
		desc: "Acrylics, watercolour, whatever is nearby. The canvas doesn't judge.",
		tag: "artist",
		rot: 1,
		accent: "#C4A8FF",
		border: "rgba(196,168,255,0.4)",
		glow: "rgba(196,168,255,0.15)",
	},
	{
		icon: "✂️",
		title: "Crafts & Making",
		desc: "If it can be built, sewn, pressed, or glued — I've probably tried it. Joy lives in the process.",
		tag: "creative",
		rot: -1,
		accent: T.green,
		border: "rgba(74,222,128,0.4)",
		glow: "rgba(74,222,128,0.15)",
	},
];

/* ─────────────────────────────────────────────
   TYPING EFFECT HOOK
───────────────────────────────────────────── */
function useTypingEffect(text: string, speed = 40, start = true) {
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
	const [hov, setHov] = useState(false);
	return (
		<a
			href={href}
			target="_blank"
			rel="noopener noreferrer"
			onMouseEnter={() => setHov(true)}
			onMouseLeave={() => setHov(false)}
			style={{
				display: "inline-flex",
				alignItems: "center",
				gap: 6,
				padding: "6px 15px",
				borderRadius: 99,
				border: `1px solid ${hov ? T.rose : T.border}`,
				background: hov ? "rgba(212,132,154,0.08)" : "transparent",
				color: hov ? T.rose : T.muted,
				fontSize: "0.78rem",
				fontFamily: "'DM Sans', sans-serif",
				fontWeight: 500,
				textDecoration: "none",
				transition: "all 0.22s",
				letterSpacing: "0.01em",
			}}
		>
			<span
				style={{
					width: 4,
					height: 4,
					borderRadius: "50%",
					background: hov ? T.rose : T.mutedLo,
					transition: "background 0.2s",
				}}
			/>
			{label}
		</a>
	);
}

/* ─────────────────────────────────────────────
   ANIMATED ORB AVATAR
───────────────────────────────────────────── */
function BlobOrb() {
	return (
		<div
			style={{
				position: "relative",
				width: 110,
				height: 110,
				marginBottom: 28,
			}}
		>
			<motion.div
				animate={{ rotate: 360 }}
				transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
				style={{
					position: "absolute",
					inset: 0,
					borderRadius: "60% 40% 55% 45% / 45% 55% 45% 55%",
					background: `conic-gradient(from 0deg, ${T.rose}, #C4A8FF, ${T.green}, ${T.rose})`,
					filter: "blur(2px)",
					opacity: 0.55,
				}}
			/>
			<div
				style={{
					position: "absolute",
					inset: 6,
					borderRadius: "inherit",
					background: T.bg,
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					fontSize: 38,
				}}
			>
				🌺
			</div>
		</div>
	);
}

/* ─────────────────────────────────────────────
   STRATEGY CARD
───────────────────────────────────────────── */
export function StrategyCard() {
	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true }}
			className="relative group overflow-hidden rounded-3xl border border-white/5 bg-zinc-900/40 p-8 h-full flex flex-col justify-between hover:border-rose/20 transition-colors"
		>
			<div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
				<span className="text-6xl font-serif italic pointer-events-none">
					BA
				</span>
			</div>
			<div>
				<div className="flex items-center gap-2 mb-6">
					<span className="w-1.5 h-1.5 rounded-full bg-rose shadow-[0_0_8px_#D4849A]" />
					<span className="text-[10px] font-mono uppercase tracking-[0.2em] text-rose">
						Strategic Background
					</span>
				</div>
				<h3 className="text-2xl font-serif mb-4 leading-tight">
					The Intersection of <br />
					<span className="text-transparent bg-clip-text bg-gradient-to-r from-rose to-purple-400">
						Media & Politics
					</span>
				</h3>
				<p className="text-sm text-muted-foreground leading-relaxed font-light max-w-sm">
					My degree is my lens. I view interfaces as modern public squares,
					specializing in <strong>information integrity</strong> and{" "}
					<strong>accessible narrative</strong>.
				</p>
			</div>
			<div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
				<span className="text-[9px] font-mono uppercase text-white/20 tracking-widest">
					Media Specialist × Engineer
				</span>
				<div className="flex -space-x-2">
					<div className="w-6 h-6 rounded-full bg-rose/20 border border-rose/40 flex items-center justify-center text-[10px]">
						⚖️
					</div>
					<div className="w-6 h-6 rounded-full bg-green/20 border border-green/40 flex items-center justify-center text-[10px]">
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
type Hobby = (typeof HOBBIES)[number];

function DraggableCard({
	hobby,
	depth,
	total,
	currentIndex,
	onDismiss,
}: {
	hobby: Hobby;
	depth: number;
	total: number;
	currentIndex: number;
	onDismiss: () => void;
}) {
	const x = useMotionValue(0);
	const y = useMotionValue(0);
	const cardRotate = useTransform(x, [-220, 0, 220], [-22, hobby.rot, 22]);
	const cardOpacity = useTransform(x, [-160, -60, 0, 60, 160], [0, 1, 1, 1, 0]);
	const roseOverlay = useTransform(x, [0, -100], [0, 0.2]);
	const greenOverlay = useTransform(x, [0, 100], [0, 0.2]);

	const isTop = depth === 0;
	const scale = 1 - depth * 0.045;
	const yOffset = depth * 10;
	const bgVal = 20 + depth * 8;

	const handleDragEnd = useCallback(
		(_: unknown, info: { offset: { x: number } }) => {
			if (Math.abs(info.offset.x) > 85) {
				const dir = info.offset.x > 0 ? 1 : -1;
				animate(x, dir * 500, { duration: 0.38, ease: [0.36, 0, 0.66, -0.56] });
				animate(y, -50, { duration: 0.38 });
				setTimeout(onDismiss, 340);
			} else {
				animate(x, 0, { type: "spring", stiffness: 320, damping: 30 });
				animate(y, 0, { type: "spring", stiffness: 320, damping: 30 });
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
		>
			<div
				style={{
					background: `rgb(${bgVal},${bgVal},${bgVal})`,
					border: `1px solid ${T.border}`,
					borderRadius: 20,
					padding: "26px 24px 22px",
					userSelect: "none",
					position: "relative",
					overflow: "hidden",
					boxShadow: isTop
						? "0 28px 70px rgba(0,0,0,0.6), 0 2px 0 rgba(255,255,255,0.04) inset"
						: "0 8px 24px rgba(0,0,0,0.4)",
					minHeight: 230,
				}}
			>
				{isTop && (
					<>
						<motion.div
							style={{
								position: "absolute",
								inset: 0,
								borderRadius: 20,
								background: T.rose,
								opacity: roseOverlay,
								pointerEvents: "none",
							}}
						/>
						<motion.div
							style={{
								position: "absolute",
								inset: 0,
								borderRadius: 20,
								background: T.green,
								opacity: greenOverlay,
								pointerEvents: "none",
							}}
						/>
					</>
				)}

				{/* Shimmer line */}
				<div
					style={{
						position: "absolute",
						top: 0,
						left: "15%",
						right: "15%",
						height: 1,
						background: `linear-gradient(90deg, transparent, ${hobby.accent}55, transparent)`,
					}}
				/>

				{/* Tag chip */}
				<div
					style={{
						display: "inline-flex",
						alignItems: "center",
						gap: 5,
						padding: "3px 10px",
						borderRadius: 99,
						border: `1px solid ${hobby.accent}33`,
						background: `${hobby.accent}0F`,
						marginBottom: 16,
					}}
				>
					<span
						style={{
							width: 5,
							height: 5,
							borderRadius: "50%",
							background: hobby.accent,
							boxShadow: `0 0 6px ${hobby.accent}`,
						}}
					/>
					<span
						style={{
							fontFamily: "'DM Mono', monospace",
							fontSize: "0.63rem",
							letterSpacing: "0.1em",
							textTransform: "uppercase" as const,
							color: hobby.accent,
						}}
					>
						{hobby.tag}
					</span>
				</div>

				{/* Icon */}
				<div style={{ fontSize: 34, marginBottom: 14, lineHeight: 1 }}>
					{hobby.icon}
				</div>

				{/* Title */}
				<p
					style={{
						fontFamily: "'Cormorant Garamond', serif",
						fontWeight: 600,
						fontSize: "1.3rem",
						color: T.fg,
						letterSpacing: "-0.01em",
						marginBottom: 8,
						lineHeight: 1.2,
					}}
				>
					{hobby.title}
				</p>

				{/* Description */}
				<p
					style={{
						fontFamily: "'DM Sans', sans-serif",
						fontSize: "0.81rem",
						lineHeight: 1.65,
						color: T.muted,
						margin: 0,
					}}
				>
					{hobby.desc}
				</p>

				{/* Counter */}
				<div
					style={{
						position: "absolute",
						bottom: 16,
						right: 18,
						fontFamily: "'DM Mono', monospace",
						fontSize: "0.6rem",
						color: T.mutedLo,
						letterSpacing: "0.07em",
					}}
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
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				gap: 24,
			}}
		>
			{/*
        FIXED: Previously width:"150%" inline — caused content to bleed
        off iPhone screens. Now uses .bento__deckWrap (width:100%, max-width:340px)
        defined in bento.css.
      */}
			<div className="bento__deckWrap">
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
			<div style={{ display: "flex", alignItems: "center", gap: 18 }}>
				<motion.button
					onClick={retreat}
					whileHover={{ scale: 1.08, borderColor: T.rose }}
					whileTap={{ scale: 0.94 }}
					style={{
						width: 40,
						height: 40,
						borderRadius: "50%",
						border: `1px solid ${T.border}`,
						background: "transparent",
						color: T.rose,
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						cursor: "pointer",
						fontSize: "1rem",
						outline: "none",
					}}
				>
					←
				</motion.button>

				<div style={{ display: "flex", gap: 6, alignItems: "center" }}>
					{HOBBIES.map((_, i) => {
						const active = i === topIndex;
						return (
							<motion.div
								key={i}
								animate={{
									width: active ? 18 : 5,
									background: active ? T.green : T.mutedLo,
									boxShadow: active ? `0 0 8px ${T.green}` : "none",
								}}
								transition={{ type: "spring", stiffness: 300, damping: 28 }}
								style={{ height: 5, borderRadius: 99, cursor: "pointer" }}
								onClick={() => setTopIndex(i)}
							/>
						);
					})}
				</div>

				<motion.button
					onClick={advance}
					whileHover={{ scale: 1.08, borderColor: T.green }}
					whileTap={{ scale: 0.94 }}
					style={{
						width: 40,
						height: 40,
						borderRadius: "50%",
						border: `1px solid ${T.border}`,
						background: "transparent",
						color: T.green,
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						cursor: "pointer",
						fontSize: "1rem",
						outline: "none",
					}}
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
   File: src/components/sections/bento.tsx
───────────────────────────────────────────── */
export default function BentoSection() {
	const sectionRef = useRef(null);
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
			<div className="bento__gridBg" />
			<div className="bento__glowRose" />
			<div className="bento__glowGreen" />

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
								style={{
									display: "inline-block",
									width: 2,
									height: "0.85em",
									background: T.rose,
									marginLeft: 2,
									verticalAlign: "middle",
								}}
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
					<CardDeck />

					<div className="bento__strategyWrap">
						<StrategyCard />
					</div>
				</motion.div>
			</div>
		</section>
	);
}

export { BentoSection as Bento };
