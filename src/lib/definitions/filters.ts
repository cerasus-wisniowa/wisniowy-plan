export type PlanFilters = {
	class: string;
	teachers: {
		english?: string;
		secondary_language?: string;
	};
	groups: {
		group?: string | number;
		specialisation?: string | number;
	};
	exclude: {
		religion?: boolean;
		ethics?: boolean;
	};
};
