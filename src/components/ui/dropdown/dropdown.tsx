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
	backdrop?: React.ReactNode;
};

export default function Dropdown({
	children,
	toggle,
	position: pos,
	offset = [0, 0],
	backdrop,
}: DropdownProps) {
	const [show, setShow] = useState(false);
	const toggleRef = useRef<HTMLButtonElement>(null);
	const dropdownRef = useRef<HTMLDivElement>(null);

	const [position] = useState<DropdownPosition>(pos);

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

	const dropdownCommon = {
		x: [offset[0], xOffset, null],
		y: [offset[1] + yOffset, null],
		originX: [originX, null],
		originY: [originY, null],
	};

	const dropdownVariants: Variants = {
		open: {
			...dropdownCommon,
			scaleX: [0, 1, null, null],
			scaleY: [0.05, null, null, 1],
			transition: {
				duration: 0.3,
				times: [0, 0.3, 0.45, 1],
				ease: ["linear", "linear", "easeInOut", "easeInOut"],
				delayChildren: stagger(0.1, { startDelay: 0.2 }),
			},
		},
		closed: {
			...dropdownCommon,
			scaleX: [1, null, null, 0],
			scaleY: [1, 0.1, null, null],
			transition: {
				duration: 0.3,
				times: [0, 0.55, 0.7, 1],
				ease: ["easeInOut", "easeInOut", "linear", "linear"],
				delay: 0.25,
			},
		},
	};

	return (
		<div className={"flex flex-col " + style[pos]}>
			<Button
				ref={toggleRef}
				className="cursor-pointer"
				onClick={() => setShow(!show)}
			>
				{toggle(show)}
			</Button>
			<AnimatePresence>
				{show && (
					<>
						<motion.div
							ref={dropdownRef}
							variants={dropdownVariants}
							animate={"open"}
							exit={"closed"}
							className={
								"absolute px-2 py-1 bg-background-secondary rounded-standard z-350 shadow-md"
							}
						>
							<motion.div
								variants={contentVariants}
								className="w-full h-full"
							>
								{children}
							</motion.div>
						</motion.div>
						{backdrop && (
							<motion.div
								initial={{ opacity: 0 }}
								animate={{ opacity: 1, zIndex: 300 }}
								exit={{
									opacity: 0,
									transition: { delay: 0.45 },
								}}
								transition={{ duration: 0.2 }}
								onClick={() => setShow(false)}
							>
								{backdrop}
							</motion.div>
						)}
					</>
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
			duration: 0.2,
			ease: "easeInOut",
			delayChildren: stagger(0.05),
		},
	},
	closed: {
		opacity: [1, 0],
		y: 0,
		transition: {
			duration: 0.2,
			delay: 0.15,
			ease: "easeInOut",
			delayChildren: stagger(0.05, { from: "last" }),
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
