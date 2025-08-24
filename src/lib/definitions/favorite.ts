import type { PlanType } from "./plan";

export type RawFavoritePlan = {
	type: PlanType;
	value: string;
};

export type FavoritePlan = RawFavoritePlan & { name: string };

export type StoredFavoritePlan = RawFavoritePlan & { id: string };
