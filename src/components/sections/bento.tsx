import { motion } from "framer-motion";

// SWAP image src values for real photos placed in /public/images/
const interests = [
	{
		title: "Pottery & Painting",
		subtitle: "Focus & Patience",
		description:
			"Crafting with hands, making something tangible and perfectly imperfect.",
		className: "md:col-span-2 md:row-span-2",
		image: "/images/bento-pottery.png",
		overlay: "bg-burgundy/20",
	},
	{
		title: "Hiking",
		subtitle: "Perspective & Endurance",
		description: "Trails remind me why clarity and moving forward matters.",
		className: "md:col-span-1 md:row-span-1",
		image: "/images/bento-hiking.png",
		overlay: "bg-forest/20",
	},
	{
		title: "Reading in Nature",
		subtitle: "Continuous Learning",
		description: "Books and parks are the ultimate pairing for growth.",
		className: "md:col-span-1 md:row-span-1",
		image: "/images/bento-reading.png",
		overlay: "bg-black/40",
	},
	{
		title: "Travel",
		subtitle: "Curiosity",
		description: "Seeing the world through entirely different lenses.",
		className: "md:col-span-2 md:row-span-1",
		image: "/images/bento-travel.png",
		overlay: "bg-burgundy/10",
	},
];

export function Bento() {
	return (
		<section id="about" className="py-32 px-6 md:px-12 max-w-7xl mx-auto">
			<div className="mb-16">
				<h2 className="text-sm uppercase tracking-[0.3em] text-muted-foreground mb-4">
					Beyond the Code
				</h2>
				<p className="text-3xl md:text-5xl font-serif max-w-2xl leading-tight">
					What shapes my perspective.
				</p>
			</div>
			<div className="grid grid-cols-1 md:grid-cols-3 auto-rows-[280px] gap-4 md:gap-6">
				{interests.map((item, i) => (
					<motion.div
						key={item.title}
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true, margin: "-100px" }}
						transition={{ duration: 0.7, delay: i * 0.1 }}
						className={`group relative rounded-3xl overflow-hidden glass-panel ${item.className}`}
					>
						<div className="absolute inset-0 z-0">
							<img
								src={item.image}
								alt={item.title}
								className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
							/>
							<div
								className={`absolute inset-0 ${item.overlay} transition-opacity duration-500 group-hover:opacity-80`}
							/>
							<div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/40 to-transparent" />
						</div>
						<div className="absolute inset-0 z-10 p-8 flex flex-col justify-end">
							<span className="text-xs uppercase tracking-widest text-white/70 mb-2 block transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
								{item.subtitle}
							</span>
							<h3 className="text-2xl font-serif mb-2 text-white">
								{item.title}
							</h3>
							<p className="text-white/60 text-sm max-w-sm transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-75">
								{item.description}
							</p>
						</div>
					</motion.div>
				))}
			</div>
		</section>
	);
}
