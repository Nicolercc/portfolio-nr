import { Switch, Route } from "wouter";
import Home from "./pages/home";

function NotFound() {
	return (
		<div className="min-h-screen flex items-center justify-center bg-background text-foreground">
			<div className="text-center space-y-4">
				<h1 className="text-8xl font-serif text-muted-foreground">404</h1>
				<p className="text-xl text-muted-foreground">Page not found.</p>
				<a
					href="/"
					className="inline-block mt-4 text-foreground hover:text-white transition-colors"
				>
					Return Home
				</a>
			</div>
		</div>
	);
}

export default function App() {
	return (
		<Switch>
			<Route path="/" component={Home} />
			<Route component={NotFound} />
		</Switch>
	);
}
