import { createContext, useContext, useEffect, useState } from "react";
import config from "../../data/config.json";
import type { ApiData } from "../../lib/definitions/api-data";

type ApiContextType = {
	api: ApiData | null;
	success: boolean;
	loading: boolean;
};

const ApiContext = createContext<ApiContextType | null>(null);

export default function ApiProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const [api, setApi] = useState<ApiData | null>(null);
	const [loading, setLoading] = useState(true);
	const [success, setSuccess] = useState<boolean>(false);

	useEffect(() => {
		if (api || loading) return;
		fetch(config.api + "/api")
			.then((res) => {
				if (!res.ok) {
					setLoading(false);
					return setSuccess(false);
				}

				res.json().then((data) => {
					setApi(data);
					setLoading(false);
					setSuccess(true);
				});
			})
			.catch((err) => {
				console.error("Error fetching API info:", err);
				setLoading(false);
				setSuccess(false);
			});
	});

	return (
		<ApiContext.Provider value={{ api, loading, success }}>
			{children}
		</ApiContext.Provider>
	);
}

export function useApi() {
	const api = useContext(ApiContext);
	if (!api) {
		throw new Error("useApi must be used within an ApiProvider");
	}

	return api;
}
