import type { ApiPlanCacheMeta } from "./api-data";
import type { Lesson } from "./lesson";

export type Plan = PlanInfo & {
	from: number;
	height: number;
	generated: string;
	lessons: Lesson[];
};

export type ApiPlan = Plan & ApiPlanCacheMeta;

export type PlanSource = "planlekcji" | "planlekcji2" | "planlekcji3";

export type PlanType = "teacher" | "class" | "classroom";

export type PlanInfo = {
	type: PlanType;
	name: string;
	source: PlanSource;
};

export const arePlansEqual = (a: PlanInfo, b: PlanInfo) =>
	a.name === b.name && a.source === b.source && a.type === b.type;
