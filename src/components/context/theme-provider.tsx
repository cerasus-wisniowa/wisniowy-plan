import { createContext, useContext, useEffect, useState } from "react";

export type Theme = "light" | "dark" | "system";
export type Color =
	| "cerasus-blue"
	| "cherry"
	| "yellow"
	| "orange"
	| "green"
	| "purple"
	| "red"
	| "sea";

export type ThemeContextType = {
	theme: Theme;
	color: Color;
	setTheme: (theme: Theme) => void;
	setColor: (accent: Color) => void;
};

const ThemeContext = createContext<ThemeContextType | null>(null);

export default function ThemeProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	let storedTheme = localStorage.getItem("theme") as Theme;
	if (!storedTheme) {
		localStorage.setItem("theme", "system");
		storedTheme = "system";
	}
	let storedColor = localStorage.getItem("color") as Color;
	if (!storedColor) {
		localStorage.setItem("color", "cherry");
		storedColor = "cherry";
	}
	const [theme, setTheme] = useState<Theme>(storedTheme);
	const [color, setColor] = useState<Color>(storedColor);

	const updateTheme = (theme: Theme) => {
		setTheme(theme);
		localStorage.setItem("theme", theme);
	};

	const updateColor = (color: Color) => {
		setColor(color);
		localStorage.setItem("color", color);
	};

	useEffect(() => {
		let selectedTheme = theme;
		if (theme === "system") {
			const isDark = window.matchMedia(
				"(prefers-color-scheme: dark)"
			).matches;
			selectedTheme = isDark ? "dark" : "light";
		}
		document.documentElement.setAttribute("data-theme", selectedTheme);
	}, [theme]);

	useEffect(() => {
		document.documentElement.setAttribute("data-color", color);
	}, [color]);

	return (
		<ThemeContext.Provider
			value={{
				theme,
				setTheme: updateTheme,
				color,
				setColor: updateColor,
			}}
		>
			{children}
		</ThemeContext.Provider>
	);
}

export function useTheme() {
	const theme = useContext(ThemeContext);
	if (!theme) {
		throw new Error("useTheme must be used within a ThemeProvider");
	}

	return theme;
}
