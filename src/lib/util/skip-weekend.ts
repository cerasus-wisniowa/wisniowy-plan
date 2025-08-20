export function skipWeekend(date = new Date(Date.now())) {
	while (date.getDay() === 0 || date.getDay() === 6) {
		date.setDate(date.getDate() + 1);
	}
	return date;
}
