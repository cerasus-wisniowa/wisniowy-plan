import type { Lesson } from "../definitions/lesson";
import { SortedLessons } from "../definitions/sorted-lessons";

export function sortLessons(
	lessons: Lesson[],
	planStart: number,
	planHeight: number
) {
	const sortedLessons = new SortedLessons();

	for (let i = 1; i <= 5; i++) {
		for (let j = planStart; j < planHeight; j++) {
			const l = lessons.filter((l) => l.day == i && l.hour == j);
			if (l.length > 1) {
				sortedLessons.stackedLessons.push({
					day: i,
					hour: j,
					lessons: l,
				});
			} else if (l.length == 1) {
				sortedLessons.singleLessons.push(l[0]);
			}
		}
	}

	return sortedLessons;
}
