import type { Changes } from "../definitions/changes";
import config from "../../data/config.json";

const api = config.api;

export async function fetchChanges() {
	const fetchedChanges = await fetch(`${api}/api/changes`, {
		mode: "cors",
	})
		.then((res) => (res.ok ? (res.json() as Promise<Changes>) : null))
		.catch((err) => {
			console.log(err);
			return null;
		});

	if (!fetchedChanges) return null;

	return fetchedChanges;
}
