import type { PlanFilters } from "../definitions/filters";
import { addData, getData, Stores, updateData } from "./db";

const defaultFilters = {
	teachers: {},
	groups: {},
	exclude: {},
};

export async function saveFilters(data: PlanFilters) {
	try {
		if (
			!(await updateData<PlanFilters>(Stores.Filters, data.class, data))
		) {
			await addData<PlanFilters>(Stores.Filters, data);
		}
	} catch (error) {
		console.error(error);
	}
}

export async function getFilters(class_: string) {
	try {
		const filters = await getData<PlanFilters>(Stores.Filters, class_);
		return (filters || {
			class: class_,
			...defaultFilters,
		}) satisfies PlanFilters as PlanFilters;
	} catch (error) {
		console.error(error);
		return {
			class: class_,
			...defaultFilters,
		} satisfies PlanFilters as PlanFilters;
	}
}
