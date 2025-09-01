import type { Classroom } from "../definitions/classroom";
import type {
	IndexedStoredPlan,
	StoredLesson,
	StoredLessonName,
	StoredPlan,
} from "../definitions/db";
import type { Lesson } from "../definitions/lesson";
import {
	arePlansEqual,
	type ApiPlan,
	type Plan,
	type PlanInfo,
	type PlanSource,
} from "../definitions/plan";
import type { PlanList } from "../definitions/plan-list";
import type { PlanTeacher } from "../definitions/teacher";
import { classSortPredicate } from "../util/plan-list-utils";
import { saveClassroomName } from "./classroom-name";
import { addData, deleteData, getStoreData, Stores, updateData } from "./db";
import { saveLessonName } from "./lesson-name";
import { saveTeacherName } from "./teacher-name";

export async function savePlan(plan: ApiPlan) {
	const lessonNames: { [name: string]: string } = {};
	const teachers: PlanTeacher[] = [];
	const classrooms: { [room: string]: string } = {};

	const lessons = plan.lessons.map((lesson) => {
		if (!(lesson.name in lessonNames)) {
			lessonNames[lesson.name] = lesson.fullName;
		}

		if (
			lesson.teacher &&
			!teachers.find((t) => t.initials === lesson.teacher?.initials)
		) {
			teachers.push(lesson.teacher);
		}

		if (lesson.room && !(lesson.room.room in classrooms)) {
			classrooms[lesson.room.room] = lesson.room.name;
		}

		return {
			name: lesson.name,
			sections: lesson.sections,
			type: lesson.type,
			teacher: lesson.teacher?.initials,
			room: lesson.room?.room,
			hour: lesson.hour,
			day: lesson.day,
		} satisfies StoredLesson;
	});

	const data = {
		name: plan.name,
		type: plan.type,
		source: plan.source,
		generated: plan.generated,
		lastChanged: plan.lastChanged,
		lastUpdate: plan.lastUpdate,
		lessons,
	} satisfies StoredPlan;

	try {
		for (const name in lessonNames) {
			await saveLessonName(name, lessonNames[name]);
		}
		for (const teacher of teachers) {
			await saveTeacherName(teacher);
		}
		for (const classroom in classrooms) {
			await saveClassroomName(classroom, classrooms[classroom]);
		}

		const exists = await getStoreData<IndexedStoredPlan>(Stores.Plans).then(
			(plans) => plans.find((p) => arePlansEqual(p, plan))
		);
		if (exists) {
			await updateData<StoredPlan>(Stores.Plans, exists.id, data);
			return;
		}

		const id = crypto.randomUUID();
		await addData<IndexedStoredPlan>(Stores.Plans, {
			...data,
			id,
		});
	} catch (error) {
		console.error(error);
	}
}

export async function getPlan(planInfo: PlanInfo) {
	try {
		const plans = await getStoreData<IndexedStoredPlan>(Stores.Plans);
		const exists = plans.find((p) => arePlansEqual(p, planInfo));
		if (!exists) return null;

		const lessonNames = await getStoreData<StoredLessonName>(
			Stores.LessonNames
		);
		const teachers = await getStoreData<PlanTeacher>(Stores.TeacherNames);
		const classrooms = await getStoreData<Classroom>(Stores.ClassroomNames);

		const lessons = exists.lessons.map(
			(lesson) =>
				({
					...lesson,
					fullName:
						lessonNames.find((l) => l.name === lesson.name)
							?.fullName || lesson.name,
					teacher: teachers.find(
						(t) => t.initials === lesson.teacher
					),
					room: classrooms.find((r) => r.room === lesson.room),
				}) satisfies Lesson
		);

		const plan = {
			type: exists.type,
			name: exists.name,
			source: exists.source,
			generated: exists.generated,
			from: 0,
			height:
				lessons.length === 0
					? 1
					: lessons.sort((a, b) => a.hour - b.hour)[
							lessons.length - 1
						].hour + 1,
			lastChanged: exists.lastChanged,
			lastUpdate: exists.lastUpdate,
			lessons,
		} satisfies Plan & { lastChanged: string; lastUpdate: string };

		return plan as Plan & { lastChanged: string; lastUpdate: string };
	} catch (error) {
		console.error(error);
		return null;
	}
}

export async function getStoredPlansList(
	source: PlanSource = "planlekcji"
): Promise<PlanList> {
	const planList = {
		class: [],
		teacher: [],
		classroom: [],
		source: source,
	} satisfies PlanList as PlanList;

	try {
		const plans = await getStoreData<StoredPlan>(Stores.Plans);
		const teachers = await getStoreData<PlanTeacher>(Stores.TeacherNames);
		const classrooms = await getStoreData<Classroom>(Stores.ClassroomNames);

		plans
			.filter((plan) => plan.source === source)
			.forEach((plan) => {
				switch (plan.type) {
					case "teacher": {
						const teacher = teachers.find(
							(t) => plan.name === t.initials
						);
						if (teacher) planList.teacher.push(teacher);
						break;
					}
					case "class":
						planList.class.push(plan.name);
						break;
					case "classroom": {
						const classroom = classrooms.find(
							(r) => plan.name === r.room
						);
						if (classroom) planList.classroom.push(classroom);
						break;
					}
				}
			});
	} catch (error) {
		console.error(error);
	}
	planList.class.sort(classSortPredicate);

	return planList;
}

export async function cleanPlans(planList: PlanList) {
	const plans = await getStoreData<IndexedStoredPlan>(Stores.Plans);

	plans
		.filter((plan) => plan.source === planList.source)
		.forEach((plan) => {
			if (plan.type === "class" && !planList.class.includes(plan.name)) {
				deleteData(Stores.Plans, plan.id);
			} else if (
				plan.type === "teacher" &&
				!planList.teacher.some((t) => t.initials === plan.name)
			) {
				deleteData(Stores.Plans, plan.id);
			} else if (
				plan.type === "classroom" &&
				!planList.classroom.some((r) => r.room === plan.name)
			) {
				deleteData(Stores.Plans, plan.id);
			}
		});
}
