/**
 * Reads color tokens from src/index.css for code that cannot use CSS directly
 * (three.js, cobe, 2D canvas). index.css is the only place color values live;
 * this module only converts them. It keeps no fallback copies: a missing token
 * throws in development so a renamed token cannot silently fall back.
 */

export type ThemeColor =
	| "background"
	| "rose"
	| "star-sano"
	| "star-code4kidz"
	| "star-tripcanvas"
	| "star-ruvia"
	| "star-elite-global"
	| "star-van-alen"
	| "star-jt"
	| "starlight"
	| "starlight-rose"
	| "starlight-lilac"
	| "starlight-ice"
	| "moon"
	| "glow"
	| "galaxy-inner"
	| "galaxy-outer"
	| "nebula-rose"
	| "nebula-lilac"
	| "nebula-teal"
	| "nebula-violet"
	| "nebula-green"
	| "sky-white"
	| "sky-rose"
	| "sky-lilac"
	| "sky-green"
	| "sky-ice"
	| "meteor-head"
	| "meteor-core"
	| "meteor-tail"
	| "meteor-end"
	| "globe-base"
	| "globe-marker"
	| "globe-glow"
	| "globe-pin";

/** Token names that differ from `--color-<name>`. */
const ALIASES: Partial<Record<ThemeColor, string>> = { background: "--color-bg", rose: "--color-rose" };

// Tokens never change after the stylesheet loads; canvas code calls these every frame.
const cache = new Map<ThemeColor, string>();
const rgbCache = new Map<ThemeColor, [number, number, number]>();

/** The token's value as written in index.css, e.g. "#d4849a". */
export function themeColor(name: ThemeColor): string {
	const cached = cache.get(name);
	if (cached) return cached;
	const prop = ALIASES[name] ?? `--color-${name}`;
	const value = getComputedStyle(document.documentElement).getPropertyValue(prop).trim();
	if (!value) {
		if (import.meta.env.DEV) throw new Error(`Missing color token ${prop} in src/index.css`);
		return value;
	}
	cache.set(name, value);
	return value;
}

/** [r, g, b] in 0-255 for a #rrggbb token. */
export function themeRgb(name: ThemeColor): [number, number, number] {
	const cached = rgbCache.get(name);
	if (cached) return cached;
	const hex = themeColor(name).replace("#", "");
	const full = hex.length === 3 ? hex.split("").map((c) => c + c).join("") : hex;
	const n = Number.parseInt(full, 16);
	const rgb: [number, number, number] = [(n >> 16) & 255, (n >> 8) & 255, n & 255];
	if (full.length === 6) rgbCache.set(name, rgb);
	return rgb;
}

/** [r, g, b] in 0-1, the form cobe and some WebGL APIs expect. */
export function themeUnit(name: ThemeColor): [number, number, number] {
	const [r, g, b] = themeRgb(name);
	return [r / 255, g / 255, b / 255];
}

/** A canvas-ready color string for an already-resolved [r, g, b] at the given alpha. */
export function rgbAlpha([r, g, b]: readonly [number, number, number], alpha: number): string {
	return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/** A canvas-ready color string for the token at the given alpha. */
export function themeAlpha(name: ThemeColor, alpha: number): string {
	return rgbAlpha(themeRgb(name), alpha);
}
