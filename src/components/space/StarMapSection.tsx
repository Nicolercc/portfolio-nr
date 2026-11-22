import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { RECEIPTS } from "../../data/proofs";
import { getStarSystems, type MapLink } from "../../data/starSystems";
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
	const [openReceipt, setOpenReceipt] = useState<string | null>(null);

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
	const closePanel = () => {
		select(null);
		returnFocusRef.current?.focus();
	};

	return (
		<section ref={sectionRef} className="space-hero" id="universe" data-mode={mode} data-open={Boolean(active)} aria-labelledby="universe-heading">
			<div className="space-hero__nebula" aria-hidden />

			<div className="space-hero__intro" inert={Boolean(active)}>
				<h2 id="universe-heading" className="space-hero__heading">
					Every star is
					<br />
					something I shipped.
				</h2>
				<p className="space-hero__tagline">Pick a star. Open a receipt.</p>

				<div className="proof-log">
					<h2 className="proof-log__title">
						<span>Proof log</span>
						<span className="proof-log__count">
							{RECEIPTS.length}/{RECEIPTS.length} claims have a receipt
						</span>
					</h2>
					<ul className="proof-log__list">
						{RECEIPTS.map((r) => {
							const open = openReceipt === r.id;
							const slipId = `receipt-${r.id}`;
							return (
								<li key={r.id} className="proof-log__item" data-open={open}>
									<div className="proof-log__row">
										<span className="proof-log__claim">
											<span className="proof-log__claim-text">{r.claim}</span>
											<span className="proof-log__source">{r.project}</span>
										</span>
										<button
											type="button"
											className="receipt-btn"
											aria-expanded={open}
											aria-controls={slipId}
											onClick={() => setOpenReceipt(open ? null : r.id)}
										>
											{open ? "Close" : "Receipt"}
											<span className="sr-only"> for {r.claim}</span>
										</button>
									</div>
									<div id={slipId} className="receipt-slip" hidden={!open}>
										<dl>
											{r.rows.map((row) => (
												<div key={row.label} className="receipt-slip__row">
													<dt>{row.label}</dt>
													<dd>{row.value}</dd>
												</div>
											))}
										</dl>
										<p className="receipt-slip__method">{r.method}</p>
										<p className="receipt-slip__scope">{r.scope}</p>
										<div className="receipt-slip__foot">
											<span className="receipt-slip__stamp">✓ Published evidence</span>
											<Link to={`/projects/${r.slug}`} className="receipt-slip__link">
												Full evidence in the {r.project} case study →
											</Link>
										</div>
									</div>
								</li>
							);
						})}
					</ul>
				</div>
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
							style={{ "--star": p.color } as React.CSSProperties}
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
						style={{ "--star": active.color } as React.CSSProperties}
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
