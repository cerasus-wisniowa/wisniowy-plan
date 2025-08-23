import type { PlanTeacher } from "../definitions/teacher";
import { addData, getData, Stores, updateData } from "./db";

export async function saveTeacherName(teacher: PlanTeacher) {
	try {
		if (
			!(await updateData<PlanTeacher>(
				Stores.TeacherNames,
				teacher.initials,
				teacher
			))
		) {
			await addData<PlanTeacher>(Stores.TeacherNames, teacher);
		}
	} catch (error) {
		console.error(error);
	}
}

export async function getTeacherName(initials: string) {
	try {
		return await getData<PlanTeacher>(Stores.TeacherNames, initials);
	} catch (error) {
		console.error(error);
		return null;
	}
}
