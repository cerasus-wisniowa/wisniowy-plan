import {
	addRangeHoliday,
	addSingleHoliday,
	checkHolidays,
} from "@dudek26/node-ferie/dist/holidays";
import type { ExtraHoliday } from "../definitions/extra-holiday";
import { load } from "js-yaml";

export async function setupExtraHolidays() {
	const res = await fetch("/extra-holidays.yml");
	if (!res) return null;

	const text = await res.text();
	if (!text) return null;

	const holidays = load(text) as ExtraHoliday[];

	for (const holiday of holidays) {
		if (holiday.end)
			addExtraRangeHoliday(
				holiday.name,
				new Date(holiday.date),
				new Date(holiday.end)
			);
		else addExtraHoliday(holiday.name, new Date(holiday.date));
	}
}

function addExtraHoliday(name: string, date: Date) {
	if (checkHolidays(date).find((h) => h.name === name)) return;
	addSingleHoliday(name, "school", date);
}

function addExtraRangeHoliday(name: string, start: Date, end: Date) {
	if (checkHolidays(start).find((h) => h.name === name)) return;
	addRangeHoliday(name, "school", start, end);
}
