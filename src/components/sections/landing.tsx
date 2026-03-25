import { useEffect, useRef } from "react";
import "./landing.css";

export default function Landing() {
	const canvasRef = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		let width = (canvas.width = window.innerWidth);
		let height = (canvas.height = window.innerHeight);

		const handleResize = () => {
			width = canvas.width = window.innerWidth;
			height = canvas.height = window.innerHeight;
			initParticles();
		};
		window.addEventListener("resize", handleResize);

		interface Particle {
			x: number;
			y: number;
			r: number;
			vx: number;
			vy: number;
			alpha: number;
			alphaDir: number;
		}

		const COUNT = 55;
		const particles: Particle[] = [];

		function initParticles() {
			particles.length = 0;
			for (let i = 0; i < COUNT; i++) {
				particles.push({
					x: Math.random() * width,
					y: Math.random() * height,
					r: Math.random() * 2.5 + 0.5,
					vx: (Math.random() - 0.5) * 0.25,
					vy: (Math.random() - 0.5) * 0.25,
					alpha: Math.random() * 0.5 + 0.1,
					alphaDir: Math.random() > 0.5 ? 0.003 : -0.003,
				});
			}
		}
		initParticles();

		let animId: number;
		function draw() {
			if (!ctx) return;
			ctx.clearRect(0, 0, width, height);
			for (const p of particles) {
				p.x += p.vx;
				p.y += p.vy;
				p.alpha += p.alphaDir;
				if (p.alpha >= 0.65 || p.alpha <= 0.05) p.alphaDir *= -1;
				if (p.x < 0) p.x = width;
				if (p.x > width) p.x = 0;
				if (p.y < 0) p.y = height;
				if (p.y > height) p.y = 0;
				ctx.beginPath();
				ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
				ctx.fillStyle = `rgba(212, 132, 154, ${p.alpha})`;
				ctx.fill();
			}
			animId = requestAnimationFrame(draw);
		}
		draw();

		return () => {
			cancelAnimationFrame(animId);
			window.removeEventListener("resize", handleResize);
		};
	}, []);

	const handleScroll = () => {
		const hero = document.getElementById("hero");
		if (hero) hero.scrollIntoView({ behavior: "smooth" });
	};

	return (
		<section className="landing" id="landing">
			<canvas ref={canvasRef} className="landing__canvas" />

			<div className="landing__content">
				<span className="landing__eyebrow">
					Full Stack Developer & Media Strategist
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
