import SpinnerIcon from "../../assets/icons/spinner.svg?react";

const styles = {
	theme: "text-theme",
	regular: "text-foreground",
	cherry: "text-cherry",
	warning: "text-warning",
	deny: "text-deny",
	info: "text-info",
	accept: "text-accept",
};

export type SpinnerStyle = keyof typeof styles;

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
	return (
		<SpinnerIcon
			className={`${styles[style]} ${className} animate-spin`}
			title={"loading"}
			width={width}
			height={height}
		/>
	);
}
