import { areDatesEqual } from "./are-dates-equal";

export function nextDate(date: Date) {
	const newDate = new Date(date);
	newDate.setDate(date.getDate() + 1);
	return newDate;
}

export function previousDate(date: Date) {
	const newDate = new Date(date);
	newDate.setDate(date.getDate() - 1);
	return newDate;
}

export function dateIfYesterday(date: Date) {
	const options: Intl.DateTimeFormatOptions = {
		timeStyle: "medium",
	};
	const today = new Date();

	if (!areDatesEqual(date, today)) {
		options.dateStyle = "long";
	}

	return date.toLocaleString("pl-PL", options);
}
