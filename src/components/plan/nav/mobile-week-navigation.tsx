import { useWeek } from "../../context/week-provider";
import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { numberArray } from "../../../lib/util/number-array";
import { getDayOffset } from "../../../lib/util/get-date-offset";
import { daysShort, getMonthsSpanString } from "../../../lib/definitions/date";
import { useChanges } from "../../context/changes-provider";
import { areDatesEqual } from "../../../lib/util/are-dates-equal";
import { sleep } from "../../../lib/util/sleep";
import { useSwipeable, type SwipeEventData } from "react-swipeable";
import useWindowDimensions from "../../hook/use-window-dimensions";
import { useTheme } from "../../context/theme-provider";
import { skipWeekend } from "../../../lib/util/skip-weekend";

export default function MobileWeekNavigation() {
	const { week, mobileDay, setMobileDay, setWeek } = useWeek();
	const { changes } = useChanges();
	const { width } = useWindowDimensions();
	const { theme } = useTheme();

	const [navWeek, setNavWeek] = useState(new Date(week.getTime()));
	const [index, setIndex] = useState(1);

	const ulRef = useRef<HTMLUListElement>(null);

	function scrollToIndex(i: number, disableAnimation?: boolean) {
		if (i < 0 || i > 2) return;
		const listNode = ulRef.current;
		if (!listNode) return;
		const weekNode = listNode.querySelectorAll("li")[i];
		weekNode.scrollIntoView({
			behavior: disableAnimation ? undefined : "smooth",
			block: "nearest",
			inline: "center",
		});
		setIndex(i);
		sleep(550).then(() => {
			const newNavWeek = new Date(navWeek);
			newNavWeek.setDate(newNavWeek.getDate() + (i - 1) * 7);
			setNavWeek(new Date(newNavWeek));
			setIndex(1);
			const newListNode = ulRef.current;
			if (!newListNode) return;
			const newWeekNode = newListNode.querySelectorAll("li")[1];
			listNode.style.transform = `translateX(0)`;
			newWeekNode.scrollIntoView({
				block: "nearest",
				inline: "center",
			});
		});
	}

	useEffect(() => {
		if (ulRef.current) scrollToIndex(1, true);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [width]);

	function handleSwiping(e: SwipeEventData) {
		if (!ulRef.current) return;
		ulRef.current.style.transform = `translateX(${e.deltaX}px)`;
	}

	function handleSwipe(e: SwipeEventData) {
		if (!ulRef.current) return;
		if (e.deltaX < -50) scrollToIndex(index + 1);
		else if (e.deltaX > 50) scrollToIndex(index - 1);
		else {
			scrollToIndex(index);
		}
	}

	const handlers = useSwipeable({
		onSwiped: handleSwipe,
		onSwiping: handleSwiping,
		trackMouse: true,
	});

	const [trueTheme, setTrueTheme] = useState<"dark" | "light" | null>(null);
	useEffect(() => {
		const isDark =
			theme === "dark" ||
			(theme === "system" &&
				window.matchMedia("(prefers-color-scheme: dark)").matches);
		if (isDark) setTrueTheme("dark");
		else setTrueTheme("light");
	}, [theme]);

	function selectWeek(e: ChangeEvent<HTMLInputElement>) {
		const value = e.currentTarget.valueAsDate;
		if (value) {
			const parsedValue = skipWeekend(value);
			setWeek(getDayOffset(parsedValue, -parsedValue.getDay()));
			setNavWeek(getDayOffset(parsedValue, -parsedValue.getDay()));
			setMobileDay(parsedValue.getDay());
		}
	}

	return (
		<div>
			<div className="text-center pb-0.5">
				<label htmlFor="DateTimeFormatOptions">
					{getMonthsSpanString(navWeek, 5, "/")}
				</label>
				<input
					id="date"
					type="date"
					className="w-5 h-5 ml-1 accent-theme"
					onChange={selectWeek}
					style={{
						colorScheme: trueTheme === "dark" ? "dark" : undefined,
					}}
				/>
			</div>
			<div className="overflow-hidden w-full" {...handlers}>
				<ul className="whitespace-nowrap flex" ref={ulRef}>
					{numberArray(-1, 3).map((i) => (
						<li
							key={i * 10}
							className="flex min-w-full justify-between text-foreground-secondary"
						>
							{numberArray(1, 5).map((j) => {
								const date = getDayOffset(navWeek, j + i * 7);
								const selectedDate = getDayOffset(
									week,
									mobileDay
								);
								return (
									<button
										key={j}
										className={`${
											areDatesEqual(date, selectedDate)
												? "text-theme"
												: ""
										} ${
											changes?.dates.some((d) =>
												areDatesEqual(new Date(d), date)
											)
												? "font-semibold"
												: ""
										} py-1 px-2 flex-1`}
										onClick={() => {
											setWeek(
												getDayOffset(
													date,
													-date.getDay()
												)
											);
											setMobileDay(j);
										}}
									>
										<div>{date.getDate()}</div>
										<div className="text-md">
											{daysShort[j]}
										</div>
									</button>
								);
							})}
						</li>
					))}
				</ul>
			</div>
		</div>
	);
}
