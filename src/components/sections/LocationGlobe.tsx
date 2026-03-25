import createGlobe from "cobe";
import { useEffect, useRef } from "react";

type LocationGlobeProps = {
	className?: string;
	/** Display size in CSS pixels (buffer is scaled for sharpness). */
	size?: number;
};

/** NYC — colors aligned with Midnight Rose / green accents (COBE uses RGB 0–1). */
const THEME = {
	baseColor: [0.14, 0.09, 0.1] as [number, number, number],
	markerColor: [0.22, 0.38, 0.26] as [number, number, number],
	glowColor: [0.36, 0.2, 0.24] as [number, number, number],
	nycPin: [0.26, 0.48, 0.34] as [number, number, number],
};

const NYC: [number, number] = [40.7128, -74.006];

const INITIAL_PHI = 2.38;
const INITIAL_THETA = 0.22;

export function LocationGlobe({ className, size = 148 }: LocationGlobeProps) {
	const canvasRef = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const dpr = Math.min(window.devicePixelRatio ?? 2, 2);
		let phi = INITIAL_PHI;
		let theta = INITIAL_THETA;
		let dragging = false;
		let lastX = 0;
		let lastY = 0;
		let rafId = 0;

		let autoRotate = true;
		try {
			autoRotate = !window.matchMedia("(prefers-reduced-motion: reduce)")
				.matches;
		} catch {
			/* ignore */
		}

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

		const loop = () => {
			if (autoRotate && !dragging) {
				phi += 0.0016;
			}
			globe.update({ phi, theta });
			rafId = requestAnimationFrame(loop);
		};
		rafId = requestAnimationFrame(loop);

		// Pause the RAF loop when the tab is hidden — prevents Safari from
		// accumulating WebGL work in the background and crashing the tab.
		const onVisibilityChange = () => {
			if (document.hidden) {
				cancelAnimationFrame(rafId);
			} else {
				rafId = requestAnimationFrame(loop);
			}
		};
		document.addEventListener("visibilitychange", onVisibilityChange);

		const onPointerDown = (e: PointerEvent) => {
			dragging = true;
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
		};

		canvas.addEventListener("pointerdown", onPointerDown);
		canvas.addEventListener("pointermove", onPointerMove);
		canvas.addEventListener("pointerup", onPointerUp);
		canvas.addEventListener("pointercancel", onPointerUp);
		canvas.addEventListener("lostpointercapture", onLostCapture);
		canvas.addEventListener("dblclick", onDblClick);

		return () => {
			cancelAnimationFrame(rafId);
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

	return (
		<div className={className}>
			<div
				className="relative mx-auto overflow-hidden rounded-full ring-1 ring-white/10 shadow-[0_0_36px_-10px_rgba(212,132,154,0.35)]"
				style={{ width: size, height: size }}
			>
				<canvas
					ref={canvasRef}
					role="img"
					aria-label="Interactive globe. A green marker shows New York City. Drag to rotate; double-click to reset the view."
					className="block size-full cursor-grab active:cursor-grabbing"
				/>
			</div>
			<p className="mt-2 text-center text-[10px] leading-tight text-muted-foreground/85">
				Drag to orbit · Double-click to reset
			</p>
		</div>
	);
}
