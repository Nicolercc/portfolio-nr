import type { Receipt } from "../data/proofs";

export function ProjectReceipt({ receipt }: { receipt: Receipt }) {
	return (
		<details className="rounded-2xl border border-dashed border-foreground/40">
			<summary className="min-h-11 cursor-pointer px-4 py-3 text-caption font-mono">
				View evidence receipt
			</summary>
			<div className="rounded-b-2xl bg-paper p-4 text-ink">
				<p className="font-semibold">{receipt.claim}</p>
				<dl className="my-3 space-y-2 text-caption font-mono">
					{receipt.rows.map(({ label, value }) => (
						<div key={label} className="flex flex-wrap gap-x-3">
							<dt>{label}</dt>
							<dd>{value}</dd>
						</div>
					))}
				</dl>
				<p className="text-caption">{receipt.method}</p>
				<p className="mt-2 text-caption">{receipt.scope}</p>
				{receipt.sources?.map(({ label, href }) => (
					<a key={href} href={href} className="mr-4 inline-flex min-h-11 items-center text-caption underline">{label}</a>
				))}
			</div>
		</details>
	);
}
