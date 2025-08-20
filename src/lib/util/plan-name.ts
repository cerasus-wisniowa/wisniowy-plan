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
