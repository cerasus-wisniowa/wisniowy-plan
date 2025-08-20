import type { PlanType } from "../../../lib/definitions/plan";
import type { StackedLesson } from "../../../lib/definitions/sorted-lessons";
import Dropdown from "../../ui/dropdown";
import LessonElement from "./lesson-element";
import SingleLessonElement from "./single-lesson-element";
import LessonHour from "./lesson-hour";
import MultiLessonEntry from "./multi-lesson-entry";
import Overlay from "../../ui/overlay";

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
						/>
					))}
				</ul>
				<div className="rounded-standard py-0.5 px-1.5 hover:bg-black/10 dark:hover:bg-white/15 w-fit duration-75 mx-auto mb-[-0.25rem]">
					<Dropdown
						transitions={false}
						toggle={() => (
							<div className="text-sm w-fit select-none">
								rozwiń {overflow > 0 && `(+${overflow})`}
							</div>
						)}
						placement="bottom"
						backdrop={
							<Overlay
								visible
								className="z-4 bg-black/20 dark:bg-black/40 fixed top-0 left-0 w-full h-full"
							/>
						}
					>
						<ul className="w-80 p-2 flex flex-col gap-4">
							{stackedLesson.lessons.map((l, i) => (
								<SingleLessonElement
									key={i}
									class={class_}
									lesson={l}
									planType={planType}
									date={date}
								/>
							))}
						</ul>
					</Dropdown>
				</div>
			</div>
		</LessonElement>
	);
}
