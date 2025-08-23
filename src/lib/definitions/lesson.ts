import type { Change } from "./change";
import type { Classroom } from "./classroom";
import type { Section } from "./section";
import type { PlanTeacher } from "./teacher";

export type Lesson = {
	name: string;
	fullName: string;
	sections: Section[];
	type: LessonType;
	teacher?: PlanTeacher;
	room?: Classroom;
	changes?: Change[];
	hour: number;
	day: number;
};

export type LessonType =
	| "regular"
	| "group"
	| "english"
	| "secondary_language"
	| "religion"
	| "ethics"
	| "specialisation";

export const lessonTypes: LessonType[] = [
	"regular",
	"group",
	"english",
	"secondary_language",
	"religion",
	"ethics",
	"specialisation",
];
