import type { CachedPlan } from "../definitions/cache";
import type { PlanSource, PlanType } from "../definitions/plan";

type Query = {
	type: PlanType;
	name: string;
	source: PlanSource;
};

export function loadPlan({ type, name, source }: Query) {
	const key = `plan;${type};${source};${name}`;
	const json = localStorage.getItem(key);
	const lessonsJson = localStorage.getItem(`lessons`);
	if (!json || !lessonsJson) return null;

	try {
		const cachedPlan = JSON.parse(json) as CachedPlan;
		const lessons = JSON.parse(lessonsJson || "[]");
	} catch (error) {
		console.log(error);
		return null;
	}
}
