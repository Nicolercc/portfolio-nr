import { useEffect, useRef } from "react";
import { getReducedMotion, subscribe } from "../../lib/motionPreference";
import { themeColor, themeRgb, type ThemeColor } from "../../lib/themeColors";

/**
 * One continuous sky behind every page. The homepage is one journey through it:
 * Arrival → Constellation → Landing → Record → Person → Dawn. Sections mark their
 * chapter with data-chapter; the sky blends between chapter states by scroll
 * position, so there is never a hard edge. Inner pages hold the quiet Record
 * state (case studies tint it with their star's color); the 404 is lost in space.
 */
type RGB = [number, number, number];
type State = {
	stars: number; // share of the star field drawn (density)
	bright: number;
	neb: RGB;
	nebA: number;
	nebX: number;
	nebY: number;
	neb2: RGB;
	neb2A: number;
	hor: RGB;
	horA: number;
	limb: number;
	calm: number;
	meteors: number;
	drift: number;
};

export type SkyMode = { kind: "home" } | { kind: "record"; tint?: ThemeColor } | { kind: "lost" };

function chapters(): State[] {
	const rose = themeRgb("nebula-rose");
	const lilac = themeRgb("nebula-lilac");
	const violet = themeRgb("galaxy-outer");
	const gold = themeRgb("star-van-alen");
	const plum = themeRgb("horizon-plum");
	const dawn = themeRgb("horizon-dawn");
	return [
		// Arrival: deep night, calm oval behind the name, the odd shooting star.
		{ stars: 1, bright: 1, neb: rose, nebA: 0.08, nebX: 0.18, nebY: 0.55, neb2: violet, neb2A: 0.06, hor: plum, horA: 0.5, limb: 0, calm: 1, meteors: 1, drift: 0 },
		// Constellation: the three.js galaxy rises in this same sky.
		{ stars: 0.9, bright: 0.9, neb: rose, nebA: 0.12, nebX: 0.7, nebY: 0.5, neb2: lilac, neb2A: 0.1, hor: plum, horA: 0.22, limb: 0, calm: 0, meteors: 0, drift: 0 },
		// Landing: stars thin and dim, a faint planet limb at the bottom.
		{ stars: 0.45, bright: 0.5, neb: violet, nebA: 0.04, nebX: 0.8, nebY: 0.2, neb2: rose, neb2A: 0.03, hor: plum, horA: 0.25, limb: 1, calm: 0, meteors: 0, drift: 0 },
		// The record: the quietest sky, best for reading.
		{ stars: 0.3, bright: 0.42, neb: violet, nebA: 0.025, nebX: 0.85, nebY: 0.15, neb2: rose, neb2A: 0.02, hor: plum, horA: 0.1, limb: 0.25, calm: 0, meteors: 0, drift: 0 },
		// The person: a little warmth drifts back in.
		{ stars: 0.4, bright: 0.5, neb: rose, nebA: 0.09, nebX: 0.25, nebY: 0.4, neb2: gold, neb2A: 0.03, hor: plum, horA: 0.18, limb: 0, calm: 0, meteors: 0, drift: 0 },
		// Dawn: the horizon warms from plum to rose for "Let's build something real".
		{ stars: 0.35, bright: 0.55, neb: rose, nebA: 0.1, nebX: 0.5, nebY: 0.8, neb2: gold, neb2A: 0.07, hor: dawn, horA: 0.38, limb: 0, calm: 0, meteors: 0, drift: 0 },
	];
}

function fixedState(mode: SkyMode, record: State): State {
	if (mode.kind === "lost") return { ...record, stars: 0.55, bright: 0.7, nebA: 0.07, calm: 1, limb: 0, drift: 1 };
	if (mode.kind === "record" && mode.tint) return { ...record, neb: themeRgb(mode.tint), nebA: 0.07, nebX: 0.82, nebY: 0.18 };
	return record;
}

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
function mix(a: State, b: State, t: number): State {
	const out = { ...a };
	for (const key of Object.keys(a) as (keyof State)[]) {
		const from = a[key];
		const to = b[key];
		(out as Record<string, unknown>)[key] = Array.isArray(from)
			? (from.map((v, i) => lerp(v, (to as RGB)[i], t)) as RGB)
			: lerp(from as number, to as number, t);
	}
	return out;
}

function seeded(seed: number) {
	let value = seed;
	return () => {
		value = (value * 16807) % 2147483647;
		return (value - 1) / 2147483646;
	};
}

const rgba = (c: RGB, a: number) => `rgba(${c[0] | 0}, ${c[1] | 0}, ${c[2] | 0}, ${Math.max(0, a).toFixed(3)})`;

export function Sky({ mode = { kind: "home" } }: { mode?: SkyMode }) {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const tint = mode.kind === "record" ? mode.tint : undefined;

	useEffect(() => {
		const canvas = canvasRef.current;
		const ctx = canvas?.getContext("2d");
		if (!canvas || !ctx) return;
		const CH = chapters();
		const fixed = mode.kind === "home" ? null : fixedState(mode, CH[3]);
		const background = themeColor("background");
		const tints: RGB[] = [themeRgb("starlight"), themeRgb("starlight-rose"), themeRgb("starlight-lilac"), themeRgb("starlight-ice")];
		const meteorColor = themeRgb("meteor-core");
		const limbColor = themeRgb("limb");
		let W = 0;
		let H = 0;
		let stars: { x: number; y: number; z: number; s: number; a: number; ph: number; c: RGB; rank: number }[] = [];
		let sections: { ch: number; top: number; h: number }[] = [];
		let still = getReducedMotion();
		let current = fixed ?? CH[0];
		let raf = 0;
		let meteor: { x: number; y: number; life: number } | null = null;
		let meteorWait = 160;
		const start = performance.now();

		const build = () => {
			const dpr = Math.min(window.devicePixelRatio || 1, 2);
			W = window.innerWidth;
			H = window.innerHeight;
			canvas.width = W * dpr;
			canvas.height = H * dpr;
			ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
			const r = seeded(9);
			const count = Math.round((W * H) / 1700);
			stars = Array.from({ length: count }, () => ({
				x: r(),
				y: r(),
				z: 0.2 + r() * 0.8,
				s: r() ** 4 * 1.6 + 0.35,
				a: 0.35 + r() * 0.65,
				ph: r() * Math.PI * 2,
				c: tints[r() < 0.8 ? 0 : 1 + Math.floor(r() * 3)],
				rank: r(),
			}));
		};
		const measure = () => {
			sections = [...document.querySelectorAll<HTMLElement>("[data-chapter]")].map((el) => {
				const rect = el.getBoundingClientRect();
				return { ch: Number(el.dataset.chapter), top: rect.top + window.scrollY, h: rect.height };
			});
		};
		const target = (): State => {
			if (fixed) return fixed;
			const mid = window.scrollY + H * 0.55;
			const points = sections.map((s) => ({ y: s.top + s.h / 2, ch: s.ch })).sort((a, b) => a.y - b.y);
			if (!points.length || mid <= points[0].y) return CH[points[0]?.ch ?? 0];
			for (let i = 0; i < points.length - 1; i++) {
				if (mid >= points[i].y && mid <= points[i + 1].y) {
					let t = (mid - points[i].y) / Math.max(points[i + 1].y - points[i].y, 1);
					t = t * t * (3 - 2 * t);
					return mix(CH[points[i].ch], CH[points[i + 1].ch], t);
				}
			}
			return CH[points[points.length - 1].ch];
		};
		const glow = (x: number, y: number, radius: number, color: RGB, alpha: number) => {
			if (alpha <= 0.002) return;
			const g = ctx.createRadialGradient(x, y, 0, x, y, radius);
			g.addColorStop(0, rgba(color, alpha));
			g.addColorStop(1, rgba(color, 0));
			ctx.fillStyle = g;
			ctx.fillRect(0, 0, W, H);
		};

		let last = 0;
		let lastScroll = -1;
		const draw = (now = performance.now()) => {
			raf = 0;
			// Idle twinkling only needs ~30fps; scrolling and chapter changes still draw every frame.
			const scrolling = window.scrollY !== lastScroll;
			lastScroll = window.scrollY;
			if (!still && !scrolling && now - last < 32) {
				raf = requestAnimationFrame(draw);
				return;
			}
			last = now;
			const t = (performance.now() - start) / 1000;
			const goal = target();
			current = mix(current, goal, still ? 1 : 0.08);
			const S = current;
			ctx.fillStyle = background;
			ctx.fillRect(0, 0, W, H);

			glow(W * S.nebX, H * S.nebY, Math.max(W, H) * 0.55, S.neb, S.nebA);
			glow(W * (1 - S.nebX * 0.6), H * (1 - S.nebY * 0.7), Math.max(W, H) * 0.5, S.neb2, S.neb2A);

			ctx.save();
			ctx.translate(W / 2, H * 1.08);
			ctx.scale(1.9, 0.55);
			const horizon = ctx.createRadialGradient(0, 0, 0, 0, 0, H * 0.9);
			horizon.addColorStop(0, rgba(S.hor, S.horA));
			horizon.addColorStop(1, rgba(S.hor, 0));
			ctx.fillStyle = horizon;
			ctx.beginPath();
			ctx.arc(0, 0, H * 0.9, 0, Math.PI * 2);
			ctx.fill();
			ctx.restore();

			// One star field for the whole site: density and brightness follow the chapter.
			const drift = (window.scrollY * 0.04) % H;
			const oval = { cx: W / 2, cy: H * 0.47, rx: Math.min(W * 0.44, 470), ry: Math.min(H * 0.3, 270) };
			for (const s of stars) {
				if (s.rank > S.stars) continue;
				const x = s.x * W;
				const y = (s.y * H - drift * s.z + H) % H;
				let fade = 1;
				if (S.calm > 0.01) {
					const d = ((x - oval.cx) / oval.rx) ** 2 + ((y - oval.cy) / oval.ry) ** 2;
					if (d < 1 && s.rank > 0.2) fade = 1 - S.calm * (1 - Math.max(0, (d - 0.45) / 0.55));
				}
				const twinkle = still ? 1 : 0.7 + 0.3 * Math.sin(t * (0.6 + s.z) + s.ph);
				ctx.globalAlpha = s.a * twinkle * S.bright * fade;
				ctx.fillStyle = rgba(s.c, 1);
				ctx.beginPath();
				ctx.arc(x, y, s.s, 0, Math.PI * 2);
				ctx.fill();
			}
			ctx.globalAlpha = 1;

			// Landing: the curve of a planet at the bottom of the screen.
			if (S.limb > 0.01) {
				const R = W * 1.6;
				const cy = H + R - H * 0.12 * S.limb;
				ctx.beginPath();
				ctx.arc(W / 2, cy, R, 0, Math.PI * 2);
				ctx.fillStyle = rgba(themeRgb("background"), 0.9 * S.limb);
				ctx.fill();
				ctx.lineWidth = 1.5;
				ctx.strokeStyle = rgba(limbColor, 0.3 * S.limb);
				ctx.stroke();
				glow(W / 2, H * 0.96, W * 0.6, S.neb, 0.06 * S.limb);
			}

			// Shooting stars: Arrival only, never through the calm oval, never when paused.
			if (!still && S.meteors > 0.5) {
				if (!meteor && --meteorWait <= 0) meteor = { x: W * (0.6 + Math.random() * 0.35), y: H * Math.random() * 0.18, life: 0 };
				if (meteor) {
					meteor.x -= 7;
					meteor.y += 3;
					meteor.life += 1;
					const g = ctx.createLinearGradient(meteor.x, meteor.y, meteor.x + 90, meteor.y - 38);
					g.addColorStop(0, rgba(meteorColor, 0.9));
					g.addColorStop(1, rgba(meteorColor, 0));
					ctx.strokeStyle = g;
					ctx.lineWidth = 1.4;
					ctx.beginPath();
					ctx.moveTo(meteor.x, meteor.y);
					ctx.lineTo(meteor.x + 90, meteor.y - 38);
					ctx.stroke();
					const d = ((meteor.x - oval.cx) / (oval.rx * 1.1)) ** 2 + ((meteor.y - oval.cy) / (oval.ry * 1.1)) ** 2;
					if (meteor.life > 80 || d < 1) {
						meteor = null;
						meteorWait = 300 + Math.random() * 400;
					}
				}
			}

			// 404: one star slowly drifting off course.
			if (S.drift > 0.5) {
				const speed = still ? 0 : t;
				const x = W * 0.5 + Math.cos(speed * 0.15) * W * 0.3;
				const y = H * 0.25 + Math.sin(speed * 0.21) * H * 0.08;
				glow(x, y, 24, tints[0], 0.8);
				ctx.fillStyle = rgba(tints[0], 1);
				ctx.beginPath();
				ctx.arc(x, y, 1.8, 0, Math.PI * 2);
				ctx.fill();
			}

			const settled = Math.abs(current.stars - goal.stars) < 0.002 && Math.abs(current.limb - goal.limb) < 0.002 && Math.abs(current.horA - goal.horA) < 0.002;
			if ((!still && !document.hidden) || !settled) raf = requestAnimationFrame(draw);
		};
		const kick = () => {
			if (!raf) raf = requestAnimationFrame(draw);
		};
		const onResize = () => {
			build();
			measure();
			kick();
		};
		const onScroll = () => kick();

		build();
		measure();
		draw();
		// Sections settle (fonts, images, lazy pages) after first paint; re-measure then.
		const observer = new ResizeObserver(() => {
			measure();
			kick();
		});
		observer.observe(document.body);
		window.addEventListener("scroll", onScroll, { passive: true });
		window.addEventListener("resize", onResize);
		document.addEventListener("visibilitychange", kick);
		const unsubscribe = subscribe((reduced) => {
			still = reduced;
			meteor = null;
			kick();
		});
		return () => {
			cancelAnimationFrame(raf);
			observer.disconnect();
			unsubscribe();
			window.removeEventListener("scroll", onScroll);
			window.removeEventListener("resize", onResize);
			document.removeEventListener("visibilitychange", kick);
		};
		// mode is compared by kind + tint so a new object each render doesn't rebuild the sky.
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [mode.kind, tint]);

	return <canvas ref={canvasRef} className="sky" aria-hidden data-sky={mode.kind} />;
}
