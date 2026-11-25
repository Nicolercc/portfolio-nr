import { useSyncExternalStore } from "react";

/**
 * The one owner of "should things move?". Motion is reduced when the OS asks for it
 * or the visitor pressed Pause motion. Every animated piece of the site reads this,
 * so one switch stops all of it live, without a reload.
 */
const STORAGE_KEY = "portfolio-motion-paused";
const QUERY = "(prefers-reduced-motion: reduce)";

type Listener = (reduced: boolean) => void;
const listeners = new Set<Listener>();

function readPaused(): boolean {
	try {
		return localStorage.getItem(STORAGE_KEY) === "true";
	} catch {
		return false;
	}
}

let paused = typeof window === "undefined" ? false : readPaused();
let osReduced = typeof window === "undefined" ? false : window.matchMedia(QUERY).matches;

function apply() {
	if (typeof document === "undefined") return;
	const root = document.documentElement;
	if (osReduced || paused) root.dataset.motion = "reduce";
	else delete root.dataset.motion;
	root.dataset.motionPaused = String(paused);
}

function emit() {
	apply();
	const reduced = getReducedMotion();
	for (const listener of listeners) listener(reduced);
}

if (typeof window !== "undefined") {
	apply();
	window.matchMedia(QUERY).addEventListener("change", (event) => {
		osReduced = event.matches;
		emit();
	});
}

export function getReducedMotion(): boolean {
	return osReduced || paused;
}

export function isPaused(): boolean {
	return paused;
}

export function setPaused(next: boolean) {
	if (next === paused) return;
	paused = next;
	try {
		if (next) localStorage.setItem(STORAGE_KEY, "true");
		else localStorage.removeItem(STORAGE_KEY);
	} catch {
		// The choice still applies for this visit when storage is blocked.
	}
	emit();
}

export function subscribe(listener: Listener): () => void {
	listeners.add(listener);
	return () => listeners.delete(listener);
}

/** React hook: true while motion should be reduced (OS setting or Pause). */
export function useReducedMotion(): boolean {
	return useSyncExternalStore(subscribe, getReducedMotion, () => false);
}

/** React hook: true while the visitor has paused motion themselves. */
export function usePaused(): boolean {
	return useSyncExternalStore(subscribe, isPaused, () => false);
}
