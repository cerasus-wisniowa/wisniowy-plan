import type { LessonType } from "../../../../lib/definitions/lesson";
import type { Plan } from "../../../../lib/definitions/plan";
import { findTeachers } from "../../../../lib/util/find-teachers";
import Switch from "../../../ui/switch";
import TeacherDropdown from "./teacher-filter";
import GroupFilter from "./group-filter";

export default function Filters({
	filters,
	setFilters,
	plan,
}: {
	filters: PlanFilters;
	setFilters: React.Dispatch<React.SetStateAction<PlanFilters>>;
	plan: Plan;
}) {
	const hasType = (type: LessonType) =>
		plan.lessons.some((l) => l.type === type);

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

	const planFilters = filters[plan.name] || {};
	return (
		<>
			{hasType("group") && (
				<GroupFilter
					options={[1, 2]}
					selected={planFilters.groups?.group}
					onSelect={(i) => {
						const newGroup =
							i === planFilters.groups?.group ? undefined : i;
						setFilters((prev) => ({
							...prev,
							[plan.name]: {
								...prev[plan.name],
								groups: {
									...prev[plan.name]?.groups,
									group: newGroup,
								},
							},
						}));
					}}
					title="grupa:"
				/>
			)}
			{hasType("specialisation") && (
				<div className="flex gap-2">
					<GroupFilter
						options={specialisations}
						selected={planFilters.groups?.specialisation}
						onSelect={(i) => {
							const newSpecialisation =
								i === planFilters.groups?.specialisation
									? undefined
									: i;
							setFilters((prev) => ({
								...prev,
								[plan.name]: {
									...prev[plan.name],
									groups: {
										...prev[plan.name]?.groups,
										specialisation: newSpecialisation,
									},
								},
							}));
						}}
						title="specjalizacja:"
					/>
				</div>
			)}
			{hasType("religion") && (
				<div className="flex pc:self-center text-foreground-secondary">
					<div className="mr-4">religia:</div>
					<div className="flex items-center">
						<Switch
							checked={planFilters.exclude?.religion !== true}
							onChange={(checked) =>
								setFilters((prev) => ({
									...prev,
									[plan.name]: {
										...prev[plan.name],
										exclude: {
											...prev[plan.name]?.exclude,
											religion: !checked,
										},
									},
								}))
							}
						/>
					</div>
				</div>
			)}
			{hasType("ethics") && (
				<div className="flex pc:self-center text-foreground-secondary">
					<div className="mr-4">etyka:</div>
					<div className="flex items-center">
						<Switch
							checked={planFilters.exclude?.ethics !== true}
							onChange={(checked) =>
								setFilters((prev) => ({
									...prev,
									[plan.name]: {
										...prev[plan.name],
										exclude: {
											...prev[plan.name]?.exclude,
											ethics: !checked,
										},
									},
								}))
							}
						/>
					</div>
				</div>
			)}
			{hasType("english") && (
				<TeacherDropdown
					teachers={findTeachers(plan?.lessons || [], "english")}
					selected={planFilters?.teachers?.english}
					onSelect={(teacher) =>
						setFilters((prev) => ({
							...prev,
							[plan.name]: {
								...prev[plan.name],
								teachers: {
									...prev[plan.name]?.teachers,
									english: teacher,
								},
							},
						}))
					}
				>
					język angielski:
				</TeacherDropdown>
			)}
			{hasType("secondary_language") && (
				<TeacherDropdown
					teachers={findTeachers(
						plan?.lessons || [],
						"secondary_language"
					)}
					selected={filters[plan.name]?.teachers?.secondary_language}
					onSelect={(teacher) =>
						setFilters((prev) => ({
							...prev,
							[plan.name]: {
								...prev[plan.name],
								teachers: {
									...prev[plan.name]?.teachers,
									secondary_language: teacher,
								},
							},
						}))
					}
				>
					język obcy drugi:
				</TeacherDropdown>
			)}
		</>
	);
}
export type PlanFilters = {
	[class_: string]: {
		teachers?: {
			english?: string;
			secondary_language?: string;
		};
		groups?: {
			group?: string | number;
			specialisation?: string | number;
		};
		exclude?: {
			religion?: boolean;
			ethics?: boolean;
		};
	};
};
