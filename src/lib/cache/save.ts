import type { CachedLesson, CachedPlan } from "../definitions/cache";
import type { Plan } from "../definitions/plan";

export function savePlan(plan: Plan) {
	const cachedPlan: CachedPlan = {
		lastChanged: plan.lastChanged,
		generated: plan.generated,
		lessons: plan.lessons.map(
			(lesson) =>
				({
					name: lesson.name,
					sections: lesson.sections,
					type: lesson.type,
					hour: lesson.hour,
					day: lesson.day,
					teacher: lesson.teacher?.initials,
					room: lesson.room?.room,
				}) satisfies CachedLesson
		),
	};

	const key = `plan;${plan.type};${plan.source};${plan.name}`;
	localStorage.setItem(key, JSON.stringify(cachedPlan));
}
