import { Link, redirect } from "react-router";

export async function clientLoader() {
	return redirect(`/plan`);
}

export default function Home() {
	return (
		<div className="m-auto text-center content-center h-[calc(100vh-13rem)]">
			<img
				src="/icon.png"
				className="m-auto"
				alt={"logo"}
				width={96}
				height={96}
			/>
			<p className="text-4xl/normal my-2 font-medium">Wiśniowy Plan</p>
			<Link
				to={"/plan"}
				className="text-2xl/normal text-foreground-secondary hover:text-theme"
			>
				przejdź do planu lekcji
			</Link>
		</div>
	);
}
