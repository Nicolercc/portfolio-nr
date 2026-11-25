import { Reveal } from "../ui/Reveal";
import { ArrowRight } from "lucide-react";
import { mailtoHref, PROFILE } from "../../data/profile";
import { CopyEmailButton } from "../ui/CopyEmailButton";

export function Contact() {
	return (
		<section
			id="contact"
			data-chapter="5"
			className="section-rhythm px-6 text-center relative overflow-hidden"
		>

			<Reveal className="max-w-3xl mx-auto">
				{PROFILE.lookingFor ? (
					<p className="mx-auto mb-6 inline-flex max-w-xl items-center gap-2 font-mono text-caption text-muted-foreground">
						<span className="h-[7px] w-[7px] shrink-0 rounded-full bg-rose" aria-hidden />
						{PROFILE.lookingFor}
					</p>
				) : null}
				<h2 className="section-label">Contact</h2>
				<p className="text-5xl md:text-8xl font-serif italic mb-12">
					Let's build <br /> something real.
				</p>
				<a
					href={mailtoHref}
					className="inline-flex min-h-[44px] items-center gap-4 text-xl md:text-2xl hover:text-rose transition-colors duration-300 group"
				>
					{PROFILE.email}
					<ArrowRight className="group-hover:translate-x-2 transition-transform" />
				</a>
				<div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-center">
					<CopyEmailButton />
					<a
						href={PROFILE.resumePath}
						download
						className="btn-primary"
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
			</Reveal>
		</section>
	);
}
