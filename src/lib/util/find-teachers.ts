import type { Lesson, LessonType } from "../definitions/lesson";
import type { Teacher } from "../definitions/teacher";

export function findTeachers(lessons: Lesson[], lessonType: LessonType) {
	const teachers = [] as Teacher[];

	lessons
		.filter((l) => l.type === lessonType && l.teacher)
		.forEach(
			(l) =>
				!teachers.some((t) => t.initials === l.teacher?.initials) &&
				teachers.push(l.teacher!)
		);

	return teachers;
}
