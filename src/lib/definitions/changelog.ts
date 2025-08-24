export type Changelog = {
	version: string;
	date: Date;
	changes?: string[];
	changeSets?: {
		type: "changed" | "fixed";
		changes: string[];
	}[];
}[];

export type RawChangelog = [
	{
		version: string;
		date: string;
		changes: string[];
	},
];
