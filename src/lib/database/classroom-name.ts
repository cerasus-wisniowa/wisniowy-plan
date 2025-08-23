import type { Classroom } from "../definitions/classroom";
import { addData, getData, Stores, updateData } from "./db";

export async function saveClassroomName(room: string, name: string) {
	const data = { room, name } satisfies Classroom;
	try {
		if (!(await updateData<Classroom>(Stores.ClassroomNames, room, data))) {
			await addData<Classroom>(Stores.ClassroomNames, data);
		}
	} catch (error) {
		console.error(error);
	}
}

export async function getClassroomName(room: string) {
	try {
		return await getData<Classroom>(Stores.ClassroomNames, room);
	} catch (error) {
		console.error(error);
		return null;
	}
}
