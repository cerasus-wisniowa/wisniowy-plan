import Dropdown from "@restart/ui/Dropdown";
import Star from "../../../assets/icons/star.svg?react";
import StarBorder from "../../../assets/icons/star-border.svg?react";
import type { PlanType } from "../../../lib/definitions/plan";
import { useFavourites } from "../../context/favourites-provider";
import useWindowDimensions, { pcWidth } from "../../hook/use-window-dimensions";
import { useState } from "react";
import PlanLink from "../plan-link";

export default function PlanListItem({
	type,
	value,
	name,
}: {
	type: PlanType;
	value: string;
	name: string;
}) {
	const { favourites, addFavourite, removeFavourite } = useFavourites();
	const { width } = useWindowDimensions();
	const isFavourite = favourites.find(
		(f) => f.type === type && f.name === value
	);

	const [showButton, setShowButton] = useState(false);

	const handleFavourite = () => {
		if (isFavourite) {
			removeFavourite(type, value);
		} else {
			addFavourite(type, value);
		}
	};

	return (
		<li
			className="flex justify-between hover:bg-foreground/5 rounded-md duration-100"
			onMouseEnter={() => setShowButton(true)}
			onMouseLeave={() => setShowButton(false)}
		>
			<Dropdown.Item className="w-full hover:text-theme duration-100 text-md">
				<PlanLink
					type={type}
					name={value}
					className="w-full px-1 h-full flex text-start"
				>
					{name}
				</PlanLink>
			</Dropdown.Item>
			{width < pcWidth && (
				<button
					onClick={handleFavourite}
					className={`${
						isFavourite
							? "text-foreground/50"
							: "text-foreground-secondary/30"
					} cursor-pointer hover:text-theme duration-100 px-1`}
				>
					{isFavourite ? <Star /> : <StarBorder />}
				</button>
			)}
			{width >= pcWidth && (
				<button
					onClick={handleFavourite}
					className={`${
						isFavourite
							? "text-foreground/50"
							: "text-foreground-secondary/30"
					} cursor-pointer hover:text-theme pr-1 ${
						showButton || isFavourite ? "" : "hidden"
					}`}
				>
					{isFavourite ? <Star /> : <StarBorder />}
				</button>
			)}
		</li>
	);
}
