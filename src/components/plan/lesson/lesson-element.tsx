import { cn } from "@/lib/util/classname";
import type { ChangeType } from "../../../lib/definitions/change";

export const lessonHeight = "h-[6.5rem]";

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
			className={cn(
				"w-full bg-background p-2 pr-3 rounded-xl shadow-sm text-md flex flex-col gap-0.5 text-foreground-secondary",
				style && styles[style],
				lessonHeight
			)}
		>
			{children}
		</li>
	);
}
