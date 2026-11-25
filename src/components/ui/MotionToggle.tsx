import { Pause, Play } from "lucide-react";
import { setPaused, usePaused } from "../../lib/motionPreference";

/**
 * Pause motion: one switch for every animation on the site (D13). The accessible
 * name stays "Pause motion" and aria-pressed says whether it is on.
 */
export function MotionToggle({ compact = false, className = "" }: { compact?: boolean; className?: string }) {
	const paused = usePaused();
	const Icon = paused ? Play : Pause;
	return (
		<button
			type="button"
			aria-pressed={paused}
			onClick={() => setPaused(!paused)}
			data-motion-toggle
			className={`inline-flex min-h-[44px] min-w-[44px] items-center justify-center gap-2 rounded-full border border-white/15 px-3 text-sm text-muted-foreground transition-colors duration-150 hover:border-rose hover:text-rose aria-pressed:text-foreground ${className}`}
		>
			<Icon aria-hidden className="h-4 w-4 shrink-0" />
			<span className={compact ? "max-sm:sr-only" : ""}>Pause motion</span>
		</button>
	);
}
