export function getDayOffset(date: Date, days: number) {
	return new Date(date.getTime() + 1000 * 60 * 60 * 24 * days);
}
