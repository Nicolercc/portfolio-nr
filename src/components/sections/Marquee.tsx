import { useReducedMotion } from "../../lib/motionPreference";

const PHRASE = ["Nicole Rodriguez", "Let's build something real"];

/**
 * The closing band above Contact: huge outlined Cormorant on one slow 60s loop.
 * Decorative (aria-hidden); it stops with Pause motion or the OS setting (D19).
 */
export function Marquee() {
	const reduced = useReducedMotion();
	const run = [...PHRASE, ...PHRASE];

	return (
		<section aria-hidden="true" data-a11y-decorative data-chapter="5" className="closing-marquee overflow-hidden py-12">
			<div className={`flex w-max items-center gap-12 whitespace-nowrap ${reduced ? "" : "closing-marquee__track"}`}>
				{(reduced ? PHRASE : run).map((text, i) => (
					<span key={i} className="flex items-center gap-12">
						<span className="closing-marquee__text">{text}</span>
						<span className="closing-marquee__star">✦</span>
					</span>
				))}
			</div>
		</section>
	);
}
