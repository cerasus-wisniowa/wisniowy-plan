/// <reference types="vite-plugin-svgr/client" />

import NavbarButton from "./navbar-button";
import Dark from "../../assets/icons/style/dark.svg?react";
import Light from "../../assets/icons/style/light.svg?react";
import System from "../../assets/icons/style/system.svg?react";
import { useTheme, type Color, type Theme } from "../context/theme-provider";
import Dropdown from "../ui/dropdown";
import Divider from "../ui/divider";
import Overlay from "../ui/overlay";

export default function ThemeButton() {
	const { theme, setTheme, color, setColor } = useTheme();

	const Button = () => (
		<NavbarButton>
			{theme === "dark" && <Dark />}
			{theme === "light" && <Light />}
			{theme === "system" && <System />}
		</NavbarButton>
	);

	const ThemeItem = ({
		children,
		theme: targetTheme,
	}: {
		children: React.ReactNode;
		theme: Theme;
	}) => (
		<li
			className={
				(targetTheme === theme && "text-theme") +
				" cursor-pointer hover:bg-background-tertiary rounded-full p-1.5"
			}
			onClick={() => setTheme(targetTheme)}
		>
			{children}
		</li>
	);

	const ColorItem = ({ color: targetColor }: { color: Color }) => {
		const style = {
			"cerasus-blue": "bg-cerasus-blue",
			cherry: "bg-cherry",
			yellow: "bg-yellow",
			orange: "bg-orange",
			green: "bg-green",
			purple: "bg-purple",
			red: "bg-red",
			sea: "bg-sea",
		};
		return (
			<li
				className="cursor-pointer hover:bg-background-tertiary rounded-full p-1.5"
				onClick={() => setColor(targetColor)}
			>
				<div
					className={
						(color === targetColor && "border-2") +
						" w-5 h-5 m-1 border-foreground rounded-full shadow-sm " +
						style[targetColor]
					}
				/>
			</li>
		);
	};

	const colors: Color[] = [
		"red",
		"orange",
		"yellow",
		"green",
		"sea",
		"cerasus-blue",
		"purple",
		"cherry",
	];

	return (
		<Dropdown
			placement="bottom-end"
			toggle={() => <Button />}
			backdrop={
				<Overlay
					visible
					className="z-4 bg-black/20 dark:bg-black/40 fixed top-0 left-0 w-full h-full"
				/>
			}
		>
			<div className="py-2 px-3 flex flex-col items-center gap-2 text-xl">
				<div className="px-1">Ustawienia motywu</div>
				<ul className="flex gap-1 justify-around w-full">
					<ThemeItem theme="system">
						<System title="system" width={28} height={28} />
					</ThemeItem>
					<ThemeItem theme="dark">
						<Dark title="dark" width={28} height={28} />
					</ThemeItem>
					<ThemeItem theme="light">
						<Light title="light" width={28} height={28} />
					</ThemeItem>
				</ul>
				<Divider style="tertiary" />
				<ul className="flex gap-0 justify-center w-full max-w-42 flex-wrap">
					{colors.map((c) => (
						<ColorItem key={c} color={c} />
					))}
				</ul>
			</div>
		</Dropdown>
	);
}
