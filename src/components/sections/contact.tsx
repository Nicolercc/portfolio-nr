import { useInView } from "../../hooks/useInView";
import { ArrowRight } from "lucide-react";

export function Contact() {
	const { ref, inView } = useInView();
	return (
		<section
			id="contact"
			className="py-40 px-6 text-center relative overflow-hidden"
		>
			<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-rose/5 rounded-full blur-[140px] pointer-events-none" />

			<div
				ref={ref}
				style={{
					opacity: inView ? 1 : 0,
					transform: inView ? "none" : "scale(0.96)",
					transition:
						"opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1), transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)",
				}}
				className="max-w-3xl mx-auto"
			>
				<h2 className="text-5xl md:text-8xl font-serif italic mb-12">
					Let's build <br /> something real.
				</h2>
				<a
					href="mailto:hello@nicolerodriguez.me"
					className="inline-flex items-center gap-4 text-xl md:text-2xl font-light hover:text-rose transition-colors duration-300 group"
				>
					nicolerodriguez@pursuit.org
					<ArrowRight className="group-hover:translate-x-2 transition-transform" />
				</a>
			</div>
		</section>
	);
}
