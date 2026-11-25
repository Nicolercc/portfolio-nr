import type { ProjectStatus } from "../data/projects";

const STATUS_LABELS: Record<ProjectStatus, string> = {
	live: "Live",
	prototype: "Prototype",
	"open-source": "Open source",
	"client-data": "Client data work",
	archived: "Archived",
};

export function ProjectStatusPill({ status, className = "" }: { status: ProjectStatus; className?: string }) {
	return (
		<span className={`inline-flex w-fit items-center rounded-full border border-current px-2 font-mono text-caption leading-normal ${className} ${status === "live" ? "text-verified" : "text-muted-foreground"}`}>
			{STATUS_LABELS[status]}
		</span>
	);
}
