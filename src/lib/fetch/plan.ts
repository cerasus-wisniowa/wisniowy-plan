import type { ApiPlan, PlanType } from "../definitions/plan";
import config from "../../data/config.json";
import { getPlan, savePlan } from "../database/plan";

const api = config.api;

export async function fetchPlan(type: PlanType, name: string) {
	const fetchedPlan = await fetch(`${api}/api/plans/${type}/${name}`, {
		mode: "cors",
	})
		.then((res) => (res.ok ? (res.json() as Promise<ApiPlan>) : null))
		.catch((err) => {
			console.log(err);
			return null;
		});

	if (!fetchedPlan) return null;

	await savePlan(fetchedPlan);
	const time = Date.now();
	console.log(await getPlan(fetchedPlan));
	console.log(Date.now() - time);
	return fetchedPlan;
}
