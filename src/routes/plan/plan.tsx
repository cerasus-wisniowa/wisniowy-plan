import { Suspense, useEffect, useState } from "react";
import PlanTable from "../../components/plan/plan-table";
import { type PlanFilters } from "../../components/plan/header/filters/filters";
import WeekNavigationButton from "../../components/plan/nav/week-navigation-button";
import Divider from "../../components/ui/divider";
import { fetchPlan } from "../../lib/fetch/plan";
import type { Plan, PlanType } from "../../lib/definitions/plan";
import { useWeek } from "../../components/context/week-provider";
import { getMonthsSpanString } from "../../lib/definitions/date";
import { replace, type ClientLoaderFunctionArgs } from "react-router";
import PlanListDropdown from "../../components/plan/header/plan-list-dropdown";
import { getPlanName } from "../../lib/util/plan-name";
import { usePlanList } from "../../components/context/plan-list-provider";
import Delete from "../../assets/icons/delete.svg?react";
import Tune from "../../assets/icons/tune.svg?react";
import { Button, Modal } from "@restart/ui";
import useWindowDimensions, {
	pcWidth,
} from "../../components/hook/use-window-dimensions";
import { useChanges } from "../../components/context/changes-provider";

import Error from "../../assets/icons/error.svg?react";
import MobileWeekNavigation from "../../components/plan/nav/mobile-week-navigation";
import Filters from "../../components/plan/header/filters/filters";
import PlanTableLoading from "../../components/plan/loading/plan-table-loading";
import type { Route } from "./+types/plan";
import { motion } from "motion/react";
import Spinner from "../../components/ui/spinner";

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

	return query;
}

export default function PlanRoute({ loaderData }: Route.ComponentProps) {
	const { loading: changesLoading, error: changesError } = useChanges();
	const query = loaderData;

	const { width } = useWindowDimensions();

	const [plan, setPlan] = useState<Plan | null>(null);
	const [found, setFound] = useState<boolean | null>(null);
	const { planList } = usePlanList();

	const { week } = useWeek();

	const storedFilters = localStorage.getItem("filters");
	const parsedFilters = storedFilters ? JSON.parse(storedFilters) : {};

	const [filters, setFilters] = useState<PlanFilters>(parsedFilters);

	const [mobileFilters, setMobileFilters] = useState(false);

	useEffect(() => {
		setFound(null);
		fetchPlan(query.type, query.name).then((data) => {
			if (!data) {
				setFound(false);
				return;
			}
			setFound(true);
			setPlan(data);
		});
	}, [query.name, query.type]);

	useEffect(() => {
		localStorage.setItem("filters", JSON.stringify(filters));
	}, [filters]);

	const hasFilters =
		plan?.type === "class" &&
		plan?.lessons.some((l) => l.type !== "regular");

	const ResetFilters = ({ className }: { className?: string }) => (
		<Button
			onClick={() =>
				setFilters((prev) => ({
					...prev,
					[query.name]: {},
				}))
			}
			className={
				"flex bg-background hover:text-foreground text-deny hover:bg-deny cursor-pointer p-1.5 shadow-sm duration-100 w-fit h-fit " +
				className
			}
		>
			<Delete width={28} height={28} className="mx-auto" />
		</Button>
	);

	return (
		<>
			{width < pcWidth && (
				<Modal
					show={mobileFilters && hasFilters}
					onHide={() => setMobileFilters(false)}
					renderBackdrop={(props) => (
						<motion.div
							{...props}
							initial={{
								opacity: 0,
							}}
							animate={{
								opacity: 1,
							}}
							transition={{
								duration: 0.2,
							}}
							className="fixed inset-0 bg-black/40 z-300"
						/>
					)}
					autoFocus={false}
					className="flex-col justify-center align-middle items-center w-screen h-screen text-center z-50"
				>
					<motion.div
						initial={{
							scale: 0.8,
							opacity: 0,
						}}
						animate={{
							scale: 1,
							opacity: 1,
						}}
						transition={{
							type: "spring",
							damping: 30,
							stiffness: 500,
							ease: "easeOut",
						}}
						className="fixed z-301 top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2 bg-background-secondary rounded-standard shadow-lg py-6 px-8 max-w-full"
					>
						<h2 className="text-2xl font-medium">
							Ustawienia wyświetlania dla{" "}
							<span className="font-semibold text-theme">
								{planList &&
									getPlanName(
										query.name,
										query.type,
										planList
									)}
							</span>
						</h2>
						<div className="flex flex-col gap-4 mt-5 overflow-y-auto items-start">
							<Filters
								filters={filters}
								setFilters={setFilters}
								plan={plan!}
							/>
						</div>
						<div className="flex gap-2 mt-4 h-12 justify-center mr-12">
							<ResetFilters className="items-center w-12 rounded-standard self-center" />
							<Button
								onClick={() => setMobileFilters(false)}
								className="bg-background rounded-standard w-28 hover:bg-theme hover:text-foreground text-theme duration-100 cursor-pointer"
							>
								Zamknij
							</Button>
						</div>
					</motion.div>
				</Modal>
			)}
			<div className="flex flex-col gap-2">
				<div className="flex gap-4 justify-between">
					<div className="flex gap-4 not-pc:justify-between w-full">
						<PlanListDropdown />
						{width >= pcWidth && hasFilters && (
							<div className="flex gap-4 not-pc:hidden">
								{found && (
									<div className="flex gap-x-6 gap-y-1 self-center flex-wrap">
										<Filters
											filters={filters}
											setFilters={setFilters}
											plan={plan}
										/>
									</div>
								)}
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
					{width >= pcWidth && plan?.type === "class" && (
						<ResetFilters className="rounded-xl" />
					)}
				</div>
				{width >= pcWidth ? (
					<div className="flex justify-between w-full not-pc:hidden">
						<div className="text-foreground-secondary text-xl self-end flex gap-2 items-end">
							<span className="font-medium">
								{planList &&
									getPlanName(
										query.name,
										query.type,
										planList
									)}
							</span>
							<span className="text-md text-foreground-tertiary mb-0.5">
								{plan &&
									plan.source !== "planlekcji" &&
									`(${plan.source})`}
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

				{changesLoading && (
					<div className="flex gap-2 text-warning items-center not-pc:self-center">
						<Spinner width={24} height={24} style="warning" />
						<div>Trwa ładowanie zastępstw...</div>
					</div>
				)}
				{changesError && (
					<div className="flex gap-2 text-error items-center not-pc:self-center">
						<Error />
						<div>Wystąpił błąd podczas ładowania zastępstw</div>
					</div>
				)}
				{width >= pcWidth && <Divider style="theme" />}
				<Suspense fallback={<PlanTableLoading planName={query.name} />}>
					<div className="">
						{plan && found ? (
							<PlanTable plan={plan} filters={filters} />
						) : found === null ? (
							<PlanTableLoading planName={query.name} />
						) : (
							<div className="w-full min-h-96 items-center justify-center flex flex-col gap-2 py-8">
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
				</Suspense>
			</div>
		</>
	);
}
