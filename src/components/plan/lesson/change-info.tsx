import { changeTypes, type Change } from "@/lib/definitions/change";
import { changeStyles } from "./plan-lesson-element";
import { cn } from "@/lib/util/classname";
import { Overlay } from "@restart/ui";
import { motion } from "motion/react";
import { useRef, useState } from "react";

import Note from "@/assets/icons/note.svg?react";

export default function ChangeInfo({ change }: { change?: Change }) {
	const noteRef = useRef<HTMLSpanElement>(null);

	const [showNote, setShowNote] = useState(false);

	let notes = change?.note;
	if (change?.generated) {
		if (notes) notes += "\n";
		notes += "(wygenerowano automatycznie)";
	}

	return change ? (
		<div
			className={cn(
				"ml-[-0.5rem] dark:text-background text-foreground font-medium pl-1 pr-2 rounded-r-full flex items-center select-none",
				changeStyles.labelBackground[change?.type],
				notes && "cursor-help"
			)}
			onMouseEnter={() => setShowNote(true)}
			onMouseLeave={() => setShowNote(false)}
		>
			<span>{changeTypes[change.type]} </span>
			{notes && (
				<>
					<span ref={noteRef} className="ml-1">
						<Note width={16} height={16} />
					</span>
					<Overlay
						show={showNote}
						target={noteRef}
						placement="right"
						rootClose
						offset={[0, 8]}
					>
						{(props, { arrowProps }) => (
							<motion.div
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{
									duration: 0.05,
								}}
								{...props}
								className="absolute"
							>
								<div
									{...arrowProps}
									style={arrowProps.style}
									className={cn(
										"absolute w-4 h-4 z-[-1]",
										"before:absolute before:rotate-45 before:bg-background before:top-0 before:left-0 before:w-3 before:h-3"
									)}
								/>
								<div className="py-1 px-2 text-sm rounded bg-background text-foreground-secondary max-w-56">
									{notes}
								</div>
							</motion.div>
						)}
					</Overlay>
				</>
			)}
		</div>
	) : (
		<div />
	);
}
