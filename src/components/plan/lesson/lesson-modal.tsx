import { type Change, changeTypes } from "../../../lib/definitions/change";
import type { Lesson } from "../../../lib/definitions/lesson";
import Modal from "../../../components/ui/modal/modal";
import { changeStyles } from "./single-lesson-element";
import bells from "../../../data/bells.json";
import { motion, type Variants } from "motion/react";
import PlanLink from "../plan-link";

type LessonModalProps = {
	show: boolean;
	setShow: (show: boolean) => void;
	lesson: Lesson;
	change?: Change;
	date: Date;
};

export default function LessonModal({
	show,
	setShow,
	lesson,
	change,
	date,
}: LessonModalProps) {
	const ModalLabel = ({ children }: { children: React.ReactNode }) => (
		<span className="font-bold text-[0.925rem]/6">{children}:</span>
	);

	const ModalElement = ({ children }: { children: React.ReactNode }) => (
		<motion.div
			variants={itemVariants}
			initial={{
				opacity: 0,
			}}
			className="flex gap-2"
		>
			{children}
		</motion.div>
	);

	return (
		<Modal
			show={show}
			onHide={() => setShow(false)}
			closeButton
			childDelayStagger={0.03}
			className="not-pc:w-5/6 pc:min-w-96 pc:max-w-140"
			title={
				<>
					Informacje o zajęciach{" "}
					{change && (
						<>
							{" "}
							-{" "}
							<span
								className={changeStyles.textColor[change.type]}
							>
								{changeTypes[change.type]}
							</span>
						</>
					)}
				</>
			}
			backdrop
		>
			<div className="flex flex-col gap-2 justify-start text-start">
				<ModalElement>
					<ModalLabel>DATA</ModalLabel>
					<span>
						{date.toLocaleDateString("pl-PL", {
							weekday: "long",
							year: "numeric",
							month: "long",
							day: "numeric",
						})}
					</span>
				</ModalElement>
				<ModalElement>
					<ModalLabel>GODZINA</ModalLabel>
					<span>
						{lesson.hour}. {bells[lesson.hour]}
					</span>
				</ModalElement>
				<ModalElement>
					<ModalLabel>PRZEDMIOT</ModalLabel>
					<span>
						<span
							className={`${
								change?.type === "cancelled" ||
								(change?.consequence &&
									change?.consequence !== lesson.fullName)
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
				</ModalElement>
				<ModalElement>
					<ModalLabel>NAUCZYCIEL</ModalLabel>
					<span>
						<PlanLink
							type="teacher"
							name={lesson.teacher?.initials}
							className={`${change ? "line-through" : ""}`}
						>
							{lesson.teacher?.firstName}.{" "}
							{lesson.teacher?.lastName} (
							{lesson.teacher?.initials})
						</PlanLink>
						{change?.substitutionTeacher &&
							` → ${change.substitutionTeacher.firstName} ${change.substitutionTeacher.lastName}`}
					</span>
				</ModalElement>
				{lesson.room && (
					<ModalElement>
						<ModalLabel>SALA</ModalLabel>
						<span>
							<PlanLink
								type="classroom"
								name={lesson.room.room}
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
							</PlanLink>
							{change?.classroom &&
								change?.classroom.room !== lesson.room.room &&
								` → ${change.classroom.room} - ${change.classroom.name}`}
						</span>
					</ModalElement>
				)}
				<ModalElement>
					<ModalLabel>
						ODDZIAŁ{lesson.sections.length > 1 && "Y"}
					</ModalLabel>

					{lesson.sections.map((s) => (
						<span key={s.class + "/" + s.group}>
							<PlanLink type="class" name={s.class}>
								{s.class}
							</PlanLink>
							{s.group && " - gr. " + s.group}
							<span className="last:hidden">, </span>
						</span>
					))}
				</ModalElement>
				{change && (
					<motion.div
						variants={itemVariants}
						initial={{
							opacity: 0,
						}}
						className="flex flex-col"
					>
						{change.note && (
							<div className="flex gap-2">
								<ModalLabel>UWAGI DO ZASTĘPSTWA</ModalLabel>
								<span>{change.note}</span>
							</div>
						)}
						{change.generated && (
							<div className="flex gap-2 text-foreground-tertiary">
								* zastępstwo wygenerowane automatycznie
							</div>
						)}
					</motion.div>
				)}
			</div>
		</Modal>
	);
}

const itemVariants: Variants = {
	open: {
		opacity: 1,
		transition: {
			ease: "easeInOut",
			duration: 0.2,
		},
	},
};
