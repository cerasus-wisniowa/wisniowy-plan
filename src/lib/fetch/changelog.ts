import type { Changelog, RawChangelog } from "../definitions/changelog";
import config from "../../data/config.json";
import { load } from "js-yaml";

export async function fetchApiChangelog(): Promise<Changelog | null> {
	const res = await fetch(config.api + "/api/changelog");
	if (!res) return null;

	const json: RawChangelog | null = await res.json();
	if (!json) return null;

	return json.map((r) => ({ ...r, date: new Date(r.date) }));
}

export async function fetchSiteChangelog(): Promise<Changelog | null> {
	const res = await fetch("/changelog.yml");
	if (!res) return null;

	const text = await res.text();
	if (!text) return null;

	const changelog = load(text) as RawChangelog;
	return changelog.map((r) => ({ ...r, date: new Date(r.date) }));
}
