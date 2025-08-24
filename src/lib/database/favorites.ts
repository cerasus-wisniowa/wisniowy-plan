import type {
	RawFavoritePlan,
	StoredFavoritePlan,
} from "../definitions/favorite";
import { addData, deleteData, getStoreData, Stores, updateData } from "./db";

const id = ({ type, value }: RawFavoritePlan) => type + "_" + value;

export async function addFavorite(favorite: RawFavoritePlan) {
	try {
		if (
			!(await updateData<StoredFavoritePlan>(
				Stores.Favorites,
				id(favorite),
				{ ...favorite, id: id(favorite) }
			))
		) {
			await addData<StoredFavoritePlan>(Stores.Favorites, {
				...favorite,
				id: id(favorite),
			});
		}
	} catch (error) {
		console.error(error);
	}
}

export async function removeFavorite(favorite: RawFavoritePlan) {
	try {
		await deleteData(Stores.Favorites, id(favorite));
	} catch (error) {
		console.error(error);
	}
}

export async function getFavorites() {
	try {
		const favorites = await getStoreData<StoredFavoritePlan>(
			Stores.Favorites
		);
		return favorites;
	} catch (error) {
		console.error(error);
		return [] as StoredFavoritePlan[];
	}
}
