export type ContributionStatus = "Open PR" | "Merged";

export type OpenSourceContribution = {
	repository: string;
	summary: string;
	status: ContributionStatus;
	/** Public pull request URL. Only list work that has one. */
	url: string;
	label: string;
};

export const OPEN_SOURCE_CONTRIBUTIONS: OpenSourceContribution[] = [
	{
		repository: "Excalidraw",
		summary:
			"Template-driven text-to-diagram prototype with deterministic type routing, repair fallback behavior, analytics, and 50 unit tests.",
		status: "Open PR",
		url: "https://github.com/excalidraw/excalidraw/pull/12147",
		label: "excalidraw/excalidraw#12147",
	},
];
