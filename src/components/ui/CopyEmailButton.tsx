import { useEffect, useRef, useState } from "react";
import { PROFILE } from "../../data/profile";

type CopyState = "idle" | "copied" | "failed";

// Many recruiters have no mail app set up, so a mailto link alone does nothing for them.
// This copies the address and confirms it visibly and through a polite live region.
export function CopyEmailButton({ className = "" }: { className?: string }) {
	const [state, setState] = useState<CopyState>("idle");
	const resetTimer = useRef<number | undefined>(undefined);

	useEffect(() => () => window.clearTimeout(resetTimer.current), []);

	async function copy() {
		try {
			await navigator.clipboard.writeText(PROFILE.email);
			setState("copied");
		} catch {
			setState("failed");
		}
		window.clearTimeout(resetTimer.current);
		resetTimer.current = window.setTimeout(() => setState("idle"), 2500);
	}

	const label = state === "copied" ? "Copied" : state === "failed" ? "Copy failed, select the address" : "Copy email";

	return (
		<>
			<button
				type="button"
				onClick={copy}
				className={`inline-flex min-h-[44px] items-center rounded-full border border-white/25 px-5 text-sm font-medium text-foreground transition-colors duration-150 hover:border-rose hover:text-rose ${className}`}
			>
				{label}
			</button>
			<span role="status" aria-live="polite" className="sr-only">
				{state === "copied" ? `Email address ${PROFILE.email} copied to clipboard` : ""}
				{state === "failed" ? "Could not copy. The email address is shown on the page." : ""}
			</span>
		</>
	);
}
