import { motion } from "framer-motion";

const items = [
	{
		title: "Pottery & Painting",
		subtitle: "Focus & Patience",
		size: "md:col-span-2",
		accent: "bg-burgundy/5",
	},
	{
		title: "Hiking",
		subtitle: "Endurance",
		size: "md:col-span-1",
		accent: "bg-forest/5",
	},
	{
		title: "Reading",
		subtitle: "Curiosity",
		size: "md:col-span-1",
		accent: "bg-white/[0.02]",
	},
	{
		title: "Travel",
		subtitle: "Perspective",
		size: "md:col-span-2",
		accent: "bg-burgundy/10",
	},
];

export function Bento() {
	return (
		<section id="about" className="py-32 px-6 md:px-12 max-w-7xl mx-auto">
			<div className="mb-16">
				<p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-4 font-bold">
					The Human Side
				</p>
				<h2 className="text-3xl md:text-5xl font-serif">
					Beyond the keyboard.
				</h2>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]">
				{items.map((item, i) => (
					<motion.div
						key={i}
						whileHover={{ y: -10 }}
						className={`relative rounded-[2.5rem] p-10 glass-panel overflow-hidden flex flex-col justify-end group ${item.size} ${item.accent}`}
					>
						{/* Background Texture/Image Placeholder */}
						<div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity duration-500 bg-gradient-to-br from-white/10 to-transparent" />

						<div className="relative z-10">
							<span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground block mb-2 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
								{item.subtitle}
							</span>
							<h3 className="text-2xl font-serif">{item.title}</h3>
						</div>
					</motion.div>
				))}
			</div>
		</section>
	);
}
