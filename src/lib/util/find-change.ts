import type { Changes } from "../definitions/changes";
import type { Lesson } from "../definitions/lesson";
import { areDatesEqual } from "./are-dates-equal";
import { areSectionsEqual } from "./sections-equal";
import { areChangeTeachersEqual } from "./teachers-equal";

export function findChange(lesson: Lesson, changes: Changes, date: Date) {
	return changes.changes.find((change) => {
		const changeDate = new Date(change.date);
		return (
			lesson.teacher &&
			change.hour === lesson.hour &&
			areDatesEqual(changeDate, date) &&
			areSectionsEqual(change.sections, lesson.sections) &&
			areChangeTeachersEqual(change, lesson.teacher)
		);
	});
}
