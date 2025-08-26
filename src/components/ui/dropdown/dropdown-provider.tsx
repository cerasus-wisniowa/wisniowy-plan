import { createContext, useContext, useState } from "react";

export type DropdownContextType = [boolean, (show: boolean) => void];

const DropdownContext = createContext<DropdownContextType | null>(null);

export default function DropdownProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const state = useState<boolean>(false);

	return (
		<DropdownContext.Provider value={state}>
			{children}
		</DropdownContext.Provider>
	);
}

export function useDropdown() {
	const dropdown = useContext(DropdownContext);
	if (!dropdown) {
		throw new Error("useDropdown must be used within a DropdownProvider");
	}

	return dropdown;
}
