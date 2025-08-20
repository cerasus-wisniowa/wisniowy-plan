import type { Classroom } from "./classroom";
import type { Section } from "./section";
import type { Teacher } from "./teacher";

export type Change = {
	type: ChangeType;
	sections: Section[];
	teacher: Teacher;
	classroom?: Classroom;
	consequence?: string;
	substitutionTeacher?: Teacher;
	note?: string;
	date: string;
	hour: number;
	generated?: boolean;
};

export type ChangeType =
	| "cancelled"
	| "substitution"
	| "no_consequence"
	| "moved";

export const changeTypes = {
	cancelled: "Odwołano",
	substitution: "Zastępstwo",
	no_consequence: "Bez konsekwencji",
	moved: "Przeniesiono",
};
