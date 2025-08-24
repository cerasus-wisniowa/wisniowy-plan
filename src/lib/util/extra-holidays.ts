import { addSingleHoliday } from "@dudek26/node-ferie/dist/holidays";

export function setupExtraHolidays() {
	addSingleHoliday(
		"Rozpoczęcie roku szkolnego",
		"school",
		new Date("2025-09-01")
	);
}
