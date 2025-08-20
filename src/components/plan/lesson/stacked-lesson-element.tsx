import type { PlanType } from "../../../lib/definitions/plan";
import type { StackedLesson } from "../../../lib/definitions/sorted-lessons";
import Dropdown from "../../ui/dropdown";
import LessonElement from "./lesson-element";
import SingleLessonElement from "./single-lesson-element";

export default function StackedLessonElement({
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
	return (
		<LessonElement>
			<div className="self-center w-full">
				<div className="flex justify-center pt-1">
					Wiele pozycji ({stackedLesson.lessons.length})
				</div>
				<Dropdown
					toggle={() => (
						<div className="flex justify-center p-1 px-2 rounded-standard hover:bg-background-tertiary text-foreground-secondary hover:text-theme m-auto w-fit cursor-pointer duration-100">
							rozwiń
						</div>
					)}
					placement="bottom"
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
		</LessonElement>
	);
}
