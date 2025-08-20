import type { ChangeType } from "../../../lib/definitions/change";

export default function LessonElement({
	children,
	style,
}: {
	children: React.ReactNode;
	style?: ChangeType;
}) {
	const styles = {
		cancelled: "border-2 border-change-cancelled bg-change-cancelled-bg",
		no_consequence:
			"border-2 border-change-cancelled bg-change-cancelled-bg",
		substitution:
			"border-2 border-change-substitution bg-change-substitution-bg",
		moved: "border-2 border-change-moved bg-change-moved-bg",
	};

	return (
		<li
			className={
				"w-full h-28 bg-background p-2 pr-3 rounded-standard shadow-sm text-md flex gap-1 justify-between text-foreground-secondary " +
				(style && styles[style])
			}
		>
			{children}
		</li>
	);
}
