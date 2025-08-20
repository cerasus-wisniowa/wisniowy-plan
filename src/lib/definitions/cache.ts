import type { LessonType } from "./lesson";
import type { Section } from "./section";

export type CachedLesson = {
	name: string;
	sections: Section[];
	type: LessonType;
	teacher?: string;
	room?: string;
	hour: number;
	day: number;
};

export type CachedPlan = {};
