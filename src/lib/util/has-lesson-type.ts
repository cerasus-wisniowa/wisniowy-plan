import type { Lesson, LessonType } from "../definitions/lesson";

export const hasType = (lessons: Lesson[], type: LessonType) =>
	lessons.some((l) => l.type === type);
