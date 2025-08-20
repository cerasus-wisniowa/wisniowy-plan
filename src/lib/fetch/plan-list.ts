import type { PlanList } from "../definitions/plan-list";
import config from "../../data/config.json";

const api = config.api;

export async function fetchPlanList() {
	const fetchedPlan = await fetch(`${api}/api/list`, {
		mode: "cors",
	})
		.then((res) => (res.ok ? (res.json() as Promise<PlanList>) : null))
		.catch((err) => {
			console.log(err);
			return null;
		});

	if (!fetchedPlan) return null;

	return fetchedPlan;
}
