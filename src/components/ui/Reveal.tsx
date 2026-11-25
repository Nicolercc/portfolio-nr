import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { useReducedMotion } from "../../lib/motionPreference";

/**
 * The one section entrance: fade + 16px rise, once, on the shared easing (700ms).
 * Content is readable without it: with motion off it renders in its final state.
 */
export function Reveal({ children, className, as = "div" }: { children: ReactNode; className?: string; as?: "div" | "section" | "article" | "header" }) {
	const reduced = useReducedMotion();
	const Tag = motion[as];
	if (reduced) {
		const Plain = as;
		return <Plain className={className}>{children}</Plain>;
	}
	return (
		<Tag
			className={className}
			initial={{ opacity: 0, y: 16 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true, margin: "0px 0px -10% 0px" }}
			transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
		>
			{children}
		</Tag>
	);
}
