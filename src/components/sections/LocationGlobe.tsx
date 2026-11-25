import { getReducedMotion, subscribe } from "../../lib/motionPreference";
import createGlobe from "cobe";
import { useEffect, useRef, useState } from "react";
import { themeUnit } from "../../lib/themeColors";

type LocationGlobeProps = {
	className?: string;
	/** Display size in CSS pixels (buffer is scaled for sharpness). */
	size?: number;
};

/** NYC globe colors come from src/index.css (cobe wants RGB 0–1). */
function globeTheme() {
	return {
		baseColor: themeUnit("globe-base"),
		markerColor: themeUnit("globe-marker"),
		glowColor: themeUnit("globe-glow"),
		nycPin: themeUnit("globe-pin"),
	};
}

const NYC: [number, number] = [40.7128, -74.006];

const INITIAL_PHI = 2.38;
const INITIAL_THETA = 0.22;

function webglAvailable() {
	try {
		const probe = document.createElement("canvas");
		return Boolean(probe.getContext("webgl2") || probe.getContext("webgl"));
	} catch {
		return false;
	}
}

type GlobeControls = { spin: (delta: number) => void; reset: () => void };

export function LocationGlobe({ className, size = 148 }: LocationGlobeProps) {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const controlsRef = useRef<GlobeControls | null>(null);
	// The static SVG globe shows until the WebGL globe has drawn, and stays without WebGL (D12).
	const [ready, setReady] = useState(false);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas || !webglAvailable()) return;

		const dpr = Math.min(window.devicePixelRatio ?? 2, 2);
		let phi = INITIAL_PHI;
		let theta = INITIAL_THETA;
		let dragging = false;
		let lastX = 0;
		let lastY = 0;
		let rafId = 0;

		let autoRotate = !getReducedMotion();

		const THEME = globeTheme();
		const globe = createGlobe(canvas, {
			devicePixelRatio: dpr,
			width: size * 2,
			height: size * 2,
			phi,
			theta,
			dark: 1,
			diffuse: 1.32,
			mapSamples: 8000, // reduced from 12000 — visually identical, lighter on Safari WebGL
			mapBrightness: 5.4,
			mapBaseBrightness: 0.07,
			baseColor: THEME.baseColor,
			markerColor: THEME.markerColor,
			glowColor: THEME.glowColor,
			scale: 1,
			markers: [
				{
					location: NYC,
					size: 0.072,
					color: THEME.nycPin,
					id: "nyc",
				},
			],
			markerElevation: 0.045,
		});

		canvas.style.width = `${size}px`;
		canvas.style.height = `${size}px`;
		canvas.style.maxWidth = "100%";

		// Spins on its own only while motion is on; dragging still works when paused.
		let onScreen = true;
		let drawn = false;
		const loop = () => {
			if (autoRotate && !dragging) {
				phi += 0.0016;
			}
			globe.update({ phi, theta });
			if (!drawn) {
				drawn = true;
				setReady(true);
			}
			rafId = (autoRotate || dragging) && onScreen ? requestAnimationFrame(loop) : 0;
		};
		const kick = () => {
			if (rafId === 0 && !document.hidden && onScreen) rafId = requestAnimationFrame(loop);
		};
		rafId = requestAnimationFrame(loop);

		// Off screen, the globe stops drawing; it picks up again when it scrolls back (R4).
		const observer = new IntersectionObserver(([entry]) => {
			onScreen = entry.isIntersecting;
			if (onScreen) kick();
			else {
				cancelAnimationFrame(rafId);
				rafId = 0;
			}
		});
		observer.observe(canvas);

		controlsRef.current = {
			spin: (delta) => {
				phi += delta;
				kick();
			},
			reset: () => {
				phi = INITIAL_PHI;
				theta = INITIAL_THETA;
				kick();
			},
		};
		const unsubscribe = subscribe((reduced) => {
			autoRotate = !reduced;
			kick();
		});

		// Pause the RAF loop when the tab is hidden — prevents Safari from
		// accumulating WebGL work in the background and crashing the tab.
		const onVisibilityChange = () => {
			if (document.hidden) {
				cancelAnimationFrame(rafId);
				rafId = 0;
			} else {
				kick();
			}
		};
		document.addEventListener("visibilitychange", onVisibilityChange);

		const onPointerDown = (e: PointerEvent) => {
			dragging = true;
			kick();
			canvas.setPointerCapture(e.pointerId);
			lastX = e.clientX;
			lastY = e.clientY;
		};

		const onPointerMove = (e: PointerEvent) => {
			if (!dragging) return;
			const dx = e.clientX - lastX;
			const dy = e.clientY - lastY;
			lastX = e.clientX;
			lastY = e.clientY;
			phi += dx * 0.005;
			theta = Math.max(
				-Math.PI / 2 + 0.18,
				Math.min(Math.PI / 2 - 0.18, theta + dy * 0.0032),
			);
		};

		const onPointerUp = (e: PointerEvent) => {
			dragging = false;
			try {
				canvas.releasePointerCapture(e.pointerId);
			} catch {
				/* already released */
			}
		};

		const onLostCapture = () => {
			dragging = false;
		};

		const onDblClick = () => {
			phi = INITIAL_PHI;
			theta = INITIAL_THETA;
			kick();
		};

		canvas.addEventListener("pointerdown", onPointerDown);
		canvas.addEventListener("pointermove", onPointerMove);
		canvas.addEventListener("pointerup", onPointerUp);
		canvas.addEventListener("pointercancel", onPointerUp);
		canvas.addEventListener("lostpointercapture", onLostCapture);
		canvas.addEventListener("dblclick", onDblClick);

		return () => {
			cancelAnimationFrame(rafId);
			observer.disconnect();
			controlsRef.current = null;
			unsubscribe();
			document.removeEventListener("visibilitychange", onVisibilityChange);
			canvas.removeEventListener("pointerdown", onPointerDown);
			canvas.removeEventListener("pointermove", onPointerMove);
			canvas.removeEventListener("pointerup", onPointerUp);
			canvas.removeEventListener("pointercancel", onPointerUp);
			canvas.removeEventListener("lostpointercapture", onLostCapture);
			canvas.removeEventListener("dblclick", onDblClick);
			globe.destroy();
		};
	}, [size]);

	const button =
		"inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-muted-foreground transition-colors duration-150 hover:border-rose hover:text-rose";

	return (
		<div className={className}>
			<div
				className="relative mx-auto overflow-hidden rounded-full ring-1 ring-white/10 shadow-[0_0_36px_-10px_color-mix(in_srgb,var(--color-rose)_35%,transparent)]"
				style={{ width: size, height: size, maxWidth: "100%" }}
			>
				<img
					src="/media/globe-nyc.svg"
					alt=""
					width={size}
					height={size}
					className={`absolute inset-0 size-full transition-opacity duration-300 ${ready ? "opacity-0" : "opacity-100"}`}
				/>
				<canvas
					ref={canvasRef}
					role="img"
					aria-label="Globe with a green pin on New York City. Drag or use the buttons below to spin it."
					className={`relative block size-full cursor-grab active:cursor-grabbing ${ready ? "opacity-100" : "opacity-0"}`}
				/>
			</div>
			<p className="mt-3 text-center text-sm text-foreground">New York City · open to remote</p>
			<div className="mt-3 flex items-center justify-center gap-2" role="group" aria-label="Spin the globe">
				<button type="button" className={button} aria-label="Rotate globe left" onClick={() => controlsRef.current?.spin(-0.35)}>
					<span aria-hidden>←</span>
				</button>
				<button type="button" className={button} aria-label="Reset globe" onClick={() => controlsRef.current?.reset()}>
					<span aria-hidden>↺</span>
				</button>
				<button type="button" className={button} aria-label="Rotate globe right" onClick={() => controlsRef.current?.spin(0.35)}>
					<span aria-hidden>→</span>
				</button>
			</div>
			<p className="mt-2 text-center text-caption leading-tight text-muted-foreground">Drag or use the buttons to spin.</p>
		</div>
	);
}
