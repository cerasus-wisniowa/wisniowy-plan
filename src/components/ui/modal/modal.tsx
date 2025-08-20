import { Modal as RestartModal, Button } from "@restart/ui";
import { motion, stagger, type Variants } from "motion/react";
import type React from "react";
import { useRef } from "react";

type ModalParams = {
	show: boolean;
	onHide: () => void;
	backdrop?: boolean;
	children: React.ReactNode;
	title?: React.ReactNode | string;
	closeButton?: boolean;
	className?: string;
};

export default function Modal({
	show,
	onHide,
	backdrop,
	children,
	title,
	className,
	closeButton,
}: ModalParams) {
	return (
		<RestartModal
			show={show}
			onHide={onHide}
			renderBackdrop={
				backdrop
					? (props) => (
							<motion.div
								{...props}
								initial={{
									opacity: 0,
								}}
								animate={{
									opacity: 1,
								}}
								transition={{
									duration: 0.2,
								}}
								className="fixed inset-0 bg-black/40 z-300"
							/>
						)
					: undefined
			}
			autoFocus={false}
			enforceFocus={false}
			className="flex-col justify-center align-middle items-center w-screen h-screen text-center z-50"
		>
			<motion.div
				animate={"open"}
				variants={modalVariants}
				className={
					"fixed z-301 top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2 bg-background-secondary rounded-standard shadow-lg pt-6 pb-3 px-6 " +
					className
				}
			>
				{title && (
					<motion.h2
						variants={itemVariants}
						initial={itemInitial}
						className="text-2xl font-medium"
					>
						{title}
					</motion.h2>
				)}
				<motion.div
					variants={itemVariants}
					className="flex flex-col gap-4 mt-2 overflow-y-auto max-h-[70vh]"
				>
					{children}
				</motion.div>
				{closeButton && (
					<motion.div
						variants={itemVariants}
						initial={itemInitial}
						className="flex gap-2 mt-4 h-12 justify-center mr-12"
					>
						<Button
							onClick={onHide}
							className="bg-background rounded-standard w-28 hover:bg-theme hover:text-foreground text-theme duration-100 cursor-pointer"
						>
							Zamknij
						</Button>
					</motion.div>
				)}
			</motion.div>
		</RestartModal>
	);
}

const modalVariants: Variants = {
	open: {
		scaleX: [0, 1, 1],
		scaleY: [0.1, 0.1, 1],
		transition: {
			duration: 0.35,
			ease: "easeInOut",
			delayChildren: stagger(0.15, { startDelay: 0.35 }),
		},
	},
};

const itemVariants: Variants = {
	open: {
		opacity: 1,
		y: 0,
		transition: {
			y: { stiffness: 1000, velocity: -100 },
			ease: "easeInOut",
			delayChildren: stagger(0.05),
		},
	},
};

const itemInitial = {
	opacity: 0,
	y: 15,
};
