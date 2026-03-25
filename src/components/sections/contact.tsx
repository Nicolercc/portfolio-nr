import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export function Contact() {
	return (
		<section
			id="contact"
			className="py-40 px-6 text-center relative overflow-hidden"
		>
			<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-rose/5 rounded-full blur-[140px] pointer-events-none" />

			<motion.div
				initial={{ opacity: 0, scale: 0.9 }}
				whileInView={{ opacity: 1, scale: 1 }}
				viewport={{ once: true }}
				className="max-w-3xl mx-auto"
			>
				<h2 className="text-5xl md:text-8xl font-serif italic mb-12">
					Let's build <br /> something real.
				</h2>
				<a
					href="mailto:hello@nicolerodriguez.me"
					className="inline-flex items-center gap-4 text-xl md:text-2xl font-light hover:text-rose transition-colors duration-300 group"
				>
					hello@nicolerodriguez.me
					<ArrowRight className="group-hover:translate-x-2 transition-transform" />
				</a>
			</motion.div>
		</section>
	);
}
