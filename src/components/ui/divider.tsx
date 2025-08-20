export type DividerStyle =
	| "primary"
	| "secondary"
	| "tertiary"
	| "accept"
	| "warning"
	| "info"
	| "deny"
	| "theme"
	| "footer";

export default function Divider({
	style = "primary",
	direction = "horizontal",
	className,
}: {
	style?: DividerStyle;
	direction?: "horizontal" | "vertical";
	className?: string;
}) {
	const styles = {
		color: {
			primary: "border-foreground-primary",
			secondary: "border-foreground-secondary",
			tertiary: "border-foreground-tertiary",
			accept: "border-accept",
			warning: "border-warning",
			info: "border-info",
			deny: "border-deny",
			theme: "border-theme",
			footer: "border-foreground-tertiary dark:border-white/20",
		},
		border: {
			horizontal: "border-b-1 w-full",
			vertical: "border-l-1 h-full",
		},
	};

	return (
		<div
			className={`${styles.border[direction]} ${styles.color[style]} ${className}`}
		></div>
	);
}
