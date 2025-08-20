import type { Change } from "./change";

export type Changes = {
	changes: Change[];
	dates: string[];
	lastUpdate: string;
	apiVersion: string;
};
