import type { Section } from "../definitions/section";

export function isSectionEqual(section1: Section, section2: Section): boolean {
	return (
		section1.class === section2.class && section1.group === section2.group
	);
}

export function areSectionsEqual(
	sections1: Section[],
	sections2: Section[]
): boolean {
	if (sections1.length !== sections2.length) return false;

	return sections1.some((section1) =>
		sections2.some((section2) => isSectionEqual(section1, section2))
	);
}
