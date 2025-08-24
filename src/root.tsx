import {
	isRouteErrorResponse,
	Links,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
} from "react-router";

import "./index.css";
import Providers from "./components/context/providers";
import type { Route } from "./+types/root";
import Spinner from "./components/ui/spinner";
import Navbar from "./components/navbar/navbar";
import Footer from "./components/footer/footer";
import { deleteData, getStoreData, initDB, Stores } from "./lib/database/db";
import type { IndexedStoredPlan } from "./lib/definitions/db";

export const links: Route.LinksFunction = () => [
	{ rel: "icon", type: "image/png", href: "/icon.png" },
];

export function Layout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<head>
				<meta charSet="UTF-8" />
				<meta
					name="viewport"
					content="width=device-width, initial-scale=1.0"
				/>
				<Meta />
				<Links />
				<title>Wiśniowy Plan</title>
			</head>
			<body className="pc:overflow-y-hidden">
				{children}
				<ScrollRestoration />
				<Scripts />
			</body>
		</html>
	);
}

export async function clientLoader() {
	const theme = localStorage.getItem("theme") || "light";
	if (theme === "dark") {
		document.documentElement.setAttribute("data-theme", "dark");
	} else if (theme === "system") {
		const isDark = window.matchMedia(
			"(prefers-color-scheme: dark)"
		).matches;
		document.documentElement.setAttribute(
			"data-theme",
			isDark ? "dark" : "light"
		);
	}
	await initDB();

	// asynchronously remove plans older than 180 days
	getStoreData<IndexedStoredPlan>(Stores.Plans).then((data) =>
		data
			.filter(
				(plan) =>
					Date.now() - new Date(plan.lastUpdate).getTime() >
					1000 * 60 * 60 * 24 * 30 * 6
			)
			.forEach((plan) => {
				deleteData(Stores.Plans, plan.id);
			})
	);
}

export function HydrateFallback() {
	return (
		<div className="items-center content-center flex flex-col justify-center w-full h-screen m-auto text-foreground bg-background transition-300 transition-colors">
			<Spinner width={72} height={72} style="cherry" />
			<h1 className="text-3xl font-semibold">Wiśniowy Plan</h1>
			<p className="text-xl text-foreground-secondary">v{__VERSION__}</p>
		</div>
	);
}

export default function App() {
	return (
		<Providers>
			<div className="flex flex-col justify-between gap-2 h-screen pc:overflow-y-scroll bg-background">
				<div className="text-lg mx-1">
					<Navbar />
					<div className="mx-1 pc:mx-auto pc:w-[95%] p-4">
						<Outlet />
					</div>
				</div>
				<Footer />
			</div>
		</Providers>
	);
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
	let message = "Oops!";
	let details = "An unexpected error occurred.";
	let stack: string | undefined;

	if (isRouteErrorResponse(error)) {
		message = error.status === 404 ? "404" : "Error";
		details =
			error.status === 404
				? "The requested page could not be found."
				: error.statusText || details;
	} else if (import.meta.env.DEV && error && error instanceof Error) {
		details = error.message;
		stack = error.stack;
	}

	return (
		<main className="pt-16 p-4 container mx-auto">
			<h1>{message}</h1>
			<p>{details}</p>
			{stack && (
				<pre className="w-full p-4 overflow-x-auto">
					<code>{stack}</code>
				</pre>
			)}
		</main>
	);
}
