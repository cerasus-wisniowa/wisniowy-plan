export const days = [
	"niedziela",
	"poniedziałek",
	"wtorek",
	"środa",
	"czwartek",
	"piątek",
	"sobota",
];

export const daysShort = ["ndz", "pon", "wt", "śr", "czw", "pt", "sob"];

export const months = [
	"styczeń",
	"luty",
	"marzec",
	"kwiecień",
	"maj",
	"czerwiec",
	"lipiec",
	"sierpień",
	"wrzesień",
	"październik",
	"listopad",
	"grudzień",
];

export function getMonthsSpan(start: Date, days: number) {
	const monthsYears: { month: string; year: number }[] = [];
	for (let i = 1; i <= days; i++) {
		const date = new Date(start.getTime());
		date.setDate(date.getDate() + i);
		const month = months[date.getMonth()];
		if (!monthsYears.find((m) => m.month === month)) {
			monthsYears.push({
				month,
				year: date.getFullYear(),
			});
		}
	}
	return monthsYears;
}

export function getMonthsSpanString(
	start: Date,
	days: number,
	divider: string = "-"
) {
	const monthsYears = getMonthsSpan(start, days);
	const firstYear = monthsYears[0].year;
	const firstMonth = monthsYears[0].month;
	const lastYear = monthsYears[monthsYears.length - 1].year;
	const lastMonth = monthsYears[monthsYears.length - 1].month;

	if (firstYear === lastYear) {
		if (firstMonth === lastMonth) {
			return `${firstMonth} ${firstYear}`;
		} else {
			return `${firstMonth} ${divider} ${lastMonth} ${firstYear}`;
		}
	}
	return `${firstMonth} ${firstYear} ${divider} ${lastMonth} ${lastYear}`;
}
