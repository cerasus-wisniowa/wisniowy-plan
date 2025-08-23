import type { LessonType } from "./lesson";
import type { PlanSource, PlanType } from "./plan";
import type { Section } from "./section";

export type StoredLesson = {
	name: string;
	sections: Section[];
	type: LessonType;
	teacher?: string;
	room?: string;
	hour: number;
	day: number;
};

export type StoredPlan = {
	name: string;
	type: PlanType;
	source: PlanSource;
	lastChanged: string;
	lastUpdate: string;
	generated: string;
	lessons: StoredLesson[];
};

export type StoredLessonName = {
	name: string;
	fullName: string;
};

export type IndexedStoredPlan = StoredPlan & { id: string };
