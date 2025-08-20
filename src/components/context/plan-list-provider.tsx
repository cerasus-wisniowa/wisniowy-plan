import { createContext, useContext, useState } from "react";
import type { PlanList } from "../../lib/definitions/plan-list";

export type PlanListContextType = {
	planList?: PlanList;
	loading: boolean;
	error: Error | null;
	setList: (list: PlanList | null) => void;
};

const PlanListContext = createContext<PlanListContextType | null>(null);

export default function PlanListProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const [planList, setPlanList] = useState<PlanList>();
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<Error | null>(null);

	const setList = (list: PlanList | null) => {
		if (list) setPlanList(list);
		else setError(new Error("Failed to fetch plan list"));
		setLoading(false);
	};

	/*
	useEffect(() => {
		if (!loading) return;

		fetchPlanList().then((data) => {
			if (data) {
				setLoading(false);
			} else {
				setError(new Error("Failed to fetch plan list"));
				setLoading(false);
			}
		});
	}, [loading]);
	*/

	return (
		<PlanListContext.Provider
			value={{
				planList: planList,
				error,
				loading,
				setList,
			}}
		>
			{children}
		</PlanListContext.Provider>
	);
}

export function usePlanList() {
	const changes = useContext(PlanListContext);
	if (!changes) {
		throw new Error("usePlanList must be used within a PlanListProvider");
	}

	return changes;
}
