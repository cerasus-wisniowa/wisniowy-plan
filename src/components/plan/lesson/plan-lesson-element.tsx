import { useChanges } from "@/components/context/changes-provider";
import { useWeek } from "@/components/context/week-provider";
import type { Lesson } from "@/lib/definitions/lesson";
import type { PlanType } from "@/lib/definitions/plan";
import { findChange } from "@/lib/util/find-change";
import { getDayOffset } from "@/lib/util/get-date-offset";
import { useState, useEffect } from "react";
import PlanLink from "../plan-link";
import LessonElement from "./lesson-element";
import LessonModal from "./lesson-modal";
import ChangeInfo from "./change-info";
import LessonHour from "./lesson-hour";
import { Button } from "@restart/ui";

import Next from "@/assets/icons/navigation/next.svg?react";
import { cn } from "@/lib/util/classname";

export default function PlanLessonElement({
	lesson,
	class: class_,
	planType,
	date,
}: {
	lesson: Lesson;
	class: string;
	planType: PlanType;
	date: Date;
}) {
	const { week } = useWeek();
	const group = lesson.sections.find((s) => s.class === class_)?.group;
	const { changes } = useChanges();

	const [showModal, setShowModal] = useState(false);

	useEffect(() => {
		setShowModal(false);
	}, [lesson]);

	const change =
		changes && findChange(lesson, changes, getDayOffset(week, lesson.day));

	const lessonName =
		change?.type === "substitution" && change.consequence
			? change.consequence
			: lesson.fullName;

	const teacherName = change?.substitutionTeacher
		? `${change.substitutionTeacher.firstName} ${change.substitutionTeacher.lastName}`
		: `${lesson.teacher?.firstName}. ${lesson.teacher?.lastName} (${lesson.teacher?.initials})`;

	const teacher = change?.substitutionTeacher ? (
		teacherName
	) : (
		<PlanLink
			name={lesson.teacher?.initials}
			type="teacher"
			className="line-clamp-1"
		>
			{teacherName}
		</PlanLink>
	);

	const classroom = change?.classroom?.room ?? lesson.room?.room;
	const classroomName = change?.classroom?.name
		? `${change.classroom.room} - ${change.classroom.name}`
		: `${lesson.room?.room} - ${lesson.room?.name}`;

	const classroomElement = (
		<PlanLink
			name={change?.classroom?.room || lesson.room?.room}
			type="classroom"
			className="pl-1 line-clamp-1"
		>
			{classroom}
		</PlanLink>
	);

	const classElement = (
		<div className="flex gap-0.5">
			{lesson.sections.map((s, i) => (
				<span key={i} className="w-full flex items-baseline">
					<PlanLink name={s.class} type="class" className="truncate">
						{s.class}
					</PlanLink>
					<span className="text-xs">{s.group && "-" + s.group}</span>
					{i < lesson.sections.length - 1 && <span>, </span>}
				</span>
			))}
		</div>
	);

	return (
		<>
			<LessonModal
				show={showModal}
				setShow={setShowModal}
				lesson={lesson}
				date={date}
				change={change}
			/>
			<LessonElement style={change?.type}>
				<div className="w-full h-5 text-sm flex justify-between">
					<ChangeInfo change={change} />
					<LessonHour hour={lesson.hour} />
				</div>
				<div
					className={cn(
						"w-full h-full flex flex-col justify-end mb-0.5",
						change && changeStyles.text[change.type]
					)}
				>
					<div className="flex justify-between items-end font-medium text-md/5">
						<div className="flex">
							<div className="min-w-4.75 self-end">
								{lesson.hour}.
							</div>

							{/* lesson name & group */}
							<div className="line-clamp-2" title={lessonName}>
								{lesson.fullName}{" "}
								{group && (
									<span className="font-normal text-sm">
										(gr. {group})
									</span>
								)}
							</div>
						</div>

						{/* modal button */}
						<Button
							onClick={() => setShowModal(true)}
							className="cursor-pointer hover:bg-foreground-secondary/25 rounded-full mr-[-0.125rem] duration-75"
						>
							<Next width={24} height={24} />
						</Button>
					</div>

					{/* teacher & classroom */}
					<div className="flex h-4 text-sm/5 justify-between">
						{/* teacher */}
						<div className="flex">
							<div className="w-4.75" />
							<div
								title={
									planType !== "teacher"
										? teacherName
										: undefined
								}
							>
								{planType === "teacher"
									? classElement
									: teacher}
							</div>
						</div>

						{/* classroom */}
						<div
							title={
								planType !== "classroom"
									? classroomName
									: undefined
							}
						>
							{planType === "classroom"
								? classElement
								: classroomElement}
						</div>
					</div>
				</div>
			</LessonElement>
		</>
	);
}
export const changeStyles = {
	labelBackground: {
		cancelled: "bg-change-cancelled",
		no_consequence: "bg-change-cancelled",
		substitution: "bg-change-substitution",
		moved: "bg-change-moved",
	},
	textColor: {
		cancelled: "text-change-cancelled",
		no_consequence: "text-change-cancelled",
		substitution: "text-change-substitution",
		moved: "text-change-moved",
	},
	text: {
		cancelled: "line-through",
		no_consequence: "line-through",
		substitution: "",
		moved: "line-through",
	},
};
