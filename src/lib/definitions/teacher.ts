export type Teacher = {
	firstName: string;
	lastName: string;
	initials?: string;
	index?: number;
};

export type PlanTeacher = Teacher & { initials: string };
