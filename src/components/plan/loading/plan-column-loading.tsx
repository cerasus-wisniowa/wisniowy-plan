import { days } from "../../../lib/definitions/date";
import { areDatesEqual } from "../../../lib/util/are-dates-equal";
import { numberArray } from "../../../lib/util/number-array";
import { useChanges } from "../../context/changes-provider";
import EmptyLessonElement from "../empty-lesson-element";
import LoadingLessonElement from "./loading-lesson-element";

// unused
export default function PlanColumnLoading({
	date,
	start,
	length,
	mobile,
}: {
	date: Date;
	start: number;
	length: number;
	mobile?: boolean;
}) {
	const changeDates = useChanges().changes?.dates.map((d) => new Date(d));
	return (
		<div
			className={`not-first:border-l-1 border-theme/50 flex flex-col pb-1 p-3 w-full items-center `}
		>
			{mobile ?? (
				<div
					className={`${
						changeDates?.find((d) => areDatesEqual(d, date)) &&
						"font-medium"
					} pb-2 flex flex-col items-center text-foreground-secondary w-full rounded-t-standard`}
				>
					<p className="text-lg">{date.toLocaleDateString()}</p>
					<p className="text-md">{days[date.getDay()]}</p>
				</div>
			)}
			<ul
				className={`w-full h-full flex flex-col gap-4 rounded-b-standard ${mobile ? "rounded-t-standard" : ""}`}
			>
				{numberArray(1, start + length - 1).map((i) => {
					if (i < start) return <EmptyLessonElement key={i} />;
					else return <LoadingLessonElement key={i} />;
				})}
			</ul>
		</div>
	);
}
