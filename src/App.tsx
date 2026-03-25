import { Switch, Route } from "wouter";
import Home from "./pages/home";

export default function App() {
	return (
		<Switch>
			<Route path="/" component={Home} />
			{/* 404 handler can go here later */}
		</Switch>
	);
}
