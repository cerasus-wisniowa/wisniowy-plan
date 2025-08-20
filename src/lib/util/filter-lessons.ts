import { SortedLessons } from "../definitions/sorted-lessons";

export function filterLessons(lessons: SortedLessons, filter: { day: number }) {
	const { stackedLessons, singleLessons } = lessons;
	const filteredStackedLessons = stackedLessons.filter(
		(l) => l.day == filter.day
	);
	const filteredSingleLessons = singleLessons.filter(
		(l) => l.day == filter.day
	);
	return new SortedLessons(filteredSingleLessons, filteredStackedLessons);
}
