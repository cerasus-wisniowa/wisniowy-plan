import type { Plan } from "../../lib/definitions/plan";
import PlanColumn from "./plan-column";
import { filterLessons } from "../../lib/util/filter-lessons";
import { sortLessons } from "../../lib/util/sort-lessons";
import { useWeek } from "../context/week-provider";
import { getDayOffset } from "../../lib/util/get-date-offset";
import type { PlanFilters } from "./header/filters/filters";

export default function PlanTable({
	filters,
	plan,
}: {
	filters?: PlanFilters;
	plan: Plan;
}) {
	const { week, mobileDay } = useWeek();

	const filteredLessons = plan.lessons.filter((lesson) => {
		if (!filters || !filters[plan.name] || lesson.type === "regular")
			return true;
		const filts = filters[plan.name];
		if (
			filts.teachers &&
			Object.keys(filts.teachers).includes(lesson.type)
		) {
			const filter =
				filters[plan.name].teachers![
					lesson.type as keyof typeof filts.teachers
				];
			return !filter || filter === lesson.teacher?.initials;
		} else if (
			filts.groups &&
			Object.keys(filts.groups).includes(lesson.type)
		) {
			const filter =
				filters[plan.name].groups![
					lesson.type as keyof typeof filts.groups
				];
			return (
				!filter ||
				filter ==
					lesson.sections.find((s) => s.class === plan.name)?.group
			);
		} else if (
			filts.exclude &&
			Object.keys(filts.exclude).includes(lesson.type)
		) {
			return !filters[plan.name].exclude![
				lesson.type as keyof typeof filts.exclude
			];
		}
		return true;
	});

	const lessons = sortLessons(filteredLessons, plan.from, plan.height);

	let start = plan.from;
	if (start === 0 && !plan.lessons.find((l) => l.hour === 0)) {
		start = 1;
	}

	return (
		<>
			<div className="flex justify-between not-pc:hidden mt-[-0.5rem]">
				{[1, 2, 3, 4, 5].map((day) => (
					<PlanColumn
						key={day}
						date={getDayOffset(week, day)}
						lessons={filterLessons(lessons, { day })}
						start={start}
						class={plan.name}
						planType={plan.type}
					/>
				))}
			</div>
			<div className="pc:hidden self-center mx-auto">
				<PlanColumn
					date={getDayOffset(week, mobileDay)}
					lessons={filterLessons(lessons, {
						day: mobileDay,
					})}
					start={start}
					class={plan.name}
					planType={plan.type}
					mobile
				/>
			</div>
		</>
	);
}
