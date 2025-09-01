/// <reference types="vite-plugin-svgr/client" />

import NavbarButton from "./navbar-button";
import Dark from "@/assets/icons/style/dark.svg?react";
import Light from "@/assets/icons/style/light.svg?react";
import System from "@/assets/icons/style/system.svg?react";
import { useTheme, type Color, type Theme } from "../context/theme-provider";
import Dropdown from "../ui/dropdown/dropdown";
import Divider from "../ui/divider";
import Overlay from "../ui/overlay";
import DropdownProvider from "../ui/dropdown/dropdown-provider";
import { motion, stagger, type Variants } from "motion/react";

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
		<DropdownProvider>
			<Dropdown
				position="bottom-left"
				toggle={() => <Button />}
				backdrop={
					<Overlay
						visible
						className="z-4 bg-black/20 dark:bg-black/40 fixed top-0 left-0 w-full h-full"
					/>
				}
			>
				<motion.div
					variants={containerVariants}
					className="py-2 px-3 flex flex-col items-center gap-2 text-xl"
				>
					<motion.div variants={itemVariants} className="px-1">
						Ustawienia motywu
					</motion.div>
					<motion.ul
						variants={itemVariants}
						className="flex gap-1 justify-around w-full"
					>
						<ThemeItem theme="system">
							<System title="system" width={28} height={28} />
						</ThemeItem>
						<ThemeItem theme="dark">
							<Dark title="dark" width={28} height={28} />
						</ThemeItem>
						<ThemeItem theme="light">
							<Light title="light" width={28} height={28} />
						</ThemeItem>
					</motion.ul>
					<Divider style="tertiary" />
					<motion.ul
						variants={itemVariants}
						className="flex gap-0 justify-center w-full max-w-42 flex-wrap"
					>
						{colors.map((c) => (
							<ColorItem key={c} color={c} />
						))}
					</motion.ul>
				</motion.div>
			</Dropdown>
		</DropdownProvider>
	);
}

const containerVariants: Variants = {
	open: {
		transition: {
			delayChildren: stagger(0.1, { startDelay: 0.05 }),
		},
	},
	closed: {
		transition: {
			delay: 0.1,
			delayChildren: stagger(0.05, { from: "last" }),
		},
	},
};

const itemVariants: Variants = {
	open: {
		opacity: [0, 1],
		y: [6, 0],
		transition: {
			y: { duration: 0.1, ease: "easeOut" },
		},
	},
	closed: {
		opacity: 0,
		y: 6,
		transition: {
			y: { duration: 0.075, ease: "easeIn" },
		},
	},
};
