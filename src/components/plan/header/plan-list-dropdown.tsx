import Dropdown from "../../ui/dropdown";
import Arrow from "../../../assets/icons/navigation/next.svg?react";
import { Fragment, useEffect, useState } from "react";
import { usePlanList } from "../../context/plan-list-provider";
import type { PlanType } from "../../../lib/definitions/plan";
import { useParams } from "react-router";
import Divider from "../../ui/divider";
import { getPlanName } from "../../../lib/util/plan-name";
import useWindowDimensions, { pcWidth } from "../../hook/use-window-dimensions";
import Overlay from "../../ui/overlay";
import PlanListItem from "./plan-list-item";
import { useFavourites } from "../../context/favourites-provider";
import Error from "../../../assets/icons/error.svg?react";
import Spinner from "../../ui/spinner";
import { motion } from "motion/react";

export default function PlanListDropdown() {
	const [query, setQuery] = useState<string>();
	const { planList, error, loading } = usePlanList();
	const { width } = useWindowDimensions();

	const { favourites } = useFavourites();
	const [favs, setFavs] = useState([] as (FlatPlan | undefined)[]);

	const { name } = useParams();

	useEffect(() => {
		setFavs(
			favourites.map(
				(fav) =>
					planList && {
						type: fav.type,
						value: fav.name,
						name: getPlanName(fav.name, fav.type, planList),
					}
			)
		);
	}, [favourites, planList]);

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
	const filteredFavs = favs.filter(filter);

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
		<Dropdown
			placement={width < pcWidth ? "bottom" : undefined}
			toggle={(show) => <Toggle show={show} />}
			className="mx-2"
			backdrop={
				<Overlay
					visible
					className="z-4 bg-black/20 dark:bg-black/40 fixed top-0 left-0 w-full h-full"
				/>
			}
		>
			<div className="p-1 flex flex-col gap-2">
				<input
					className="py-1 px-2 bg-background rounded-xl"
					placeholder="wyszukaj"
					onChange={(e) => setQuery(e.target.value)}
					autoFocus
				/>
				<ul className="flex flex-col gap-1 overflow-y-auto max-h-[calc(100vh-18rem)]">
					{!loading && !error && filteredFavs.length > 0 && (
						<>
							<li className="text-md font-semibold px-1">
								ULUBIONE
							</li>
							{filteredFavs.map(
								(plan, i) =>
									plan && (
										<PlanListItem
											key={"F" + i}
											type={plan.type}
											value={plan.value}
											name={plan.name}
										/>
									)
							)}
						</>
					)}
					{!loading &&
						!error &&
						filtered.map((list, i) => (
							<Fragment key={i}>
								{list[0] && (
									<>
										<li className="first:hidden pr-2 py-1">
											<Divider style="theme" />
										</li>
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
									/>
								))}
							</Fragment>
						))}
				</ul>
			</div>
		</Dropdown>
	);
}
