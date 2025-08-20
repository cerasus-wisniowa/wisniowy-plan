import type { Change } from "../definitions/change";
import type { Teacher } from "../definitions/teacher";

export function areChangeTeachersEqual(change: Change, teacher: Teacher) {
	const overrides = {
		K2: { firstName: "Karolina", lastName: "Dołomisiewicz" },
		Ja: { firstName: "Karolina", lastName: "Dołomisiewicz" },
		DK: { firstName: "Krzysztof", lastName: "Dołomisiewicz" },
	};
	const keys = Object.keys(overrides);

	if (teacher.initials && keys.includes(teacher.initials)) {
		if (
			areTeachersEqual(
				change.teacher,
				overrides[teacher.initials as keyof typeof overrides]
			)
		)
			return true;
	} else
		return areTeachersEqual(
			{
				firstName: change.teacher.firstName.charAt(0),
				lastName: change.teacher.lastName,
			},
			teacher
		);
}

export function areTeachersEqual(teacher1: Teacher, teacher2: Teacher) {
	return (
		teacher1.firstName === teacher2.firstName &&
		teacher1.lastName === teacher2.lastName
	);
}
