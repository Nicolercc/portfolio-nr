import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { RECEIPTS } from "../../data/proofs";
import { getStarSystems, starCss, type MapLink } from "../../data/starSystems";
import type { StarMap } from "./StarMap";
import "./space-hero.css";

function PanelLink({ link, variant, onNavigate }: { link: MapLink; variant: "primary" | "ghost"; onNavigate?: () => void }) {
	const className = `space-btn space-btn--${variant}`;
	if (link.to) {
		return (
			<Link to={link.to} className={className}>
				{link.label}
			</Link>
		);
	}
	const external = Boolean(link.href?.startsWith("http"));
	return (
		<a
			href={link.href}
			className={className}
			onClick={onNavigate}
			{...(external ? { target: "_blank", rel: "noreferrer" } : {})}
		>
			{link.label}
		</a>
	);
}

function ProjectReceipt({ receipt }: { receipt: (typeof RECEIPTS)[number] }) {
	const [open, setOpen] = useState(false);
	const slipId = `receipt-${receipt.id}`;

	return (
		<div className="panel-receipt">
			<div className="panel-receipt__row">
				<span>{receipt.claim}</span>
				<button
					type="button"
					className="receipt-btn"
					aria-expanded={open}
					aria-controls={slipId}
					onClick={() => setOpen(!open)}
				>
					{open ? "Close receipt" : "Receipt"}
				</button>
			</div>
			<div id={slipId} className="receipt-slip" hidden={!open}>
				<dl>
					{receipt.rows.map(({ label, value }) => (
						<div key={label} className="receipt-slip__row">
							<dt>{label}</dt>
							<dd>{value}</dd>
						</div>
					))}
				</dl>
				<p className="receipt-slip__method">{receipt.method}</p>
				<p className="receipt-slip__scope">{receipt.scope}</p>
				<div className="receipt-slip__foot">
					<span className="receipt-slip__stamp">✓ Published evidence</span>
					<Link to={`/projects/${receipt.slug}`} className="receipt-slip__link">
						Full evidence in the {receipt.project} case study →
					</Link>
				</div>
			</div>
		</div>
	);
}

type Mode = "loading" | "webgl" | "static";

function prefersReducedMotion() {
	return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export default function StarMapSection() {
	const systems = useMemo(() => getStarSystems(), []);
	const mapRef = useRef<HTMLDivElement>(null);
	const sectionRef = useRef<HTMLElement>(null);
	const labelRefs = useRef(new Map<string, HTMLElement>());
	const engineRef = useRef<StarMap | null>(null);
	const panelRef = useRef<HTMLDivElement>(null);
	const returnFocusRef = useRef<HTMLElement | null>(null);
	const [mode, setMode] = useState<Mode>("loading");
	const [hovered, setHovered] = useState<string | null>(null);
	const [selected, setSelected] = useState<string | null>(null);

	const select = useCallback((slug: string | null) => {
		if (slug) returnFocusRef.current = labelRefs.current.get(slug) ?? null;
		setSelected(slug);
		engineRef.current?.focus(slug);
	}, []);

	// Boot the 3D scene after first paint; fall back to a flat map without WebGL.
	useEffect(() => {
		const container = mapRef.current;
		if (!container) return;
		let disposed = false;
		let engine: StarMap | null = null;
		const boot = async () => {
			const mod = await import("./StarMap");
			if (disposed) return;
			if (!mod.webglAvailable()) {
				setMode("static");
				return;
			}
			try {
				engine = new mod.StarMap({
					container,
					labels: labelRefs.current,
					reducedMotion: prefersReducedMotion(),
					systems: systems.map((p) => ({
						slug: p.slug,
						color: p.color,
						moons: p.metrics.length || 1,
						emphasis: p.slug === "sano",
					})),
					onHover: setHovered,
					onSelect: (slug) => select(slug),
				});
				engineRef.current = engine;
				setMode("webgl");
			} catch {
				setMode("static");
			}
		};
		const idle = globalThis.requestIdleCallback ?? ((cb: () => void) => globalThis.setTimeout(cb, 60));
		idle(() => void boot());
		return () => {
			disposed = true;
			engine?.dispose();
			engineRef.current = null;
		};
	}, [systems, select]);

	// Scrolling past the section tilts the galaxy away.
	useEffect(() => {
		const onScroll = () => {
			const el = sectionRef.current;
			if (!el) return;
			// Leaving the map closes an open system, so the phone sheet never follows you down the page.
			const rect = el.getBoundingClientRect();
			if (rect.bottom < window.innerHeight * 0.25 || rect.top > window.innerHeight * 0.75) setSelected((cur) => {
				if (cur) engineRef.current?.focus(null);
				return null;
			});
			if (!engineRef.current) return;
			engineRef.current.setScroll((window.scrollY - el.offsetTop) / Math.max(el.offsetHeight, 1));
		};
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => window.removeEventListener("scroll", onScroll);
	}, []);

	useEffect(() => {
		engineRef.current?.setHighlight(hovered);
	}, [hovered]);

	// The panel takes focus when it opens and gives it back when it closes.
	useEffect(() => {
		if (selected) {
			panelRef.current?.focus();
			const onKey = (e: KeyboardEvent) => {
				if (e.key === "Escape") {
					select(null);
					returnFocusRef.current?.focus();
				}
			};
			window.addEventListener("keydown", onKey);
			return () => window.removeEventListener("keydown", onKey);
		}
	}, [selected, select]);

	const active = selected ? systems.find((p) => p.slug === selected) : undefined;
	const receipt = active && RECEIPTS.find(({ slug }) => slug === active.slug);
	const closePanel = () => {
		select(null);
		returnFocusRef.current?.focus();
	};

	return (
		<section ref={sectionRef} className="space-hero" id="universe" data-mode={mode} data-open={Boolean(active)} aria-labelledby="universe-heading">
			<div className="space-hero__nebula" aria-hidden />

			<div className="space-hero__intro" inert={Boolean(active)}>
				<h2 id="universe-heading" className="section-label">
					Projects
				</h2>
				<p className="space-hero__heading">
					Every star is
					<br />
					something I've built.
				</p>
				<p className="space-hero__tagline">Pick a star. Open a receipt.</p>

				<p className="receipt-count">{RECEIPTS.length} receipts on this page</p>
			</div>

			<div ref={mapRef} className="starmap" data-has-selection={Boolean(active)}>
				<div className="starmap__labels" role="group" aria-label="Star map: one system per project">
					<p className="starmap__hint" aria-hidden={mode === "static"}>
						{mode === "static" ? "Projects" : "Pick a star to fly in."}
					</p>
					{systems.map((p) => (
						<button
							key={p.slug}
							type="button"
							ref={(el) => {
								if (el) labelRefs.current.set(p.slug, el);
								else labelRefs.current.delete(p.slug);
							}}
							className="star-label"
							data-lit={hovered === p.slug || selected === p.slug}
							style={{ "--star": starCss(p.color) } as React.CSSProperties}
							aria-pressed={selected === p.slug}
							onPointerEnter={() => setHovered(p.slug)}
							onPointerLeave={() => setHovered(null)}
							onFocus={() => setHovered(p.slug)}
							onBlur={() => setHovered(null)}
							onClick={() => select(selected === p.slug ? null : p.slug)}
						>
							<span className="star-label__dot" aria-hidden />
							<span className="star-label__name">{p.title}</span>
							<span className="star-label__metric">{p.line}</span>
						</button>
					))}
				</div>

				{active ? (
					<div
						ref={panelRef}
						tabIndex={-1}
						className="system-panel"
						role="region"
						aria-label={`${active.title} system`}
						style={{ "--star": starCss(active.color) } as React.CSSProperties}
					>
						<div className="system-panel__head">
							<p className="system-panel__kicker">System · {active.role}</p>
							<button type="button" className="system-panel__close" onClick={closePanel}>
								Back to map
							</button>
						</div>
						<h2 className="system-panel__title">{active.title}</h2>
						<p className="system-panel__tagline">{active.tagline}</p>
						{active.image ? (
							<img
								src={active.image.src}
								alt={active.image.alt}
								width={1440}
								height={900}
								loading="lazy"
								decoding="async"
								className="system-panel__shot"
							/>
						) : null}
						{active.metrics.length ? (
							<dl className="system-panel__metrics">
								{active.metrics.slice(0, 3).map((m) => (
									<div key={m.label}>
										<dt>{m.label}</dt>
										<dd>{m.value}</dd>
									</div>
								))}
							</dl>
						) : null}
						{receipt && <ProjectReceipt key={receipt.id} receipt={receipt} />}
						<div className="system-panel__actions">
							<PanelLink link={active.primary} variant="primary" onNavigate={() => select(null)} />
							{active.secondary ? <PanelLink link={active.secondary} variant="ghost" /> : null}
						</div>
					</div>
				) : null}
			</div>
		</section>
	);
}
