import type { ApiPlanCacheMeta } from "./api-data";
import type { Classroom } from "./classroom";
import type { PlanSource } from "./plan";
import type { Teacher } from "./teacher";

export type PlanList = {
	class: string[];
	teacher: Teacher[];
	classroom: Classroom[];
	source: PlanSource;
	lastUpdate?: string;
	isUpdating?: boolean;
};

export type ApiPlanList = PlanList & ApiPlanCacheMeta;
