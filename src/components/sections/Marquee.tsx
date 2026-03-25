const technologies = [
	"React",
	"TypeScript",
	"Tailwind CSS",
	"Framer Motion",
	"Astro",
	"Stripe",
	"Firebase",
	"PostgreSQL",
	"Figma",
];

export function Marquee() {
	return (
		<section className="py-24 overflow-hidden border-y border-white/5 bg-white/[0.01]">
			<div className="flex gap-20 animate-marquee whitespace-nowrap">
				{[...technologies, ...technologies].map((t, i) => (
					<span
						key={i}
						className="text-5xl md:text-8xl font-serif font-bold italic opacity-[0.03] hover:opacity-10 transition-opacity cursor-default uppercase tracking-tighter"
					>
						{t}
					</span>
				))}
			</div>
		</section>
	);
}
