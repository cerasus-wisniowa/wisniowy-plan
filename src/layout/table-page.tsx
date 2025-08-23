import { Outlet } from "react-router";
import TableNavigation from "../components/page/table-navigation";
import { fetchPlanList } from "../lib/fetch/plan-list";
import type { Route } from "./+types/table-page";
import { useEffect } from "react";
import { usePlanList } from "../components/context/plan-list-provider";

export async function clientLoader() {
	const planList = await fetchPlanList();

	return planList;
}
export default function TablePage({ loaderData }: Route.ComponentProps) {
	const { setList } = usePlanList();

	useEffect(() => {
		setList(loaderData);
		if (loaderData)
			localStorage.setItem("last-plan-change", loaderData.lastChanged);
	}, [loaderData, setList]);

	return (
		<div className="self-center mt-4">
			<div className="flex gap-2 justify-center items-end md:max-w-[90%] mx-auto">
				<TableNavigation href="/plan">plan zajęć</TableNavigation>
				<TableNavigation href="/zastepstwa">zastępstwa</TableNavigation>
			</div>
			<div className="w-full bg-background-secondary py-2 px-3 rounded-standard not-md:rounded-t-md shadow-md">
				<Outlet />
			</div>
		</div>
	);
}
