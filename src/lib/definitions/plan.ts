import type { ApiPlanCacheMeta } from "./api-data";
import type { Lesson } from "./lesson";

export type Plan = ApiPlanCacheMeta & {
	lessons: Lesson[];
	type: PlanType;
	name: string;
	from: number;
	height: number;
	generated: string;
};

export type PlanSource = "planlekcji" | "planlekcji2" | "planlekcji3";

export type PlanType = "teacher" | "class" | "classroom";
