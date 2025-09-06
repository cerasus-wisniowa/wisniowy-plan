import type { PlanType } from "../../../lib/definitions/plan";
import type { StackedLesson } from "../../../lib/definitions/sorted-lessons";
import LessonElement from "./lesson-element";
import SingleLessonElement from "./single-lesson-element";
import LessonHour from "./lesson-hour";
import MultiLessonEntry from "./multi-lesson-entry";
import Overlay from "../../ui/overlay";
import Dropdown from "@/components/ui/dropdown/dropdown";
import { motion, type Variants } from "motion/react";
import DropdownProvider from "@/components/ui/dropdown/dropdown-provider";

export default function MultiLessonElement({
	stackedLesson,
	class: class_,
	planType,
	date,
}: {
	stackedLesson: StackedLesson;
	class: string;
	planType: PlanType;
	date: Date;
}) {
	const limit = 3;
	const overflow = stackedLesson.lessons.length - limit;

	return (
		<LessonElement>
			<div className="flex flex-col justify-between w-full">
				<LessonHour hour={stackedLesson.hour} />
				<ul className="flex flex-col text-sm/4.5">
					{stackedLesson.lessons.slice(0, limit).map((lesson, i) => (
						<MultiLessonEntry
							lesson={lesson}
							key={i}
							class={class_}
							date={date}
						/>
					))}
				</ul>
				<div className="w-fit mx-auto mb-[-0.25rem]">
					<DropdownProvider>
						<Dropdown
							toggle={() => (
								<div className="text-sm w-fit select-none py-0.5 px-1.5 rounded-standard hover:bg-black/10 dark:hover:bg-white/15 duration-75">
									rozwiń {overflow > 0 && `(+${overflow})`}
								</div>
							)}
							className="max-w-screen px-2 py-1"
							position="bottom"
							backdrop={
								<Overlay
									visible
									className="z-4 bg-black/20 dark:bg-black/40 fixed top-0 left-0 w-full h-full"
								/>
							}
							hideDelay={0.075}
						>
							<ul className="w-80 max-w-[95vw] p-2 flex flex-col gap-4">
								{stackedLesson.lessons.map((l, i) => (
									<motion.div
										key={i}
										variants={lessonVariants}
									>
										<SingleLessonElement
											class={class_}
											lesson={l}
											planType={planType}
											date={date}
										/>
									</motion.div>
								))}
							</ul>
						</Dropdown>
					</DropdownProvider>
				</div>
			</div>
		</LessonElement>
	);
}

const lessonVariants: Variants = {
	open: {
		x: [-12, 0],
		opacity: [0, 1],
		transition: {
			x: { duration: 0.15, ease: "easeInOut" },
		},
	},
	closed: {
		x: [0, -8],
		opacity: [1, 0],
		transition: {
			x: { duration: 0.1, ease: "easeInOut" },
		},
	},
};
