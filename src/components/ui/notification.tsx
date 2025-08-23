import { AnimatePresence, motion } from "motion/react";

const styles = {
	warning: "border-2 bg-warning-bg border-warning-bg dark:border-warning",
	error: "border-2 bg-deny-bg border-deny-bg dark:border-deny",
};

export default function NotificationUI({
	children,
	style,
	show,
}: {
	children: React.ReactNode;
	style: keyof typeof styles;
	show: boolean;
}) {
	return (
		<AnimatePresence>
			{show && (
				<motion.div
					initial={{
						y: -100,
					}}
					animate={{
						y: 0,
					}}
					exit={{
						y: -100,
						transitionDuration: 0.15,
					}}
					transition={{
						duration: 0.2,
						delay: 0.1,
						type: "spring",
						damping: 15,
						stiffness: 100,
					}}
					className={
						"fixed top-8 z-200 left-1/2 transform -translate-x-1/2 w-fit max-w-92 flex gap-2 font-medium text-foreground items-center text-xl shadow-md rounded-standard px-3 pr-4 py-2 " +
						styles[style]
					}
				>
					{children}
				</motion.div>
			)}
		</AnimatePresence>
	);
}
