import { useWeek } from "../../context/week-provider";
import Next from "../../../assets/icons/navigation/next.svg?react";
import Previous from "../../../assets/icons/navigation/previous.svg?react";

export default function WeekNavigationButton({
	type,
}: {
	type: "forward" | "backward";
}) {
	const { nextWeek, previousWeek } = useWeek();

	const action = () => {
		if (type === "forward") {
			nextWeek();
		} else {
			previousWeek();
		}
	};

	return (
		<button
			onClick={action}
			className="cursor-pointer text-foreground-secondary hover:bg-black/15 dark:hover:bg-white/20 bg-background shadow-sm rounded-xl p-1 duration-100"
		>
			{type === "forward" && <Next width={32} height={32} />}
			{type === "backward" && <Previous width={32} height={32} />}
		</button>
	);
}
