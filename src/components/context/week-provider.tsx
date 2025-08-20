import { createContext, useContext, useState } from "react";
import { skipWeekend } from "../../lib/util/skip-weekend";

export type WeekContextType = {
	week: Date;
	setWeek: React.Dispatch<React.SetStateAction<Date>>;
	nextWeek: () => void;
	previousWeek: () => void;
	mobileDay: number;
	setMobileDay: React.Dispatch<React.SetStateAction<number>>;
};

const WeekContext = createContext<WeekContextType | null>(null);

export default function WeekProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const d = skipWeekend();
	d.setTime(d.getTime() - 1000 * 60 * 60 * 24 * d.getDay());
	const [week, setWeek] = useState<Date>(d);
	const [mobileDay, setMobileDay] = useState(skipWeekend().getDay());

	const nextWeek = () => {
		setWeek(new Date(week.getTime() + 1000 * 60 * 60 * 24 * 7));
	};

	const previousWeek = () => {
		setWeek(new Date(week.getTime() - 1000 * 60 * 60 * 24 * 7));
	};

	return (
		<WeekContext.Provider
			value={{
				week,
				nextWeek,
				previousWeek,
				mobileDay,
				setMobileDay,
				setWeek,
			}}
		>
			{children}
		</WeekContext.Provider>
	);
}

export function useWeek() {
	const week = useContext(WeekContext);
	if (!week) {
		throw new Error("useWeek must be used within a WeekProvider");
	}

	return week;
}
