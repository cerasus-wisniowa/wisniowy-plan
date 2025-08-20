import type { Lesson } from "../../../lib/definitions/lesson";
import LessonElement from "./lesson-element";
import bells from "../../../data/bells.json";
import { useChanges } from "../../context/changes-provider";
import { findChange } from "../../../lib/util/find-change";
import { changeTypes } from "../../../lib/definitions/change";
import { Fragment, useState } from "react";

import { useWeek } from "../../context/week-provider";
import { getDayOffset } from "../../../lib/util/get-date-offset";
import type { PlanType } from "../../../lib/definitions/plan";
import PlanLink from "../plan-link";
import { Button, Modal } from "@restart/ui";

import Next from "../../../assets/icons/navigation/next.svg?react";
import Note from "../../../assets/icons/note.svg?react";
import LessonHour from "./lesson-hour";
import { motion } from "motion/react";

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

	const [showModal, setShowModal] = useState(false);

	const change =
		changes && findChange(lesson, changes, getDayOffset(week, lesson.day));

	const styles = {
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
		<PlanLink name={lesson.teacher?.initials} type="teacher">
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
			className="pl-1"
		>
			{classroom}
		</PlanLink>
	);

	const classElement = lesson.sections.map((s) => (
		<Fragment key={s.class + "/" + s.group}>
			<PlanLink name={s.class} type="class">
				{s.class}
			</PlanLink>
			<span className="text-xs">{s.group && "-" + s.group}</span>
			<span className="last:hidden">, </span>
		</Fragment>
	));

	let notes = change?.note;
	if (change?.generated) {
		if (notes) notes += "\n";
		notes += "(wygenerowano automatycznie)";
	}

	const ModalLabel = ({ children }: { children: React.ReactNode }) => (
		<span className="font-bold text-[0.925rem]/6">{children}:</span>
	);

	return (
		<>
			<Modal
				show={showModal}
				onHide={() => setShowModal(false)}
				renderBackdrop={(props) => (
					<div
						{...props}
						className="fixed inset-0 bg-black/40 z-300"
					/>
				)}
				autoFocus={false}
				className="flex-col w-screen h-screen z-50"
			>
				<motion.div
					initial={{
						scale: 0.8,
						opacity: 0,
					}}
					animate={{
						scale: 1,
						opacity: 1,
					}}
					transition={{
						type: "spring",
						damping: 30,
						stiffness: 500,
						ease: "easeOut",
					}}
					className="fixed z-301 top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2 bg-background-secondary rounded-standard shadow-lg pt-6 pb-4 px-8 max-w-[95%] w-144"
				>
					<h2 className="text-2xl mb-2 font-medium text-center">
						Informacje o zajęciach{" "}
						{change && (
							<>
								{" "}
								-{" "}
								<span className={styles.textColor[change.type]}>
									{changeTypes[change.type]}
								</span>
							</>
						)}
					</h2>
					<div className="flex flex-col gap-2 justify-start">
						<div className="flex gap-2">
							<ModalLabel>DATA</ModalLabel>
							<span>
								{date.toLocaleDateString("pl-PL", {
									weekday: "long",
									year: "numeric",
									month: "long",
									day: "numeric",
								})}
							</span>
						</div>
						<div className="flex gap-2">
							<ModalLabel>GODZINA</ModalLabel>
							<span>
								{lesson.hour}. {bells[lesson.hour]}
							</span>
						</div>
						<div className="flex gap-2">
							<ModalLabel>PRZEDMIOT</ModalLabel>
							<span>
								<span
									className={`${
										change?.type === "cancelled" ||
										(change?.consequence &&
											change?.consequence !==
												lesson.fullName)
											? "line-through"
											: ""
									}`}
								>
									{lesson.fullName}
								</span>
								{change?.consequence &&
									change?.consequence !== lesson.fullName &&
									` → ${change.consequence}`}
							</span>
						</div>
						<div className="flex gap-2">
							<ModalLabel>NAUCZYCIEL</ModalLabel>
							<span>
								<span
									className={`${
										change ? "line-through" : ""
									}`}
								>
									{lesson.teacher?.firstName}.{" "}
									{lesson.teacher?.lastName} (
									{lesson.teacher?.initials})
								</span>
								{change?.substitutionTeacher &&
									` → ${change.substitutionTeacher.firstName} ${change.substitutionTeacher.lastName}`}
							</span>
						</div>
						{lesson.room && (
							<div className="flex gap-2">
								<ModalLabel>SALA</ModalLabel>
								<span>
									<span
										className={`${
											change?.type === "cancelled" ||
											(change?.classroom &&
												change?.classroom.room !==
													lesson.room?.room)
												? "line-through"
												: ""
										}`}
									>
										{lesson.room.room} - {lesson.room.name}
									</span>
									{change?.classroom &&
										change?.classroom.room !==
											lesson.room.room &&
										` → ${change.classroom.room} - ${change.classroom.name}`}
								</span>
							</div>
						)}
						<div className="flex gap-2">
							<ModalLabel>
								ODDZIAŁ{lesson.sections.length > 1 ? "Y" : ""}
							</ModalLabel>

							{lesson.sections.map((s) => (
								<span key={s.class + "/" + s.group}>
									{s.class}
									{s.group && " - gr. " + s.group}
									<span className="last:hidden">, </span>
								</span>
							))}
						</div>
						{change?.note && (
							<div className="flex gap-2">
								<ModalLabel>UWAGI DO ZASTĘPSTWA</ModalLabel>
								<span>{change.note}</span>
							</div>
						)}
						{change?.generated && (
							<div className="flex gap-2 text-foreground-tertiary">
								* zastępstwo wygenerowane automatycznie
							</div>
						)}
					</div>
					<div className="w-full text-center">
						<Button
							onClick={() => setShowModal(false)}
							className="bg-background rounded-standard w-28 h-12 mt-4 hover:bg-theme hover:text-foreground text-theme duration-100 cursor-pointer"
						>
							Zamknij
						</Button>
					</div>
				</motion.div>
			</Modal>
			<LessonElement style={change?.type}>
				<div className="h-full flex flex-col w-full">
					<div className="flex justify-between text-sm ">
						{change ? (
							<div
								className={`ml-[-0.5rem] dark:text-background text-foreground font-medium pl-1 pr-2 rounded-r-full flex items-center ${
									styles.labelBackground[change?.type]
								}`}
							>
								<span>{changeTypes[change.type]} </span>
								{notes && (
									<span title={notes} className="ml-1">
										<Note width={16} height={16} />
									</span>
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
									className={`content-end h-full mb-6 text-md/5.5 font-medium ${
										change && styles.text[change.type]
									}`}
								>
									{lesson.hour}.
								</div>
								<div
									title={
										lessonName +
										(group ? ` (gr. ${group})` : "")
									}
									className={`content-end h-full overflow-hidden overflow-ellipsis line-clamp-2 text-md/5.5 font-medium ${
										change && styles.text[change.type]
									}`}
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
								className={`text-foreground-secondary max-w-42 line-clamp-1 ml-5 ${
									change && styles.text[change.type]
								}`}
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
									className={`self-end max-w-14 line-clamp-1 ${
										change ? styles.text[change.type] : ""
									}`}
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
