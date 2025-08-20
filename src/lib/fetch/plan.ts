import type { Plan, PlanType } from "../definitions/plan";
import config from "../../data/config.json";

const cache: Plan[] = [];

const api = config.api;

export async function fetchPlan(type: PlanType, name: string) {
	const cached = cache.find((p) => p.type === type && p.name === name);
	if (cached) return cached;

	const fetchedPlan = await fetch(`${api}/api/plans/${type}/${name}`, {
		mode: "cors",
	})
		.then((res) => (res.ok ? (res.json() as Promise<Plan>) : null))
		.catch((err) => {
			console.log(err);
			return null;
		});

	if (!fetchedPlan) return null;

	return fetchedPlan;
}
