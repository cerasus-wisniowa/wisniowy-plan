import type { Lesson } from "./lesson";

export type Plan = {
	lessons: Lesson[];
	type: PlanType;
	name: string;
	from: number;
	height: number;
	generated: string;
};

export type PlanType = "teacher" | "class" | "classroom";

export type Plans = {
	apiVersion: string;
	generated: string;
	lastUpdate: string;
	plans: Plan[];
};
