import { createContext, useContext, useState } from "react";
import type { PlanType } from "../../lib/definitions/plan";

export type Favourites = {
	type: PlanType;
	name: string;
}[];

export type FavouritesContextType = {
	favourites: Favourites;
	addFavourite: (type: PlanType, name: string) => void;
	removeFavourite: (type: PlanType, name: string) => void;
};

function getFavourites() {
	const favs = localStorage.getItem("favourites");
	if (!favs) {
		localStorage.setItem("favourites", "[]");
		return [];
	}
	return JSON.parse(favs) as Favourites;
}

const FavouritesContext = createContext<FavouritesContextType | null>(null);

export default function PlanListProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const [favourites, setFavourites] = useState(getFavourites());

	function addFavourite(type: PlanType, name: string) {
		const favs = getFavourites();
		if (favs.find((f) => f.type === type && f.name === name)) return;
		favs.push({ type, name });
		localStorage.setItem("favourites", JSON.stringify(favs));
		setFavourites(favs);
	}

	function removeFavourite(type: PlanType, name: string) {
		const favs = getFavourites();
		const filteredFavs = favs.filter(
			(f) => f.type !== type || f.name !== name
		);
		localStorage.setItem("favourites", JSON.stringify(filteredFavs));
		setFavourites(filteredFavs);
	}

	return (
		<FavouritesContext.Provider
			value={{
				favourites,
				addFavourite,
				removeFavourite,
			}}
		>
			{children}
		</FavouritesContext.Provider>
	);
}

export function useFavourites() {
	const favourites = useContext(FavouritesContext);
	if (!favourites) {
		throw new Error(
			"useFavourites must be used within a FavouritesProvider"
		);
	}

	return favourites;
}
