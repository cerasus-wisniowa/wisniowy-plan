"use client";

import { AnimatePresence, motion } from "motion/react";

export type OverlayProperties = {
	visible?: boolean;
	className?: string;
	id?: string;
	children?: React.ReactNode;
	onClick?: () => void;
};

export default function Overlay({
	visible,
	className,
	onClick,
	children,
	id,
}: OverlayProperties) {
	return (
		<AnimatePresence>
			{visible && (
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{ duration: 0.2 }}
					className={
						"fixed left-0 right-0 top-0 bottom-0 " + className
					}
					onClick={onClick}
					id={id}
				>
					{children}
				</motion.div>
			)}
		</AnimatePresence>
	);
}
