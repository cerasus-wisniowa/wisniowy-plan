import { Outlet } from "react-router";
import TableNavigation from "../components/page/table-navigation";
import { fetchOrGetPlanList } from "../lib/fetch/plan-list";
import type { Route } from "./+types/table-page";
import { useEffect } from "react";
import { usePlanList } from "../components/context/plan-list-provider";
import NotificationUI from "../components/ui/notification";
import Spinner from "../components/ui/spinner";
import { useChanges } from "../components/context/changes-provider";
import Error from "../assets/icons/error.svg?react";
import type { ApiPlanList } from "@/lib/definitions/plan-list";

export async function clientLoader() {
	const planList = await fetchOrGetPlanList();

	return planList;
}
export default function TablePage({ loaderData }: Route.ComponentProps) {
	const { setList } = usePlanList();
	const { loading, error } = useChanges();

	useEffect(() => {
		setList(loaderData);
		if (loaderData.api)
			localStorage.setItem(
				"last-plan-change",
				(loaderData as ApiPlanList).lastChanged
			);
	}, [loaderData, setList]);

	return (
		<div className="self-center mt-4">
			<NotificationUI show={loading} style="warning">
				<Spinner width={32} height={32} style="regular" />
				<div>Pobieranie zastępstw...</div>
			</NotificationUI>
			<NotificationUI show={error ? true : false} style="error">
				<Error width={32} height={32} />
				<div>Błąd pobierania zastępstw</div>
			</NotificationUI>
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
