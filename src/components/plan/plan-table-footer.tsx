import { relativeDateString, dateIfYesterday } from "@/lib/util/date-utils";
import useDate from "../hook/use-date";

export default function PlanTableFooter({
	lastUpdate,
	generated,
}: {
	lastUpdate: Date | undefined;
	generated: Date;
}) {
	const date = useDate();

	return (
		<div className="pc:mx-6 text-sm pc:text-md text-foreground-inverse-secondary pt-2 flex gap-1 pc:gap-4 justify-between not-pc:flex-col not-pc:text-center">
			<div>
				Zaktualizowano{" "}
				{lastUpdate
					? `${relativeDateString(
							date,
							lastUpdate
						)} (${dateIfYesterday(lastUpdate)})`
					: "?"}
			</div>

			<div>
				wygenerowano{" "}
				{generated.toLocaleDateString("pl-PL", {
					day: "numeric",
					month: "long",
					year: "numeric",
				})}
			</div>
		</div>
	);
}
