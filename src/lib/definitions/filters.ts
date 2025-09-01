export type PlanFilters = {
	class: string;
	teachers: {
		english?: string;
		secondary_language?: string;
		specialisation?: string;
	};
	groups: {
		group?: string | number;
	};
	exclude: {
		religion?: boolean;
		ethics?: boolean;
	};
};
