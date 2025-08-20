import type { Lesson } from "./lesson";

export type StackedLesson = {
	day: number;
	hour: number;
	lessons: Lesson[];
};

export class SortedLessons {
	singleLessons: Lesson[];
	stackedLessons: StackedLesson[];

	constructor(singleLessons?: Lesson[], stackedLessons?: StackedLesson[]) {
		this.singleLessons = singleLessons || [];
		this.stackedLessons = stackedLessons || [];
	}

	length() {
		return this.singleLessons.length + this.stackedLessons.length;
	}

	flat() {
		return [
			...this.singleLessons,
			...this.stackedLessons.flatMap((l) => l.lessons),
		];
	}
}
