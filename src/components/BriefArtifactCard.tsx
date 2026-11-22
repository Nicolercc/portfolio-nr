import type { BriefArtifact } from "../data/projects";

export function BriefArtifactCard({ artifact }: { artifact: BriefArtifact }) {
	return (
		<figure className="min-w-0 rounded-xl border border-white/10 bg-card p-4 sm:p-5">
			<figcaption className="mb-3 text-caption font-mono text-muted-foreground">{artifact.title}</figcaption>
			{artifact.format === "terminal" ? (
				<pre className="whitespace-pre-wrap break-words text-caption font-mono">{artifact.snippet}</pre>
			) : (
				<ul className="space-y-2 text-caption">
					{artifact.relationships.map(([from, relationship, to]) => (
						<li key={from} className="flex flex-wrap items-center gap-2">
							<span className="rounded border border-white/20 px-2 py-1 font-mono">{from}</span>
							<span className="text-muted-foreground">{relationship} <span aria-hidden="true">→</span></span>
							<span className="rounded border border-white/20 px-2 py-1 font-mono">{to}</span>
						</li>
					))}
				</ul>
			)}
		</figure>
	);
}
