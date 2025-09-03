import { checkHolidays } from "@dudek26/node-ferie";
import { days } from "../../lib/definitions/date";
import type { PlanType } from "../../lib/definitions/plan";
import type { SortedLessons } from "../../lib/definitions/sorted-lessons";
import { areDatesEqual } from "../../lib/util/are-dates-equal";
import { numberArray } from "../../lib/util/number-array";
import { useChanges } from "../context/changes-provider";
import EmptyLessonElement from "./lesson/empty-lesson-element";
import SingleLessonElement from "./lesson/single-lesson-element";
import { nextDate, previousDate } from "../../lib/util/date-utils";
import MultiLessonElement from "./lesson/multi-lesson-element";
import { cn } from "@/lib/util/classname";

export default function PlanColumn({
	lessons,
	date,
	start,
	class: class_,
	planType,
	mobile,
}: {
	lessons: SortedLessons;
	date: Date;
	start: number;
	class: string;
	planType: PlanType;
	mobile?: boolean;
}) {
	const changeDates = useChanges().changes?.dates.map((d) => new Date(d));

	const dayLessons = lessons.flat().sort((a, b) => a.hour - b.hour);

	const firstLesson = mobile ? dayLessons[0]?.hour || 0 : start;
	const lastLesson = dayLessons[dayLessons.length - 1]?.hour || 0;

	const holidays = checkHolidays(date);
	const hasHolidays = holidays.length > 0;

	const isToday = areDatesEqual(date, new Date());

	const nextHasHolidays =
		hasHolidays &&
		!mobile &&
		date.getDay() < 5 &&
		checkHolidays(nextDate(date)).length > 0;
	const previousHasHolidays =
		hasHolidays &&
		!mobile &&
		date.getDay() > 1 &&
		checkHolidays(previousDate(date)).length > 0;

	return (
		<div className="flex mb-2 mt-2 not-first:border-l-1 border-theme/50 flex-1 w-full">
			<div
				className={cn(
					"flex flex-col px-3 pb-2 w-full h-full items-center",
					hasHolidays
						? `bg-deny/10
						${nextHasHolidays ? "" : "rounded-r-standard mr-3"}
						${previousHasHolidays ? "" : "rounded-l-standard ml-3"}
						`
						: isToday
							? "pc:bg-info/5"
							: ""
				)}
			>
				{mobile ?? (
					<div
						className={`${
							changeDates?.find((d) => areDatesEqual(d, date)) &&
							"font-medium"
						} pb-2 flex flex-col items-center text-foreground-secondary w-full
						${nextHasHolidays ? "mr-3" : ""}
						${previousHasHolidays ? "ml-3" : ""}`}
					>
						<p className="text-lg">{date.toLocaleDateString()}</p>
						<p className="text-md">{days[date.getDay()]}</p>
					</div>
				)}
				<ul
					className={`w-full h-full flex flex-col gap-4 not-pc:rounded-t-standard ${
						hasHolidays ? "" : ""
					}
					${!mobile && nextHasHolidays ? "rounded-br-lg" : "rounded-br-standard"}
					${!mobile && previousHasHolidays ? "rounded-bl-lg" : "rounded-bl-standard"}
					`}
				>
					{hasHolidays ? (
						<div className="self-center text-foreground-secondary my-auto text-center content-center h-80">
							{holidays.map((h) => (
								<div key={h.name}>{h.name}</div>
							))}
						</div>
					) : mobile && dayLessons.length === 0 ? (
						<div className="self-center text-foreground-secondary my-auto text-center content-center h-80">
							brak zaplanowanych zajęć
						</div>
					) : (
						numberArray(
							firstLesson,
							lastLesson - firstLesson + 1
						).map((i) => {
							const predicate = (l: {
								hour: number;
								day: number;
							}) => l.hour === i && l.day === date.getDay();
							const lesson =
								lessons.singleLessons.find(predicate);
							if (!lesson) {
								const stackedLesson =
									lessons.stackedLessons.find(predicate);
								if (!stackedLesson) {
									return <EmptyLessonElement key={i} />;
								}
								return (
									<MultiLessonElement
										date={date}
										planType={planType}
										class={class_}
										key={i}
										stackedLesson={stackedLesson}
									/>
								);
							}
							return (
								<SingleLessonElement
									date={date}
									lesson={lesson}
									class={class_}
									key={i}
									planType={planType}
								/>
							);
						})
					)}
				</ul>
			</div>
		</div>
	);
}
