import Dropdown from "@/components/ui/dropdown/dropdown";
import Arrow from "@/assets/icons/navigation/next.svg?react";
import { useEffect, useState } from "react";
import { usePlanList } from "@/components/context/plan-list-provider";
import type { PlanType } from "@/lib/definitions/plan";
import { useParams } from "react-router";
import Divider from "@/components/ui/divider";
import { getPlanName, isPlanOnList } from "@/lib/util/plan-list-utils";
import Overlay from "@/components/ui/overlay";
import PlanListItem from "./plan-list-item";
import Error from "@/assets/icons/error.svg?react";
import Spinner from "@/components/ui/spinner";
import { motion, stagger, type Variants } from "motion/react";
import type { FavoritePlan, RawFavoritePlan } from "@/lib/definitions/favorite";
import { addFavorite, removeFavorite } from "@/lib/database/favorites";
import type { PlanList } from "@/lib/definitions/plan-list";
import DropdownProvider from "@/components/ui/dropdown/dropdown-provider";

export default function PlanListDropdown({
	rawFavorites,
	storedPlansList,
}: {
	rawFavorites: RawFavoritePlan[];
	storedPlansList: PlanList;
}) {
	const [query, setQuery] = useState<string>();
	const { planList, error, loading } = usePlanList();

	const [favorites, setFavorites] = useState<FavoritePlan[] | null>(null);
	const { name } = useParams();

	useEffect(() => {
		if (favorites || !planList) return;
		const favs: FavoritePlan[] = [];
		for (const raw of rawFavorites) {
			if (!isPlanOnList(raw.value, raw.type, planList || storedPlansList))
				continue;
			const name: string | undefined = getPlanName(
				raw.value,
				raw.type,
				planList || storedPlansList
			);
			favs.push({ ...raw, name });
		}
		setFavorites(favs);
	}, [favorites, rawFavorites, planList, storedPlansList]);

	const isFavorite = (plan: FavoritePlan) =>
		favorites?.some(
			(f) => f.value === plan.value && f.type === plan.type
		) ?? false;

	const setFavorite = (plan: FavoritePlan) => {
		if (!favorites) return;
		if (isFavorite(plan)) {
			setFavorites(
				favorites.filter(
					(f) => f.value !== plan.value || f.type !== plan.type
				)
			);
			removeFavorite(plan);
		} else {
			setFavorites([...favorites, plan]);
			addFavorite(plan);
		}
	};

	if (loading) {
		return (
			<div className="rounded-standard bg-background flex py-2 px-3 text-foreground-secondary duration-100 shadow-sm">
				<Spinner width={24} height={24} />
			</div>
		);
	}

	if (error) {
		return (
			<div className="rounded-standard bg-background flex gap-2 p-2 pr-3 text-error items-center duration-100 shadow-sm">
				<Error />
				<span>błąd</span>
			</div>
		);
	}

	type FlatPlan = {
		type: PlanType;
		value: string;
		name: string;
	};

	let classes =
		planList?.class.map((c) => ({
			type: "class" as PlanType,
			value: c,
			name: getPlanName(c, "class", planList),
		})) || [];
	let classrooms =
		planList?.classroom.map((r) => ({
			type: "classroom" as PlanType,
			value: r.room,
			name: getPlanName(r.room, "classroom", planList),
		})) || [];
	let teachers =
		planList?.teacher.map((t) => ({
			type: "teacher" as PlanType,
			value: t.initials!,
			name: getPlanName(t.initials || "", "teacher", planList),
		})) || [];

	const filter = (planList: FlatPlan | undefined) =>
		!query || planList?.name.toLowerCase().includes(query.toLowerCase());

	classes = classes.filter(filter);
	teachers = teachers.filter(filter);
	classrooms = classrooms.filter(filter);

	const names = {
		class: "ODDZIAŁY",
		teacher: "NAUCZYCIELE",
		classroom: "SALE",
	};

	const filtered = [classes, teachers, classrooms];
	const filteredFavs = favorites
		?.filter(filter)
		.sort((a, b) => a.name.localeCompare(b.name));

	const favouriteMap = (plan: FavoritePlan, i: number) =>
		plan && (
			<PlanListItem
				key={i}
				type={plan.type}
				value={plan.value}
				name={plan.name}
				isFavorite={isFavorite(plan)}
				setFavorite={setFavorite}
			/>
		);

	const Toggle = ({ show }: { show: boolean }) => (
		<div
			onClick={() => setQuery(undefined)}
			className="rounded-standard bg-background flex gap-2 p-2 pl-3 text-foreground-secondary hover:bg-black/15 dark:hover:bg-white/20 duration-100 shadow-sm"
		>
			<div>{name}</div>
			<motion.div
				animate={{ rotate: show ? 90 : 0 }}
				transition={{
					duration: 0.2,
					ease: "easeInOut",
				}}
				initial={false}
			>
				<Arrow width={28} height={28} />
			</motion.div>
		</div>
	);

	return (
		<DropdownProvider>
			<Dropdown
				position="bottom-right"
				toggle={(show) => <Toggle show={show} />}
				backdrop={
					<Overlay
						visible
						className="z-4 bg-black/20 dark:bg-black/40 fixed top-0 left-0 w-full h-full"
					/>
				}
				hideDelay={0.25}
				disableScroll
				className="px-2 py-1"
			>
				<motion.div
					className="bg-background rounded-xl"
					variants={inputVariants}
				>
					<motion.input
						variants={variants}
						className="py-1 px-2 w-full rounded-xl"
						placeholder="wyszukaj"
						onChange={(e) => setQuery(e.target.value)}
						autoFocus
					/>
				</motion.div>
				<ul className="flex flex-col gap-1 overflow-y-auto max-h-[calc(100vh-18rem)] mt-2">
					{!loading && !error && filteredFavs && (
						<motion.div
							variants={variants}
							className={filteredFavs.length > 0 ? "" : "hidden"}
						>
							<li className="text-md font-semibold px-1">
								ULUBIONE
							</li>
							{filteredFavs
								.filter((f) => f.type === "class")
								.map(favouriteMap)}
							{filteredFavs
								.filter((f) => f.type === "teacher")
								.map(favouriteMap)}
							{filteredFavs
								.filter((f) => f.type === "classroom")
								.map(favouriteMap)}
						</motion.div>
					)}
					{!loading &&
						!error &&
						filtered.map((list, i) => (
							<motion.div key={i} variants={variants}>
								{list[0] &&
									((filteredFavs &&
										filteredFavs.length > 0) ||
										i > 0) && (
										<li className="pr-2 py-1">
											<Divider style="theme" />
										</li>
									)}

								{list[0] && (
									<>
										<li className="text-md font-semibold px-1">
											{names[list[0].type]}
										</li>
									</>
								)}
								{list.map((plan, j) => (
									<PlanListItem
										key={i + "/" + j}
										type={plan.type}
										value={plan.value}
										name={plan.name}
										isFavorite={isFavorite(plan)}
										setFavorite={setFavorite}
									/>
								))}
							</motion.div>
						))}
				</ul>
			</Dropdown>
		</DropdownProvider>
	);
}

const variants: Variants = {
	open: {
		opacity: [0, 1],
		transition: {
			duration: 0.2,
		},
	},
	closed: {
		opacity: 0,
		transition: {
			duration: 0.15,
		},
	},
};

const inputVariants: Variants = {
	open: {
		scaleX: [0, 1],
		originX: 0,
		transition: {
			duration: 0.1,
			ease: "easeInOut",
			delay: 0.1,
			delayChildren: stagger(undefined, { startDelay: 0.1 }),
		},
	},
	closed: {
		scaleX: 0,
		originX: 0,
		transition: {
			duration: 0.08,
			ease: "easeInOut",
			delay: 0.2,
		},
	},
};
