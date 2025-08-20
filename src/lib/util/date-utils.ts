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
