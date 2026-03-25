import { Switch, Route } from "wouter";
import Home from "./pages/home";
import ProjectCaseStudy from "./pages/ProjectDetail"; // Your template
import { projectsData } from "./data/projects";

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
			<Route path="/work/:id">
				{(params) => {
					const project = projectsData[params.id as keyof typeof projectsData];
					if (!project) return <NotFound />;
					return <ProjectCaseStudy project={project} />;
				}}
			</Route>
			<Route component={NotFound} />
		</Switch>
	);
}
