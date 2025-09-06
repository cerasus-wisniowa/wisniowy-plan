import { createContext, useContext, useState } from "react";

type StatusContextType = [
	text: string | null,
	setText: React.Dispatch<React.SetStateAction<string | null>>,
];

const StatusContext = createContext<StatusContextType | null>(null);

export default function StatusProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const hook = useState<string | null>(null);

	return (
		<StatusContext.Provider value={hook}>{children}</StatusContext.Provider>
	);
}

export function useStatus() {
	const status = useContext(StatusContext);
	if (!status) {
		throw new Error("useStatus must be used within an ApiProvider");
	}

	return status;
}
