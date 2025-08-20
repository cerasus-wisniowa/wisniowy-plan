import type { Change } from "./change";
import type { Classroom } from "./classroom";
import type { Section } from "./section";
import type { Teacher } from "./teacher";

export type Lesson = {
	name: string;
	fullName: string;
	sections: Section[];
	type: LessonType;
	teacher?: Teacher;
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
