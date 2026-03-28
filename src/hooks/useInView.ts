import { useEffect, useRef, useState } from "react";

export function useInView(threshold = 0.1) {
	const ref = useRef<HTMLDivElement>(null);
	const [inView, setInView] = useState(false);

	useEffect(() => {
		const obs = new IntersectionObserver(
			([e]) => {
				if (e?.isIntersecting) {
					setInView(true);
					obs.disconnect();
				}
			},
			{ threshold },
		);
		if (ref.current) obs.observe(ref.current);
		return () => obs.disconnect();
	}, [threshold]);

	return { ref, inView } as const;
}

