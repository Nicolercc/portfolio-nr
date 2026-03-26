import { useEffect, useRef } from "react";
import "./landing.css";

// ─── Types ────────────────────────────────────────────────────────────────────

type StarColor = "white" | "rose" | "lilac" | "green" | "iceblue";

interface Star {
	x: number;
	y: number;
	r: number;
	baseAlpha: number;
	alpha: number;
	alphaDir: number;
	twinkleSpeed: number;
	twinkles: boolean;
	color: StarColor;
	// drift
	vx: number;
	vy: number;
	// parallax depth — 0 (far/slow) → 1 (close/fast)
	parallaxFactor: number;
}

// ─── Color map ────────────────────────────────────────────────────────────────

const COLOR_MAP: Record<StarColor, [number, number, number]> = {
	white: [255, 250, 248],
	rose: [212, 132, 154],
	lilac: [195, 160, 225],
	green: [120, 220, 160],
	iceblue: [160, 190, 230],
};

// ─── Config ───────────────────────────────────────────────────────────────────

const BASE_COUNTS = {
	deep: 180, // layer 0 — tiny, distant
	mid: 60, // layer 1 — medium, some color
	bright: 18, // layer 2 — big, halos, most visual interest
};

// Mobile gets half the stars and no parallax
const isMobile = () => window.innerWidth <= 768;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function rand(min: number, max: number) {
	return Math.random() * (max - min) + min;
}

function pickColor(weights: Partial<Record<StarColor, number>>): StarColor {
	const entries = Object.entries(weights) as [StarColor, number][];
	const total = entries.reduce((s, [, w]) => s + w, 0);
	let r = Math.random() * total;
	for (const [color, weight] of entries) {
		r -= weight;
		if (r <= 0) return color;
	}
	return "white";
}

// ─── Star factories ───────────────────────────────────────────────────────────

function makeDeepStar(W: number, H: number): Star {
	return {
		x: rand(0, W),
		y: rand(0, H),
		r: rand(0.3, 0.9),
		baseAlpha: rand(0.2, 0.55),
		alpha: rand(0.2, 0.55),
		alphaDir: Math.random() > 0.5 ? 0.0008 : -0.0008,
		twinkleSpeed: rand(0.0005, 0.0012),
		twinkles: Math.random() < 0.25, // only 25% twinkle at this depth
		color: pickColor({ white: 80, iceblue: 15, rose: 5 }),
		vx: rand(-0.04, 0.04),
		vy: rand(-0.02, 0.02),
		parallaxFactor: rand(0.02, 0.06),
	};
}

function makeMidStar(W: number, H: number): Star {
	return {
		x: rand(0, W),
		y: rand(0, H),
		r: rand(1.0, 1.9),
		baseAlpha: rand(0.35, 0.7),
		alpha: rand(0.35, 0.7),
		alphaDir: Math.random() > 0.5 ? 0.002 : -0.002,
		twinkleSpeed: rand(0.001, 0.003),
		twinkles: Math.random() < 0.6,
		color: pickColor({ white: 55, rose: 20, lilac: 15, iceblue: 7, green: 3 }),
		vx: rand(-0.09, 0.09),
		vy: rand(-0.06, 0.06),
		parallaxFactor: rand(0.08, 0.14),
	};
}

function makeBrightStar(W: number, H: number): Star {
	return {
		x: rand(0, W),
		y: rand(0, H),
		r: rand(1.8, 2.8),
		baseAlpha: rand(0.6, 1.0),
		alpha: rand(0.6, 1.0),
		alphaDir: Math.random() > 0.5 ? 0.004 : -0.004,
		twinkleSpeed: rand(0.002, 0.006),
		twinkles: true, // always twinkle
		color: pickColor({ white: 50, rose: 20, lilac: 12, iceblue: 10, green: 8 }),
		vx: rand(-0.14, 0.14),
		vy: rand(-0.1, 0.1),
		parallaxFactor: rand(0.16, 0.26),
	};
}

// ─── Offscreen nebula compositor ─────────────────────────────────────────────
// Pre-renders 3 soft radial blobs onto an offscreen canvas once per resize.
// Each frame just drawImage() — no fill calls in the hot path.

function buildNebulaCanvas(W: number, H: number): HTMLCanvasElement {
	const off = document.createElement("canvas");
	off.width = W;
	off.height = H;
	const octx = off.getContext("2d")!;

	const blobs: {
		cx: number;
		cy: number;
		rx: number;
		ry: number;
		r: [number, number, number];
		opacity: number;
	}[] = [
		// Rose — left-center
		{
			cx: W * 0.1,
			cy: H * 0.5,
			rx: W * 0.38,
			ry: H * 0.42,
			r: [212, 132, 154],
			opacity: 0.06,
		},
		// Lilac — top-right
		{
			cx: W * 0.82,
			cy: H * 0.2,
			rx: W * 0.3,
			ry: H * 0.35,
			r: [175, 112, 210],
			opacity: 0.05,
		},
		// Soft green — bottom-right
		{
			cx: W * 0.75,
			cy: H * 0.85,
			rx: W * 0.28,
			ry: H * 0.3,
			r: [74, 222, 128],
			opacity: 0.04,
		},
		// Faint rose — top-center bleed
		{
			cx: W * 0.48,
			cy: H * -0.04,
			rx: W * 0.4,
			ry: H * 0.28,
			r: [212, 132, 154],
			opacity: 0.04,
		},
	];

	for (const b of blobs) {
		const grd = octx.createRadialGradient(
			b.cx,
			b.cy,
			0,
			b.cx,
			b.cy,
			Math.max(b.rx, b.ry),
		);
		grd.addColorStop(0, `rgba(${b.r[0]}, ${b.r[1]}, ${b.r[2]}, ${b.opacity})`);
		grd.addColorStop(
			0.5,
			`rgba(${b.r[0]}, ${b.r[1]}, ${b.r[2]}, ${b.opacity * 0.4})`,
		);
		grd.addColorStop(1, `rgba(${b.r[0]}, ${b.r[1]}, ${b.r[2]}, 0)`);

		octx.save();
		// Scale horizontally to get the ellipse shape
		octx.translate(b.cx, b.cy);
		octx.scale(b.rx / Math.max(b.rx, b.ry), b.ry / Math.max(b.rx, b.ry));
		octx.translate(-b.cx, -b.cy);

		octx.fillStyle = grd;
		octx.beginPath();
		octx.arc(b.cx, b.cy, Math.max(b.rx, b.ry), 0, Math.PI * 2);
		octx.fill();
		octx.restore();
	}

	return off;
}

// ─── Draw a single star (with optional glow halo) ────────────────────────────

function drawStar(
	ctx: CanvasRenderingContext2D,
	s: Star,
	offsetX: number,
	offsetY: number,
) {
	const [r, g, b] = COLOR_MAP[s.color];
	const x = s.x + offsetX;
	const y = s.y + offsetY;

	// Glow for bright layer only (r >= 1.8)
	if (s.r >= 1.8) {
		const glowR = s.r * 5;
		const grd = ctx.createRadialGradient(x, y, 0, x, y, glowR);
		grd.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${s.alpha * 0.45})`);
		grd.addColorStop(0.4, `rgba(${r}, ${g}, ${b}, ${s.alpha * 0.1})`);
		grd.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
		ctx.beginPath();
		ctx.arc(x, y, glowR, 0, Math.PI * 2);
		ctx.fillStyle = grd;
		ctx.fill();
	}

	// Core dot
	ctx.beginPath();
	ctx.arc(x, y, s.r, 0, Math.PI * 2);
	ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${s.alpha})`;
	ctx.fill();
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function Landing() {
	const canvasRef = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;
		const c = canvas;
		const context = ctx;

		const reducedMotion = window.matchMedia(
			"(prefers-reduced-motion: reduce)",
		).matches;

		const DPR = Math.min(window.devicePixelRatio || 1, 2);

		let W = 0,
			H = 0;
		let deepStars: Star[] = [];
		let midStars: Star[] = [];
		let brightStars: Star[] = [];
		let nebula: HTMLCanvasElement | null = null;
		let animId: number;

		// Mouse offset for parallax (CSS pixels)
		let mouseX = 0,
			mouseY = 0;
		let targetMouseX = 0,
			targetMouseY = 0;

		// ── Init / resize ───────────────────────────────────────────────────────
		function init() {
			W = window.innerWidth;
			H = window.innerHeight;

			// DPR-correct canvas sizing
			c.width = W * DPR;
			c.height = H * DPR;
			c.style.width = `${W}px`;
			c.style.height = `${H}px`;
			context.setTransform(DPR, 0, 0, DPR, 0, 0);

			const mobile = isMobile();
			const scale = mobile ? 0.5 : 1;

			const dcnt = Math.floor(BASE_COUNTS.deep * scale);
			const mcnt = Math.floor(BASE_COUNTS.mid * scale);
			const bcnt = Math.floor(BASE_COUNTS.bright * scale);

			deepStars = Array.from({ length: dcnt }, () => makeDeepStar(W, H));
			midStars = Array.from({ length: mcnt }, () => makeMidStar(W, H));
			brightStars = Array.from({ length: bcnt }, () => makeBrightStar(W, H));

			nebula = buildNebulaCanvas(W, H);
		}

		// ── Tick ────────────────────────────────────────────────────────────────
		function tick() {
			context.clearRect(0, 0, W, H);

			// 1. Draw pre-rendered nebula clouds
			if (nebula) context.drawImage(nebula, 0, 0, W, H);

			// 2. Smooth mouse tracking (lerp)
			if (!reducedMotion && !isMobile()) {
				mouseX += (targetMouseX - mouseX) * 0.04;
				mouseY += (targetMouseY - mouseY) * 0.04;
			}

			// 3. Draw all three layers
			const allLayers: Star[][] = [deepStars, midStars, brightStars];

			for (const layer of allLayers) {
				for (const s of layer) {
					// Drift
					if (!reducedMotion) {
						s.x += s.vx;
						s.y += s.vy;
						// Wrap
						if (s.x < -4) s.x = W + 4;
						if (s.x > W + 4) s.x = -4;
						if (s.y < -4) s.y = H + 4;
						if (s.y > H + 4) s.y = -4;
					}

					// Twinkle
					if (s.twinkles && !reducedMotion) {
						s.alpha += s.alphaDir * (s.twinkleSpeed / 0.002);
						const lo = s.baseAlpha * 0.25;
						const hi = Math.min(s.baseAlpha * 1.35, 1.0);
						if (s.alpha > hi) {
							s.alpha = hi;
							s.alphaDir *= -1;
						}
						if (s.alpha < lo) {
							s.alpha = lo;
							s.alphaDir *= -1;
						}
					}

					// Parallax offset
					const ox = reducedMotion
						? 0
						: (mouseX - W / 2) * s.parallaxFactor * 0.045;
					const oy = reducedMotion
						? 0
						: (mouseY - H / 2) * s.parallaxFactor * 0.045;

					drawStar(context, s, ox, oy);
				}
			}

			animId = requestAnimationFrame(tick);
		}

		// ── Mouse tracking ──────────────────────────────────────────────────────
		function onMouseMove(e: MouseEvent) {
			targetMouseX = e.clientX;
			targetMouseY = e.clientY;
		}

		// ── Resize ──────────────────────────────────────────────────────────────
		function onResize() {
			init();
		}

		// ── Boot ────────────────────────────────────────────────────────────────
		init();
		tick();

		if (!reducedMotion) {
			window.addEventListener("mousemove", onMouseMove, { passive: true });
		}
		window.addEventListener("resize", onResize);

		return () => {
			cancelAnimationFrame(animId);
			window.removeEventListener("mousemove", onMouseMove);
			window.removeEventListener("resize", onResize);
		};
	}, []);

	// ── Scroll handler ─────────────────────────────────────────────────────────
	const handleScroll = () => {
		const hero = document.getElementById("hero");
		if (hero) hero.scrollIntoView({ behavior: "smooth" });
	};

	return (
		<section className="landing" id="landing">
			{/* CSS nebula layer — renders instantly, zero JS */}
			<div className="landing__nebula" aria-hidden />

			{/* Canvas: stars + canvas nebula blobs */}
			<canvas ref={canvasRef} className="landing__canvas" aria-hidden />

			<div className="landing__content">
				<span className="landing__eyebrow">
					Full Stack Developer &amp; Media Strategist
				</span>
				<h1 className="landing__name">Nicole R.</h1>
				<p className="landing__tagline">
					<em>Code that feels crafted.</em>
				</p>

				<div className="landing__meta">
					<span className="landing__location">NYC · DR-raised 🌴</span>
				</div>

				<div className="landing__actions">
					<div className="landing__status">
						<span className="landing__status-dot" aria-hidden />
						Available for Work
					</div>
					<a
						href="/Nicole_R_CV.pdf"
						download
						className="landing__cv-btn"
						aria-label="Download CV"
					>
						Download CV ↓
					</a>
				</div>
			</div>

			<button
				className="landing__scroll-cue"
				onClick={handleScroll}
				aria-label="Scroll to hero"
			>
				<span className="landing__scroll-label">scroll</span>
				<span className="landing__scroll-arrow">↓</span>
			</button>
		</section>
	);
}
