import { getReducedMotion } from "../../lib/motionPreference";
import { PROFILE } from "../../data/profile";
import "./landing.css";

/**
 * Arrival: the first chapter of the sky. The stars, calm oval and shooting stars
 * live in the shared Sky (src/components/layouts/Sky.tsx) behind the page.
 */
export default function Landing() {
	const handleScroll = () => {
		const work = document.getElementById("universe");
		const reduceMotion = getReducedMotion();
		if (work) {
			work.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
		}
	};

	return (
		<section className="landing" id="landing" data-chapter="0">

			<div className="landing__content">
				<span className="landing__eyebrow">
					{PROFILE.eyebrow}
				</span>
				<h1 data-route-heading tabIndex={-1} className="landing__name">
					{PROFILE.name}
				</h1>
				<p className="landing__tagline">
					{PROFILE.tagline}
				</p>

				{PROFILE.lookingFor ? (
					<p className="landing__meta landing__location">
						<span className="landing__roles-dot" aria-hidden />
						{PROFILE.lookingFor}
					</p>
				) : null}

				<div className="landing__actions">
					<a href="#universe" className="btn-primary">
						See the work
					</a>
					<a
						href={PROFILE.resumePath}
						download
						className="btn-secondary"
						aria-label="Download resume"
					>
						Download resume <span aria-hidden="true">↓</span>
					</a>
				</div>
			</div>

			<button
				className="landing__scroll-cue"
				onClick={handleScroll}
				aria-label="Scroll to the star map"
			>
				<span className="landing__scroll-label">scroll</span>
				<span className="landing__scroll-arrow">↓</span>
			</button>
		</section>
	);
}
