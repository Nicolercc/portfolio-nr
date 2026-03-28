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
	vx: number;
	vy: number;
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
	deep: 180,
	mid: 60,
	bright: 18,
};

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
		twinkles: Math.random() < 0.25,
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
		twinkles: true,
		color: pickColor({ white: 50, rose: 20, lilac: 12, iceblue: 10, green: 8 }),
		vx: rand(-0.14, 0.14),
		vy: rand(-0.1, 0.1),
		parallaxFactor: rand(0.16, 0.26),
	};
}

// ─── Offscreen nebula compositor ─────────────────────────────────────────────

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
		{
			cx: W * 0.1,
			cy: H * 0.5,
			rx: W * 0.38,
			ry: H * 0.42,
			r: [212, 132, 154],
			opacity: 0.06,
		},
		{
			cx: W * 0.82,
			cy: H * 0.2,
			rx: W * 0.3,
			ry: H * 0.35,
			r: [175, 112, 210],
			opacity: 0.05,
		},
		{
			cx: W * 0.75,
			cy: H * 0.85,
			rx: W * 0.28,
			ry: H * 0.3,
			r: [74, 222, 128],
			opacity: 0.04,
		},
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

// ─── Shooting star ────────────────────────────────────────────────────────────
//
// Single fixed direction: top-right → bottom-left (≈ 215°).
// Only the ENTRY POINT along the top-right region varies — the angle is locked.
// This makes every meteor feel like the same sky event, not two different objects.
//
// To tune:
//   METEOR_ANGLE_DEG   — the travel direction in degrees. 215 = down-left diagonal.
//                        Increase toward 225 for steeper, decrease toward 200 for shallower.
//   entrySpread        — how wide the top-right entry band is (fraction of W).
//   METEOR_SPEED       — px per frame. Higher = faster crossing.
//   METEOR_TAIL        — streak length in px.

const METEOR_ANGLE_DEG = 120;
const METEOR_ANGLE_RAD = (METEOR_ANGLE_DEG * Math.PI) / 150;
const METEOR_UX = Math.cos(METEOR_ANGLE_RAD); // unit vector x
const METEOR_UY = Math.sin(METEOR_ANGLE_RAD); // unit vector y

interface ShootingStar {
	x: number;
	y: number;
	vx: number;
	vy: number;
	life: number;
	maxLife: number;
	tail: number;
}

function spawnShootingStar(width: number, height: number): ShootingStar {
	// Entry point: somewhere along the top-right quadrant edge.
	// We randomise position along that edge only — direction is fixed.
	const entrySpread = 0.55; // fraction of width used as entry band
	const entryX =
		width * (1 - entrySpread) + Math.random() * width * entrySpread;
	const entryY = rand(-height * 0.08, height * 0.18); // just above or near top

	const speed = rand(16, 22);
	const tail = rand(180, 260);

	// maxLife: enough frames to cross the full diagonal + a little fade room
	const travel = Math.hypot(width * 1.2, height * 1.1);
	const maxLife = Math.ceil(travel / speed);

	return {
		x: entryX,
		y: entryY,
		vx: METEOR_UX * speed,
		vy: METEOR_UY * speed,
		life: 0,
		maxLife,
		tail,
	};
}

function drawShootingStar(ctx: CanvasRenderingContext2D, s: ShootingStar) {
	const hx = s.x;
	const hy = s.y;
	// Tail trails behind in the opposite direction of travel
	const tx = s.x - METEOR_UX * s.tail;
	const ty = s.y - METEOR_UY * s.tail;

	// Edge fade: ramp in for first 8 frames, ramp out for last 14
	let edgeFade = 1;
	if (s.life < 8) edgeFade = s.life / 8;
	if (s.life > s.maxLife - 14) {
		edgeFade = Math.min(edgeFade, (s.maxLife - s.life) / 14);
	}
	const f = edgeFade;

	const grd = ctx.createLinearGradient(hx, hy, tx, ty);
	grd.addColorStop(0, `rgba(255,252,250,${0.98 * f})`);
	grd.addColorStop(0.05, `rgba(255,245,248,${0.65 * f})`);
	grd.addColorStop(0.32, `rgba(232,160,180,${0.38 * f})`);
	grd.addColorStop(0.58, `rgba(212,132,154,${0.22 * f})`);
	grd.addColorStop(0.82, `rgba(120,220,160,${0.1 * f})`);
	grd.addColorStop(1, "rgba(74,222,128,0)");

	// Soft outer glow
	ctx.beginPath();
	ctx.moveTo(hx, hy);
	ctx.lineTo(tx, ty);
	ctx.strokeStyle = `rgba(255,250,248,${0.14 * f})`;
	ctx.lineWidth = 4.5;
	ctx.lineCap = "round";
	ctx.stroke();

	// Core streak
	ctx.beginPath();
	ctx.moveTo(hx, hy);
	ctx.lineTo(tx, ty);
	ctx.strokeStyle = grd;
	ctx.lineWidth = 2;
	ctx.lineCap = "round";
	ctx.stroke();

	// Bright head dot
	ctx.beginPath();
	ctx.arc(hx, hy, 2.1, 0, Math.PI * 2);
	ctx.fillStyle = `rgba(255,252,250,${0.95 * f})`;
	ctx.fill();

	// Head glow bloom
	ctx.beginPath();
	ctx.arc(hx, hy, 4, 0, Math.PI * 2);
	const headGlow = ctx.createRadialGradient(hx, hy, 0, hx, hy, 4);
	headGlow.addColorStop(0, `rgba(212,132,154,${0.35 * f})`);
	headGlow.addColorStop(1, "rgba(74,222,128,0)");
	ctx.fillStyle = headGlow;
	ctx.fill();
}

// ─── Draw a single star ───────────────────────────────────────────────────────

function drawStar(
	ctx: CanvasRenderingContext2D,
	s: Star,
	offsetX: number,
	offsetY: number,
) {
	const [r, g, b] = COLOR_MAP[s.color];
	const x = s.x + offsetX;
	const y = s.y + offsetY;

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

		let mouseX = 0,
			mouseY = 0;
		let targetMouseX = 0,
			targetMouseY = 0;

		let shootingStar: ShootingStar | null = null;
		let framesUntilShootingStar = Math.floor(rand(55, 110));

		function init() {
			W = window.innerWidth;
			H = window.innerHeight;

			c.width = W * DPR;
			c.height = H * DPR;
			c.style.width = `${W}px`;
			c.style.height = `${H}px`;
			context.setTransform(DPR, 0, 0, DPR, 0, 0);

			const mobile = isMobile();
			const scale = mobile ? 0.5 : 1;

			deepStars = Array.from(
				{ length: Math.floor(BASE_COUNTS.deep * scale) },
				() => makeDeepStar(W, H),
			);
			midStars = Array.from(
				{ length: Math.floor(BASE_COUNTS.mid * scale) },
				() => makeMidStar(W, H),
			);
			brightStars = Array.from(
				{ length: Math.floor(BASE_COUNTS.bright * scale) },
				() => makeBrightStar(W, H),
			);

			nebula = buildNebulaCanvas(W, H);
			shootingStar = null;
			framesUntilShootingStar = Math.floor(rand(55, 110));
		}

		function tick() {
			context.clearRect(0, 0, W, H);

			if (nebula) context.drawImage(nebula, 0, 0, W, H);

			if (!reducedMotion && !isMobile()) {
				mouseX += (targetMouseX - mouseX) * 0.04;
				mouseY += (targetMouseY - mouseY) * 0.04;
			}

			for (const layer of [deepStars, midStars, brightStars]) {
				for (const s of layer) {
					if (!reducedMotion) {
						s.x += s.vx;
						s.y += s.vy;
						if (s.x < -4) s.x = W + 4;
						if (s.x > W + 4) s.x = -4;
						if (s.y < -4) s.y = H + 4;
						if (s.y > H + 4) s.y = -4;
					}

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

					const ox = reducedMotion
						? 0
						: (mouseX - W / 2) * s.parallaxFactor * 0.045;
					const oy = reducedMotion
						? 0
						: (mouseY - H / 2) * s.parallaxFactor * 0.045;

					drawStar(context, s, ox, oy);
				}
			}

			// Shooting star — single direction, desktop + motion only
			if (!reducedMotion && !isMobile() && W > 0) {
				if (shootingStar) {
					shootingStar.x += shootingStar.vx;
					shootingStar.y += shootingStar.vy;
					shootingStar.life += 1;
					drawShootingStar(context, shootingStar);

					const margin = shootingStar.tail * 2;
					const done =
						shootingStar.life >= shootingStar.maxLife ||
						shootingStar.x < -margin ||
						shootingStar.y > H + margin;

					if (done) {
						shootingStar = null;
						framesUntilShootingStar = Math.floor(rand(320, 720));
					}
				} else {
					framesUntilShootingStar -= 1;
					if (framesUntilShootingStar <= 0) {
						shootingStar = spawnShootingStar(W, H);
					}
				}
			}

			animId = requestAnimationFrame(tick);
		}

		function onMouseMove(e: MouseEvent) {
			targetMouseX = e.clientX;
			targetMouseY = e.clientY;
		}

		function onResize() {
			init();
		}

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

	const handleScroll = () => {
		const hero = document.getElementById("hero");
		if (hero) hero.scrollIntoView({ behavior: "smooth" });
	};

	return (
		<section className="landing" id="landing">
			<div className="landing__nebula" aria-hidden />
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
