import { Link } from "react-router";
import Divider from "../ui/divider";
import NavbarButton from "./navbar-button";
import ThemeButton from "./theme-button";

export default function Navbar() {
	return (
		<div className="sticky top-0 z-1">
			<div className="flex justify-between w-full p-2 h-18 bg-background">
				<Link className="self-center flex gap-3 select-none" to="/">
					<img src="/icon.png" alt="logo" width={42} height={42} />
					<div className="text-2xl self-center font-semibold">
						Wiśniowy Plan
					</div>
				</Link>
				<div className="self-center">
					<NavbarButton>
						<ThemeButton />
					</NavbarButton>
				</div>
			</div>
			<div className="self-center mx-2">
				<Divider style="tertiary" />
			</div>
		</div>
	);
}
