import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import "./index.css";
import App from "./App";
import { getSmoothScroll, setSmoothScroll } from "./lib/smoothScroll";
import { getReducedMotion, subscribe } from "./lib/motionPreference";

// Smooth scrolling is motion too: it stops with Pause motion and comes back on Play.
function syncSmoothScroll(reduced: boolean) {
	const current = getSmoothScroll();
	if (reduced && current) {
		current.destroy();
		setSmoothScroll(null);
	} else if (!reduced && !current) {
		setSmoothScroll(new Lenis({ autoRaf: true }));
	}
}
syncSmoothScroll(getReducedMotion());
subscribe(syncSmoothScroll);

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<BrowserRouter>
			<App />
		</BrowserRouter>
	</StrictMode>,
);
