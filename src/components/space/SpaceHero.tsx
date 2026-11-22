import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { PROFILE } from "../../data/profile";
import { getProject, type Project, type ProjectSlug } from "../../data/projects";
import { RECEIPTS } from "../../data/proofs";
import type { StarMap } from "./StarMap";
import "./space-hero.css";

/** One star system per project, brightest first. */
const SYSTEM_SLUGS: ProjectSlug[] = ["sano", "code4kidz", "tripcanvas", "ruvia", "elite-global"];
/** Short, checkable line under each star; full numbers live in the case study. */
const SYSTEM_LINES: Record<string, string> = {
	sano: "0 axe violations, live",
	code4kidz: "29 → 0 failing checks",
	tripcanvas: "313 tests in CI",
	ruvia: "27 + 21 tests",
	"elite-global": "EN/ES client site",
};
const SYSTEM_COLORS: Record<string, string> = {
	sano: "#4ade80",
	code4kidz: "#ffb86b",
	tripcanvas: "#7cc7ff",
	ruvia: "#c3a0e1",
	"elite-global": "#d4849a",
};

type Mode = "loading" | "webgl" | "static";

function prefersReducedMotion() {
	return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export default function SpaceHero() {
	const systems = useMemo(
		() => SYSTEM_SLUGS.map((slug) => getProject(slug)).filter((p): p is Project => Boolean(p)),
		[],
	);
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
						color: SYSTEM_COLORS[p.slug] ?? "#d4849a",
						moons: p.metrics?.length ?? 1,
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

	// Leaving the hero tilts the galaxy away.
	useEffect(() => {
		const onScroll = () => {
			const el = sectionRef.current;
			if (!el || !engineRef.current) return;
			engineRef.current.setScroll(window.scrollY / Math.max(el.offsetHeight, 1));
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
		<section ref={sectionRef} className="space-hero" id="landing" data-mode={mode} data-open={Boolean(active)} aria-label="Introduction">
			<div className="space-hero__nebula" aria-hidden />

			<div className="space-hero__intro">
				<p className="space-hero__eyebrow">{PROFILE.eyebrow}</p>
				<h1 data-route-heading tabIndex={-1} className="space-hero__name">
					{PROFILE.name}
				</h1>
				<p className="space-hero__tagline">{PROFILE.tagline}</p>
				<div className="space-hero__actions landing__actions">
					<a href="#work" className="space-btn space-btn--primary">
						View selected work
					</a>
					<a href={PROFILE.resumePath} download className="space-btn space-btn--ghost">
						Download resume ↓
					</a>
				</div>

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
						{mode === "static" ? "Projects" : "Each star is a project. Pick one to fly in."}
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
							style={{ "--star": SYSTEM_COLORS[p.slug] } as React.CSSProperties}
							aria-pressed={selected === p.slug}
							onPointerEnter={() => setHovered(p.slug)}
							onPointerLeave={() => setHovered(null)}
							onFocus={() => setHovered(p.slug)}
							onBlur={() => setHovered(null)}
							onClick={() => select(selected === p.slug ? null : p.slug)}
						>
							<span className="star-label__dot" aria-hidden />
							<span className="star-label__name">{p.slug === "elite-global" ? "Elite Global" : p.title}</span>
							{SYSTEM_LINES[p.slug] ? (
								<span className="star-label__metric">{SYSTEM_LINES[p.slug]}</span>
							) : null}
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
						style={{ "--star": SYSTEM_COLORS[active.slug] } as React.CSSProperties}
					>
						<div className="system-panel__head">
							<p className="system-panel__kicker">System · {active.role}</p>
							<button type="button" className="system-panel__close" onClick={closePanel}>
								Back to map
							</button>
						</div>
						<h2 className="system-panel__title">{active.title}</h2>
						<p className="system-panel__tagline">{active.tagline}</p>
						{active.media.hero ? (
							<img
								src={active.media.hero}
								alt={active.media.alt ?? `${active.title} interface`}
								width={1440}
								height={900}
								loading="lazy"
								decoding="async"
								className="system-panel__shot"
							/>
						) : null}
						{active.metrics?.length ? (
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
							<Link to={`/projects/${active.slug}`} className="space-btn space-btn--primary">
								Open case study
							</Link>
							{active.links.live ? (
								<a href={active.links.live} target="_blank" rel="noreferrer" className="space-btn space-btn--ghost">
									Live site ↗
								</a>
							) : null}
						</div>
					</div>
				) : null}
			</div>
		</section>
	);
}
