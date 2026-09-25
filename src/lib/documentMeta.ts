type PageMeta = {
	title: string;
	description?: string;
	path?: string;
	type?: "website" | "article";
	image?: string;
	structuredData?: Record<string, unknown>;
	noindex?: boolean;
};

function absoluteUrl(pathOrUrl: string) {
	if (/^https?:\/\//.test(pathOrUrl)) return pathOrUrl;
	return new URL(pathOrUrl, "https://nicolerodriguez.dev").toString();
}

function upsertMeta(
	attribute: "name" | "property",
	key: string,
	content: string,
) {
	let node = document.head.querySelector<HTMLMetaElement>(
		`meta[${attribute}="${key}"]`,
	);
	if (!node) {
		node = document.createElement("meta");
		node.setAttribute(attribute, key);
		document.head.appendChild(node);
	}
	node.content = content;
}

function upsertCanonical(href: string) {
	let node = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
	if (!node) {
		node = document.createElement("link");
		node.rel = "canonical";
		document.head.appendChild(node);
	}
	node.href = href;
}

function upsertStructuredData(data?: Record<string, unknown>) {
	const id = "page-structured-data";
	const existing = document.getElementById(id);
	if (!data) {
		existing?.remove();
		return;
	}

	const node =
		existing instanceof HTMLScriptElement
			? existing
			: document.createElement("script");
	node.id = id;
	node.type = "application/ld+json";
	node.textContent = JSON.stringify(data);
	if (!existing) {
		document.head.appendChild(node);
	}
}

function removeMeta(selector: string) {
	const node = document.head.querySelector(selector);
	if (node) {
		node.remove();
	}
}

export function setDocumentMeta({
	title,
	description,
	path = "/",
	type = "website",
	image = "/og-image.jpg",
	structuredData,
	noindex = false,
}: PageMeta) {
	document.title = title;
	const canonicalUrl = absoluteUrl(path);

	upsertCanonical(canonicalUrl);
	upsertMeta("property", "og:title", title);
	upsertMeta("property", "og:type", type);
	upsertMeta("property", "og:url", canonicalUrl);
	upsertMeta("name", "twitter:card", image ? "summary_large_image" : "summary");
	upsertMeta("name", "twitter:title", title);

	if (description) {
		upsertMeta("name", "description", description);
		upsertMeta("property", "og:description", description);
		upsertMeta("name", "twitter:description", description);
	}

	if (image) {
		const imageUrl = absoluteUrl(image);
		upsertMeta("property", "og:image", imageUrl);
		upsertMeta("name", "twitter:image", imageUrl);
	} else {
		removeMeta('meta[property="og:image"]');
		removeMeta('meta[name="twitter:image"]');
	}

	if (noindex) {
		upsertMeta("name", "robots", "noindex");
	} else {
		removeMeta('meta[name="robots"]');
	}

	upsertStructuredData(structuredData);
}
