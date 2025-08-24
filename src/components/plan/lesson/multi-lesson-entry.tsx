import useWindowDimensions, { pcWidth } from "../../hook/use-window-dimensions";
import type { Lesson } from "../../../lib/definitions/lesson";
import PlanLink from "../plan-link";

export default function MultiLessonEntry({
	lesson,
	class: class_,
}: {
	lesson: Lesson;
	class: string;
}) {
	const group = lesson.sections.find((s) => s.class === class_)?.group;
	const { isMobile } = useWindowDimensions();

	const Separator = () => (
		<span className="text-foreground-tertiary select-none">•</span>
	);

	let lessonNameWidth = innerWidth * (isMobile() ? 0.4 : 0.3);
	if (!isMobile()) lessonNameWidth /= 5;
	if (!group) lessonNameWidth += 32;
	if (!lesson.room) lessonNameWidth += 40;
	lessonNameWidth += Math.max(0, innerWidth - (pcWidth + 300)) * 0.1;

	return (
		<li className="flex gap-1">
			<div
				className="truncate font-medium"
				title={lesson.fullName}
				style={{
					maxWidth: lessonNameWidth + "px",
				}}
			>
				{lesson.hour}. {lesson.fullName}
			</div>

			{group && (
				<>
					<Separator />
					<div className="line-clamp-1">gr. {group}</div>
				</>
			)}

			<Separator />
			<PlanLink
				name={lesson.teacher?.initials}
				type="teacher"
				title={
					lesson.teacher?.firstName + ". " + lesson.teacher?.lastName
				}
			>
				{lesson.teacher?.initials}
			</PlanLink>

			{lesson.room && (
				<>
					<Separator />
					<PlanLink
						name={lesson.room.room}
						type="classroom"
						title={lesson.room.room + " - " + lesson.room.name}
					>
						{lesson.room.room}
					</PlanLink>
				</>
			)}
		</li>
	);
}
