import type { ApiPlanList, PlanList } from "../definitions/plan-list";
import config from "../../data/config.json";
import { getStoredPlansList } from "../database/plan";
import type { PlanSource } from "../definitions/plan";

const api = config.api;

export async function fetchPlanList(source: PlanSource = "planlekcji") {
	const fetchedPlan = await fetch(`${api}/api/list?source=${source}`, {
		mode: "cors",
	})
		.then((res) => (res.ok ? (res.json() as Promise<ApiPlanList>) : null))
		.catch((err) => {
			console.log(err);
			return null;
		});

	if (!fetchedPlan) return null;

	return fetchedPlan;
}

export async function fetchOrGetPlanList(
	source?: PlanSource
): Promise<(ApiPlanList | PlanList) & { api: boolean }> {
	const fetchedPlan = await fetchPlanList(source);
	if (!fetchedPlan)
		return { ...(await getStoredPlansList(source)), api: false };
	return { ...fetchedPlan, api: true };
}
