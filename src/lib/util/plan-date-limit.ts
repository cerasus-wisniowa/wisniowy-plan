export function planDateLimit(date: Date): [Date, Date] {
	const year = date.getFullYear();
	if (date.getMonth() > 6)
		return [new Date(year + "-09-01"), new Date(year + 1 + "-08-31")];
	return [new Date(year - 1 + "-09-01"), new Date(year + "-08-31")];
}

export function isDateInRange(date: Date, range: [Date, Date]): boolean {
	return date >= range[0] && date <= range[1];
}
