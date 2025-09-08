import type { Lesson } from "../../../lib/definitions/lesson";
import LessonElement from "./lesson-element";
import { useChanges } from "../../context/changes-provider";
import { findChange } from "../../../lib/util/find-change";
import { changeTypes } from "../../../lib/definitions/change";
import { useEffect, useRef, useState } from "react";

import { useWeek } from "../../context/week-provider";
import { getDayOffset } from "../../../lib/util/get-date-offset";
import type { PlanType } from "../../../lib/definitions/plan";
import PlanLink from "../plan-link";
import { Button, Overlay } from "@restart/ui";

import Next from "../../../assets/icons/navigation/next.svg?react";
import Note from "../../../assets/icons/note.svg?react";
import LessonHour from "./lesson-hour";
import LessonModal from "./lesson-modal";
import { cn } from "@/lib/util/classname";
import { motion } from "motion/react";

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

export default function SingleLessonElement({
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
	const noteRef = useRef<HTMLSpanElement>(null);
	const containterRef = useRef<HTMLDivElement>(null);

	const [showModal, setShowModal] = useState(false);
	const [showNote, setShowNote] = useState(false);

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
				<span key={i} className="w-full flex items-center">
					<PlanLink name={s.class} type="class" className="truncate">
						{s.class}
					</PlanLink>
					<span className="text-xs">{s.group && "-" + s.group}</span>
					{i < lesson.sections.length - 1 && <span>, </span>}
				</span>
			))}
		</div>
	);

	let notes = change?.note;
	if (change?.generated) {
		if (notes) notes += "\n";
		notes += "(wygenerowano automatycznie)";
	}

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
				<div
					ref={containterRef}
					className="h-full flex flex-col w-full"
				>
					<div className="flex justify-between text-sm ">
						{change ? (
							<div
								className={cn(
									"ml-[-0.5rem] dark:text-background text-foreground font-medium pl-1 pr-2 rounded-r-full flex items-center select-none",
									changeStyles.labelBackground[change?.type],
									notes && "cursor-help"
								)}
								onMouseEnter={() => setShowNote(true)}
								onMouseLeave={() => setShowNote(false)}
							>
								<span>{changeTypes[change.type]} </span>
								{notes && (
									<>
										<span ref={noteRef} className="ml-1">
											<Note width={16} height={16} />
										</span>
										<Overlay
											show={showNote}
											target={noteRef}
											container={containterRef}
											placement="right"
											rootClose
											offset={[0, 8]}
										>
											{(props, { arrowProps }) => (
												<motion.div
													initial={{ opacity: 0 }}
													animate={{ opacity: 1 }}
													transition={{
														duration: 0.05,
													}}
													{...props}
													className="absolute"
												>
													<div
														{...arrowProps}
														style={arrowProps.style}
														className={cn(
															"absolute w-4 h-4 z-[-1]",
															"before:absolute before:rotate-45 before:bg-background before:top-0 before:left-0 before:w-3 before:h-3"
														)}
													/>
													<div className="py-1 px-2 text-center text-sm rounded bg-background text-foreground-secondary ">
														{notes}
													</div>
												</motion.div>
											)}
										</Overlay>
									</>
								)}
							</div>
						) : (
							<div></div>
						)}
						<LessonHour hour={lesson.hour} />
					</div>
					<div className="flex flex-col justify-end h-full">
						<div className="flex gap-1 justify-between">
							<div className="flex gap-1.5">
								<div
									className={cn(
										"content-end h-full mb-6 text-md/5 font-medium",
										change && changeStyles.text[change.type]
									)}
								>
									{lesson.hour}.
								</div>
								<div
									title={
										lessonName +
										(group ? ` (gr. ${group})` : "")
									}
									className={cn(
										"content-end h-full overflow-hidden overflow-ellipsis line-clamp-2 text-md/5 font-medium",
										change && changeStyles.text[change.type]
									)}
								>
									{lessonName}{" "}
									{group && (
										<span className="font-normal text-sm text-nowrap">
											(gr. {group})
										</span>
									)}
								</div>
							</div>
							<Button
								onClick={() => setShowModal(true)}
								className="self-end cursor-pointer hover:bg-foreground-secondary hover:text-background rounded-full mr-[-0.125rem] duration-75 mb-1"
							>
								<Next width={24} height={24} />
							</Button>
						</div>
						<div className="flex justify-between w-full text-sm">
							<div
								title={
									planType === "teacher"
										? lesson.sections
												.map(
													(s) =>
														`${s.class}${
															s.group
																? `- gr. ${s.group}`
																: ""
														}`
												)
												.join(", ")
										: teacherName
								}
								className={cn(
									"text-foreground-secondary max-w-42 line-clamp-1 ml-5",
									change && changeStyles.text[change.type]
								)}
							>
								{planType === "teacher"
									? classElement
									: teacher}
							</div>
							{lesson.room && (
								<div
									title={
										planType === "classroom"
											? lesson.sections
													.map(
														(s) =>
															`${s.class}${
																s.group
																	? `- gr. ${s.group}`
																	: ""
															}`
													)
													.join(", ")
											: classroomName
									}
									className={`self-end line-clamp-1 ${
										change
											? changeStyles.text[change.type]
											: ""
									} ${planType === "classroom" ? "max-w-24 min-w-fit" : "max-w-14"}`}
								>
									{planType === "classroom"
										? classElement
										: classroomElement}
								</div>
							)}
						</div>
					</div>
				</div>
			</LessonElement>
		</>
	);
}
