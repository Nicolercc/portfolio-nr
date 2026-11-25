import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import "./index.css";
import App from "./App";
import { setSmoothScroll } from "./lib/smoothScroll";

if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
	setSmoothScroll(new Lenis({ autoRaf: true }));
}

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<BrowserRouter>
			<App />
		</BrowserRouter>
	</StrictMode>,
);
