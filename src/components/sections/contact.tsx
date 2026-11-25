import { useInView } from "../../hooks/useInView";
import { ArrowRight } from "lucide-react";
import { mailtoHref, PROFILE } from "../../data/profile";
import { CopyEmailButton } from "../ui/CopyEmailButton";

export function Contact() {
	const { ref, inView } = useInView();

	return (
		<section
			id="contact"
			className="py-[88px] lg:py-40 px-6 text-center relative overflow-hidden"
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
				{PROFILE.lookingFor ? (
					<p className="mx-auto mb-6 inline-flex max-w-xl items-center gap-2 font-mono text-caption text-muted-foreground">
						<span className="h-[7px] w-[7px] shrink-0 rounded-full bg-green" aria-hidden />
						{PROFILE.lookingFor}
					</p>
				) : null}
				<h2 className="section-label">Contact</h2>
				<p className="text-5xl md:text-8xl font-serif italic mb-12">
					Let's build <br /> something real.
				</p>
				<a
					href={mailtoHref}
					className="inline-flex min-h-[44px] items-center gap-4 text-xl md:text-2xl font-light hover:text-rose transition-colors duration-300 group"
				>
					{PROFILE.email}
					<ArrowRight className="group-hover:translate-x-2 transition-transform" />
				</a>
				<div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-center">
					<CopyEmailButton />
					<a
						href={PROFILE.resumePath}
						download
						className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-action px-5 text-sm font-medium text-[#0d0d0d] transition-colors duration-150 hover:bg-action/85"
					>
						Download resume
					</a>
					<a
						href={PROFILE.linkedin}
						target="_blank"
						rel="noopener noreferrer"
						className="inline-flex min-h-[44px] items-center justify-center px-3 text-sm text-muted-foreground hover:text-rose"
					>
						LinkedIn
					</a>
					<a
						href={PROFILE.github}
						target="_blank"
						rel="noopener noreferrer"
						className="inline-flex min-h-[44px] items-center justify-center px-3 text-sm text-muted-foreground hover:text-rose"
					>
						GitHub
					</a>
				</div>
			</div>
		</section>
	);
}
