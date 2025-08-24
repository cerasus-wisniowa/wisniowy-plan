import type { PlanType } from "../definitions/plan";
import type { PlanList } from "../definitions/plan-list";

export function getPlanName(
	planName: string,
	planType: PlanType,
	planList: PlanList
) {
	switch (planType) {
		case "class":
			return `${planName}`;
		case "teacher": {
			const list = planList.teacher.find((t) => t.initials === planName);
			if (list)
				return `${list.firstName}. ${list.lastName} (${list.initials})`;
			return `${planName}`;
		}
		case "classroom": {
			const list = planList.classroom.find((c) => c.room === planName);
			if (list && list.name) return `${list.room} - ${list.name}`;
			return `${planName}`;
		}
		default:
			return planName;
	}
}

export function isPlanOnList(
	planName: string,
	planType: PlanType,
	planList: PlanList
) {
	switch (planType) {
		case "class":
			return planList.class.includes(planName);
		case "teacher":
			return planList.teacher.some((t) => t.initials === planName);
		case "classroom":
			return planList.classroom.some((c) => c.room === planName);
		default:
			return false;
	}
}

export function classSortPredicate(a: string, b: string) {
	// liceum trafia przed technikum, technikum trafia przed pozostałe (indywidualne)
	const secondA = a[1];
	const secondB = b[1];

	const priority = (ch: string) => (ch === "l" ? 0 : ch === "t" ? 1 : 2);
	const prioA = priority(secondA);
	const prioB = priority(secondB);

	if (prioA !== prioB) return prioA - prioB;

	// sortowanie po numerze klasy
	const numA = Number(a[0]);
	const numB = Number(b[0]);
	if (numA !== numB) return numA - numB;

	// sortowanie po reszcie
	return a.localeCompare(b);
}
