import Star from "../../../assets/icons/star.svg?react";
import StarBorder from "../../../assets/icons/star-border.svg?react";
import type { PlanType } from "../../../lib/definitions/plan";
import useWindowDimensions, { pcWidth } from "../../hook/use-window-dimensions";
import { useState } from "react";
import PlanLink from "../plan-link";
import type { FavoritePlan } from "@/lib/definitions/favorite";
import DropdownItem from "@/components/ui/dropdown/dropdown-item";

export default function PlanListItem({
	type,
	value,
	name,
	isFavorite,
	setFavorite,
}: {
	type: PlanType;
	value: string;
	name: string;
	isFavorite: boolean;
	setFavorite: (plan: FavoritePlan) => void;
}) {
	const { width } = useWindowDimensions();

	const [showButton, setShowButton] = useState(false);

	const handleFavourite = () => {
		setFavorite({ type, name, value });
	};

	return (
		<li
			className="flex justify-between hover:bg-foreground/5 rounded-md duration-100"
			onMouseEnter={() => setShowButton(true)}
			onMouseLeave={() => setShowButton(false)}
		>
			<DropdownItem className="w-full hover:text-theme duration-100 text-md">
				<PlanLink
					type={type}
					name={value}
					className="w-full px-1 h-full flex text-start"
				>
					{name}
				</PlanLink>
			</DropdownItem>
			{width < pcWidth && (
				<button
					onClick={handleFavourite}
					className={`${
						isFavorite
							? "text-foreground/50"
							: "text-foreground-secondary/30"
					} cursor-pointer hover:text-theme duration-100 px-1`}
				>
					{isFavorite ? <Star /> : <StarBorder />}
				</button>
			)}
			{width >= pcWidth && (
				<button
					onClick={handleFavourite}
					className={`${
						isFavorite
							? "text-foreground/50"
							: "text-foreground-secondary/30"
					} cursor-pointer hover:text-theme pr-1 ${
						showButton || isFavorite ? "" : "hidden"
					}`}
				>
					{isFavorite ? <Star /> : <StarBorder />}
				</button>
			)}
		</li>
	);
}
