import type Lenis from "lenis";

/** The page's smooth-scroll instance, or null when smooth scrolling is off. */
let instance: Lenis | null = null;

export function setSmoothScroll(lenis: Lenis | null) {
	instance = lenis;
}

export function getSmoothScroll(): Lenis | null {
	return instance;
}
