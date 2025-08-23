import type { ApiPlan, PlanInfo } from "../definitions/plan";
import config from "../../data/config.json";
import { getPlan, savePlan } from "../database/plan";

const api = config.api;

export async function fetchPlan(planInfo: PlanInfo) {
	const fetchedPlan = await fetch(
		`${api}/api/plans/${planInfo.type}/${planInfo.name}?source=${planInfo.source}`,
		{
			mode: "cors",
		}
	)
		.then((res) => (res.ok ? (res.json() as Promise<ApiPlan>) : null))
		.catch((err) => {
			console.log(err);
			return null;
		});

	if (!fetchedPlan) return null;

	await savePlan(fetchedPlan);
	return fetchedPlan;
}

export async function getOrFetchPlan(planInfo: PlanInfo) {
	const storedPlan = await getPlan(planInfo);
	if (!storedPlan) return await fetchPlan(planInfo);
	return storedPlan;
}
