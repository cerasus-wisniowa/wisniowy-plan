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
} from "../definitions/plan";
import type { PlanTeacher } from "../definitions/teacher";
import { saveClassroomName } from "./classroom-name";
import { addData, getStoreData, Stores, updateData } from "./db";
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
		const res = await addData<IndexedStoredPlan>(Stores.Plans, {
			...data,
			id,
		});
		console.log(res);
	} catch (error) {
		console.error(error);
	}
}

export async function getPlan(planInfo: PlanInfo) {
	try {
		const exists = await getStoreData<IndexedStoredPlan>(Stores.Plans).then(
			(plans) => plans.find((p) => arePlansEqual(p, planInfo))
		);
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
				lessons.sort((a, b) => a.hour - b.hour)[lessons.length - 1]
					.hour + 1,
			lastChanged: new Date(exists.lastChanged),
			lastUpdate: new Date(exists.lastUpdate),
			lessons,
		} satisfies Plan & { lastChanged: Date; lastUpdate: Date };

		return plan;
	} catch (error) {
		console.error(error);
		return null;
	}
}
