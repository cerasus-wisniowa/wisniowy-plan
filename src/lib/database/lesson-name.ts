import type { StoredLessonName } from "../definitions/db";
import { addData, getData, Stores, updateData } from "./db";

export async function saveLessonName(name: string, fullName: string) {
	const data = { name, fullName } satisfies StoredLessonName;
	try {
		if (
			!(await updateData<StoredLessonName>(
				Stores.LessonNames,
				name,
				data
			))
		) {
			await addData<StoredLessonName>(Stores.LessonNames, data);
		}
	} catch (error) {
		console.error(error);
	}
}

export async function getLessonName(name: string) {
	try {
		return await getData<StoredLessonName>(Stores.LessonNames, name);
	} catch (error) {
		console.error(error);
		return null;
	}
}
