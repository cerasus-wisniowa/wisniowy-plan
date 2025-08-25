import { Button } from "@restart/ui";
import { AnimatePresence, motion, stagger, type Variants } from "motion/react";
import type React from "react";
import { useEffect, useRef, useState } from "react";

type DropdownPosition =
	| "top"
	| "top-right"
	| "right"
	| "bottom-right"
	| "bottom"
	| "bottom-left"
	| "left"
	| "top-left";

type DropdownProps = {
	children: React.ReactNode;
	toggle: (show: boolean) => React.ReactNode;
	position: DropdownPosition;
	offset?: [number, number];
};

export default function Dropdown({
	children,
	toggle,
	position: pos,
	offset = [0, 0],
}: DropdownProps) {
	const [show, setShow] = useState(false);
	const toggleRef = useRef<HTMLButtonElement>(null);
	const dropdownRef = useRef<HTMLDivElement>(null);

	const [position, setPosition] = useState<DropdownPosition>(pos);

	const [xOffset, setXOffset] = useState<number>(0);
	const [yOffset, setYOffset] = useState<number>(0);

	const isBottom = position.includes("bottom");
	const isTop = position.includes("top");
	const isLeft = position.includes("left");
	const isRight = position.includes("right");

	useEffect(() => {
		if (!toggleRef.current) return;
		const xMultiplier =
			position === "left" ? -1 : position === "right" ? 1 : 0;
		const yMultiplier = isTop ? -1 : isBottom ? 1 : 0;

		setXOffset(xMultiplier * toggleRef.current.offsetWidth);
		setYOffset(yMultiplier * toggleRef.current.offsetHeight);
	}, [isBottom, isLeft, isRight, isTop, position, toggleRef]);

	const originX = isLeft ? 1 : isRight ? 0 : 0.5;
	const originY = isTop ? 1 : isBottom ? 0 : 0.5;

	const dropdownVariants: Variants = {
		open: {
			scale: [0, 1],
			// scaleX: [0, 1, 1, 1],
			// scaleY: [0.1, 0.1, 0.1, 1],
			x: [offset[0], xOffset, null],
			y: [offset[1] + yOffset, null],
			originX: [originX, null],
			originY: [originY, null],
			transition: {
				duration: 1,
				// duration: 0.25,
				// times: [0, 0.3, 0.45, 1],
				// ease: ["linear", "linear", "easeInOut", "easeInOut"],
				delayChildren: stagger(0.1, { startDelay: 1 }),
			},
		},
	};

	return (
		<div className={"flex flex-col " + style[pos]}>
			{
				<Button
					ref={toggleRef}
					className="cursor-pointer"
					onClick={() => setShow(!show)}
				>
					{toggle(show)}
				</Button>
			}
			<AnimatePresence>
				{show && (
					<motion.div
						ref={dropdownRef}
						variants={dropdownVariants}
						animate={"open"}
						className={"absolute bg-background-secondary"}
					>
						<motion.div variants={contentVariants}>
							{children}
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}

const contentVariants: Variants = {
	open: {
		opacity: [0, 1],
		y: 0,
		transition: {
			y: { stiffness: 1000, velocity: -100 },
			ease: "easeInOut",
			delayChildren: stagger(0.05),
		},
	},
};

const style = {
	top: "flex-col-reverse items-center",
	bottom: "flex-col items-center",
	left: "flex-row-reverse items-center",
	right: "flex-row items-center",
	"top-right": "flex-col-reverse items-start",
	"top-left": "flex-col-reverse items-end",
	"bottom-right": "flex-col items-start",
	"bottom-left": "flex-col items-end",
};
