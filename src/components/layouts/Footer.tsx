import { mailtoHref, PROFILE } from "../../data/profile";
import { CopyEmailButton } from "../ui/CopyEmailButton";

const linkClass =
	"inline-flex min-h-[44px] items-center text-sm text-muted-foreground transition-colors duration-150 hover:text-rose";

// Shared on every page so a reader who finishes a case study, a post or a 404
// always has a way to reach out.
export function Footer() {
	return (
		<footer className="relative z-10 border-t border-white/[0.06] px-6 md:px-12 py-10">
			<div className="max-w-7xl mx-auto flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
				<div className="flex flex-col gap-1">
					<p className="text-sm text-foreground">{PROFILE.name}</p>
					<p className="text-sm text-muted-foreground">
						{PROFILE.title} · {PROFILE.location}
					</p>
				</div>
				<ul className="flex flex-wrap items-center gap-x-6 gap-y-1" aria-label="Contact and profiles">
					<li>
						<a href={mailtoHref} className={linkClass}>
							{PROFILE.email}
						</a>
					</li>
					<li>
						<CopyEmailButton />
					</li>
					<li>
						<a href={PROFILE.resumePath} download className={linkClass}>
							Resume (PDF)
						</a>
					</li>
					<li>
						<a href={PROFILE.linkedin} target="_blank" rel="noopener noreferrer" className={linkClass}>
							LinkedIn
						</a>
					</li>
					<li>
						<a href={PROFILE.github} target="_blank" rel="noopener noreferrer" className={linkClass}>
							GitHub
						</a>
					</li>
				</ul>
			</div>
		</footer>
	);
}
