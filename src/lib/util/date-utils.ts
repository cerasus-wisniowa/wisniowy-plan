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

export function relativeDateString(first: Date, second: Date) {
	const difference = second.getTime() - first.getTime();

	const [unit, ms] = timeDifferenceUnit(difference);
	if (unit === "second") {
		return "przed chwilą";
	}

	const value =
		difference < 0
			? Math.ceil(difference / ms)
			: Math.floor(difference / ms);

	return new Intl.RelativeTimeFormat("pl-PL", { numeric: "auto" }).format(
		value,
		unit
	);
}

export function timeDifferenceUnit(
	difference: number
): [Intl.RelativeTimeFormatUnit, number] {
	const absDiff = Math.abs(difference);
	const units: [Intl.RelativeTimeFormatUnit, number][] = [
		["year", 1000 * 60 * 60 * 24 * 365],
		["month", 1000 * 60 * 60 * 24 * 30],
		["week", 1000 * 60 * 60 * 24 * 7],
		["day", 1000 * 60 * 60 * 24],
		["hour", 1000 * 60 * 60],
		["minute", 1000 * 60],
		["second", 1000],
	];

	for (const [unit, ms] of units) {
		if (absDiff >= ms) {
			return [unit, ms];
		}
	}
	return ["second", 1000];
}
