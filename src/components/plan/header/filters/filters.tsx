import type { Plan } from "../../../../lib/definitions/plan";
import { findTeachers } from "../../../../lib/util/find-teachers";
import Switch from "../../../ui/switch";
import TeacherDropdown from "./teacher-filter";
import GroupFilter from "./group-filter";
import type { PlanFilters } from "src/lib/definitions/filters";
import { hasType } from "@/lib/util/has-lesson-type";

export default function Filters({
	filters,
	updateFilters,
	plan,
}: {
	filters: PlanFilters;
	updateFilters: (filters: PlanFilters) => void;
	plan: Plan;
}) {
	const specialisations: (string | number)[] = [];
	plan.lessons
		.filter((l) => l.type === "specialisation")
		.forEach((l) => {
			if (
				l.sections[0].group &&
				!specialisations.includes(l.sections[0].group)
			)
				specialisations.push(l.sections[0].group);
		});

	return (
		<>
			{hasType(plan.lessons, "group") && (
				<GroupFilter
					options={[1, 2]}
					selected={filters.groups?.group}
					onSelect={(i) => {
						filters.groups.group =
							i === filters.groups?.group ? undefined : i;
						updateFilters(filters);
					}}
					title="grupa:"
				/>
			)}
			{hasType(plan.lessons, "religion") && (
				<div className="flex pc:self-center text-foreground-secondary">
					<div className="mr-4">religia:</div>
					<div className="flex items-center">
						<Switch
							checked={filters.exclude?.religion !== true}
							onChange={(checked) => {
								filters.exclude.religion = !checked;
								updateFilters(filters);
							}}
						/>
					</div>
				</div>
			)}
			{hasType(plan.lessons, "ethics") && (
				<div className="flex pc:self-center text-foreground-secondary">
					<div className="mr-4">etyka:</div>
					<div className="flex items-center">
						<Switch
							checked={filters.exclude?.ethics !== true}
							onChange={(checked) => {
								filters.exclude.ethics = !checked;
								updateFilters(filters);
							}}
						/>
					</div>
				</div>
			)}
			{hasType(plan.lessons, "english") && (
				<TeacherDropdown
					teachers={findTeachers(plan?.lessons || [], "english")}
					selected={filters.teachers.english}
					onSelect={(teacher) => {
						filters.teachers.english = teacher;
						updateFilters(filters);
					}}
				>
					język angielski:
				</TeacherDropdown>
			)}
			{hasType(plan.lessons, "secondary_language") && (
				<TeacherDropdown
					teachers={findTeachers(
						plan?.lessons || [],
						"secondary_language"
					)}
					selected={filters.teachers.secondary_language}
					onSelect={(teacher) => {
						filters.teachers.secondary_language = teacher;
						updateFilters(filters);
					}}
				>
					język obcy drugi:
				</TeacherDropdown>
			)}
			{hasType(plan.lessons, "specialisation") && (
				<TeacherDropdown
					teachers={findTeachers(
						plan?.lessons || [],
						"specialisation"
					)}
					selected={filters.teachers?.specialisation}
					onSelect={(teacher) => {
						filters.teachers.specialisation = teacher;
						updateFilters(filters);
					}}
				>
					specjalizacja:
				</TeacherDropdown>
			)}
		</>
	);
}
