import SpinnerIcon from "../../assets/icons/spinner.svg?react";

export type SpinnerStyle = "theme" | "regular" | "cherry";

export default function Spinner({
	style = "theme",
	className,
	width = 64,
	height = 64,
}: {
	style?: SpinnerStyle;
	className?: string;
	width?: number;
	height?: number;
}) {
	const styles = {
		theme: "text-theme",
		regular: "text-foreground",
		cherry: "text-cherry",
	};

	return (
		<SpinnerIcon
			className={`${styles[style]} ${className} animate-spin`}
			title={"loading"}
			width={width}
			height={height}
		/>
	);
}
