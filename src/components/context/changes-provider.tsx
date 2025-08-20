import { createContext, useContext, useEffect, useState } from "react";
import type { Changes } from "../../lib/definitions/changes";
import { fetchChanges } from "../../lib/fetch/changes";

export type ChangesContextType = {
	changes?: Changes;
	loading: boolean;
	error: Error | null;
	updateChanges: () => void;
};

const ChangesContext = createContext<ChangesContextType | null>(null);

export default function ChangesProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const [changes, setChanges] = useState<Changes>();
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<Error | null>(null);

	const updateChanges = () => {
		setLoading(true);
	};

	useEffect(() => {
		if (!loading) return;
		fetchChanges().then((changes) => {
			if (changes) {
				setChanges(changes);
				setLoading(false);
			} else {
				setError(new Error("Failed to fetch changes"));
				setLoading(false);
			}
		});
	}, [loading]);

	return (
		<ChangesContext.Provider
			value={{
				changes,
				error,
				loading,
				updateChanges,
			}}
		>
			{children}
		</ChangesContext.Provider>
	);
}

export function useChanges() {
	const changes = useContext(ChangesContext);
	if (!changes) {
		throw new Error("useChanges must be used within a ChangesProvider");
	}

	return changes;
}
