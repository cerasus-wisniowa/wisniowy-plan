import type { PlanSource } from "./plan";

export type ApiData = {
	name: string;
	version: string;
	environment: string;
};

export type ApiCacheMeta = {
	apiVersion: string;
	lastUpdate: string;
};

export type ApiPlanCacheMeta = ApiCacheMeta & {
	lastChanged: string;
	isUpdating: boolean;
	source: PlanSource;
};
