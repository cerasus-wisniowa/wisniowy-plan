import {
	addSingleHoliday,
	checkHolidays,
} from "@dudek26/node-ferie/dist/holidays";

export function setupExtraHolidays() {
	addExtraHoliday("Rozpoczęcie roku szkolnego", new Date("2025-09-01"));
}

function addExtraHoliday(name: string, date: Date) {
	if (checkHolidays(date).find((h) => h.name === name)) return;
	addSingleHoliday(name, "school", date);
}
