import type { Classroom } from "./classroom";
import type { Teacher } from "./teacher";

export type PlanList = {
	apiVersion: string;
	class: string[];
	teacher: Teacher[];
	classroom: Classroom[];
};
