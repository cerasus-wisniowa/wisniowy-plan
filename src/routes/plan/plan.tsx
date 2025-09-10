import { useEffect, useState } from "react";
import PlanTable from "@/components/plan/plan-table";
import { type PlanFilters } from "@/lib/definitions/filters";
import WeekNavigationButton from "@/components/plan/nav/week-navigation-button";
import Divider from "@/components/ui/divider";
import { fetchPlan } from "@/lib/fetch/plan";
import type { PlanInfo, PlanType } from "@/lib/definitions/plan";
import { useWeek } from "@/components/context/week-provider";
import { getMonthsSpanString } from "@/lib/definitions/date";
import { replace, type ClientLoaderFunctionArgs } from "react-router";
import PlanListDropdown from "@/components/plan/header/plan-list-dropdown";
import { getPlanName } from "@/lib/util/plan-list-utils";
import { usePlanList } from "@/components/context/plan-list-provider";
import Delete from "@/assets/icons/delete.svg?react";
import Tune from "@/assets/icons/tune.svg?react";
import { Button } from "@restart/ui";
import useWindowDimensions from "@/components/hook/use-window-dimensions";

import Error from "@/assets/icons/error.svg?react";
import MobileWeekNavigation from "@/components/plan/nav/mobile-week-navigation";
import type { Route } from "./+types/plan";
import { getFilters, saveFilters } from "@/lib/database/filters";
import Modal from "@/components/ui/modal/modal";
import { getFavorites } from "@/lib/database/favorites";
import { getPlan, getStoredPlansList } from "@/lib/database/plan";
import Filters from "@/components/plan/header/filters/filters";
import { hasType } from "@/lib/util/has-lesson-type";
import GroupFilter from "@/components/plan/header/filters/group-filter";
import { useNotifications } from "@/components/context/notifications-provider";
import { useStatus } from "@/components/context/status-provider";
import PlanTableFooter from "@/components/plan/plan-table-footer";
import PlanTableLoading from "@/components/plan/loading/plan-table-loading";

export async function clientLoader({ params }: ClientLoaderFunctionArgs) {
	const query = {
		type:
			(localStorage.getItem("plan-type") as PlanType | null) ||
			("class" as PlanType),
		name: localStorage.getItem("plan-name") || "1la",
	};

	const { type, name } = params;
	if (type && ["class", "teacher", "classroom"].includes(type)) {
		query.type = type as PlanType;
		localStorage.setItem("plan-type", type);
	} else return replace(`/plan/${query.type}/${query.name}`);
	if (name) {
		query.name = name;
		localStorage.setItem("plan-name", name);
	} else return replace(`/plan/${query.type}/${query.name}`);

	const planInfo = { ...query, source: "planlekcji" } satisfies PlanInfo;
	const plan = await getPlan(planInfo);

	const storedFilters = await getFilters(query.name);
	const rawFavorites = await getFavorites();
	const storedPlansList = await getStoredPlansList();

	return {
		query,
		plan,
		storedFilters,
		rawFavorites,
		storedPlansList,
	};
}

export default function PlanRoute({ loaderData }: Route.ComponentProps) {
	const {
		query,
		plan: loadedPlan,
		storedFilters,
		rawFavorites,
		storedPlansList,
	} = loaderData;

	const { isMobile } = useWindowDimensions();
	const { planList } = usePlanList();
	const { week } = useWeek();
	const { addNotification } = useNotifications();
	const [, setStatus] = useStatus();

	const source = "planlekcji";

	const [filters, setFilters] = useState<PlanFilters>(storedFilters);
	const [mobileFilters, setMobileFilters] = useState(false);
	const [notified, setNotified] = useState(false);
	const [plan, setPlan] = useState(loadedPlan);
	const [planLoading, setPlanLoading] = useState(true);

	useEffect(() => {
		setFilters(storedFilters);
	}, [storedFilters]);

	useEffect(() => {
		if (planList?.isUpdating && !notified) {
			addNotification({
				type: "warning",
				title: "Aktualizacja planu",
				message:
					"Trwa aktualizacja planu zajęć, odśwież stronę za kilka minut",
				duration: 5000,
			});
			setNotified(true);
		}
	}, [addNotification, notified, planList?.isUpdating]);

	useEffect(() => {
		const lastChanged = localStorage.getItem("last-plan-change-" + source);
		setPlan(loadedPlan);

		if (!loadedPlan || loadedPlan.lastChanged !== lastChanged) {
			setPlanLoading(true);
			console.log("Updating plan " + query.name);
			console.log(
				(loadedPlan?.lastChanged ?? "never") + " -> " + lastChanged
			);
			setStatus("Aktualizacja danych...");
			try {
				const planInfo = {
					name: loadedPlan?.name || query.name,
					type: loadedPlan?.type || query.type,
					source: "planlekcji",
				} satisfies PlanInfo;
				fetchPlan(planInfo)
					.then((p) => {
						setPlan(p);
					})
					.catch((error) => {
						console.error(error);
					})
					.finally(() => {
						setStatus(null);
						setPlanLoading(false);
					});
			} catch (error) {
				console.error(error);
			}
		} else setPlanLoading(false);
	}, [loadedPlan, query, setStatus]);

	const updateFilters = (filters: PlanFilters) => {
		saveFilters({ ...filters });
		setFilters({ ...filters });
	};

	const hasFilters =
		plan?.type === "class" &&
		plan?.lessons.some((l) => l.type !== "regular");

	const ResetFilters = ({ className }: { className?: string }) => (
		<Button
			onClick={() => {
				filters.exclude = {};
				filters.groups = {};
				filters.teachers = {};
				updateFilters({ ...filters });
			}}
			className={
				"flex bg-background hover:text-foreground text-deny hover:bg-deny cursor-pointer shadow-sm duration-100 w-12 h-12 pc:p-1.5 pc:w-fit pc:h-fit " +
				className
			}
		>
			<Delete width={28} height={28} className="mx-auto" />
		</Button>
	);

	const lastUpdate =
		planList?.lastUpdate && !planLoading
			? new Date(planList.lastUpdate)
			: plan?.lastUpdate
				? new Date(plan.lastUpdate)
				: undefined;

	return (
		<>
			{isMobile() && (
				<Modal
					show={mobileFilters && hasFilters}
					onHide={() => setMobileFilters(false)}
					closeButton
					backdrop
					customCloseButton={
						<>
							<ResetFilters className="items-center w-12 rounded-standard self-center" />
							<Button
								onClick={() => setMobileFilters(false)}
								className="bg-background rounded-standard w-28 hover:bg-theme hover:text-foreground text-theme duration-100 cursor-pointer h-full mr-14"
							>
								Zamknij
							</Button>
						</>
					}
					title={
						<>
							Ustawienia wyświetlania dla{" "}
							<span className="font-semibold text-theme">
								{planList &&
									getPlanName(
										query.name,
										query.type,
										planList
									)}
							</span>
						</>
					}
					className="w-[90%] max-h-[90%]"
				>
					<div className="flex flex-col gap-3 mt-2 overflow-y-auto items-start">
						<Filters
							filters={filters}
							updateFilters={updateFilters}
							plan={plan!}
						/>
					</div>
				</Modal>
			)}
			<div className="flex flex-col gap-2">
				<div className="flex gap-4 justify-between">
					<div className="flex gap-4 not-pc:justify-between w-full">
						<div className="flex gap-2 self-center">
							<PlanListDropdown
								rawFavorites={rawFavorites}
								storedPlansList={storedPlansList}
							/>
							{isMobile() &&
								hasType(plan?.lessons || [], "group") && (
									<GroupFilter
										options={[1, 2]}
										selected={filters.groups?.group}
										onSelect={(i) => {
											filters.groups.group =
												i === filters.groups?.group
													? undefined
													: i;
											updateFilters(filters);
										}}
									/>
								)}
						</div>
						{hasFilters && !isMobile() && (
							<div className="flex gap-x-6 gap-y-1 self-center flex-wrap not-pc:hidden">
								<Filters
									filters={filters}
									updateFilters={updateFilters}
									plan={plan}
								/>
							</div>
						)}

						{hasFilters && (
							<Button
								onClick={() => setMobileFilters(true)}
								className="pc:hidden bg-background text-foreground-secondary hover:text-theme cursor-pointer rounded-xl h-fit p-1.5 self-center shadow-sm duration-100"
							>
								<Tune width={28} height={28} />
							</Button>
						)}
					</div>
					{!isMobile() && plan?.type === "class" && (
						<ResetFilters className="rounded-xl" />
					)}
				</div>
				{!isMobile() ? (
					<div className="flex justify-between w-full not-pc:hidden">
						<div className="text-foreground-secondary text-xl self-end flex gap-2 items-end">
							<span className="font-medium">
								{planList &&
									getPlanName(
										plan?.name || query.name,
										plan?.type || query.type,
										planList
									)}
							</span>
						</div>
						<div className="self-end flex gap-3 text-foreground-secondary text-xl items-end">
							<span>{getMonthsSpanString(week, 5)}</span>
							<nav className="flex justify-end gap-2">
								<WeekNavigationButton type={"backward"} />
								<WeekNavigationButton type={"forward"} />
							</nav>
						</div>
					</div>
				) : (
					<MobileWeekNavigation />
				)}
				{!isMobile() && <Divider style="theme" />}
				<div className="">
					{plan ? (
						<>
							<PlanTable plan={plan} filters={filters} />
							<PlanTableFooter
								lastUpdate={lastUpdate}
								generated={new Date(plan.generated)}
							/>
						</>
					) : planLoading && planList ? (
						<PlanTableLoading
							planName={getPlanName(
								query.name,
								query.type,
								planList
							)}
						/>
					) : (
						<div className="w-full not-pc:h-80 pc:min-h-[calc(100vh-22.5rem)] items-center justify-center text-center flex flex-col gap-2 pb-8">
							<Error
								width={42}
								height={42}
								className="mt-6 text-error"
							/>
							<div className="text-xl text-foreground-secondary">
								Nie udało się pobrać planu lekcji dla{" "}
								{query.name}
							</div>
						</div>
					)}
				</div>
			</div>
		</>
	);
}
