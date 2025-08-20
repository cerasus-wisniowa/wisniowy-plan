import { Button } from "@restart/ui";
import RestartModal from "@restart/ui/Modal";
import { motion } from "motion/react";
import type React from "react";

type ModalParams = {
	show: boolean;
	onHide: () => void;
	backdrop?: boolean;
	children: React.ReactNode;
	title?: string | React.ReactNode | undefined;
	closeButton?: boolean;
};

export default function Modal({
	show,
	onHide,
	backdrop,
	children,
	title,
	closeButton,
}: ModalParams) {
	return (
		<RestartModal
			show={show}
			onHide={onHide}
			renderBackdrop={(props) =>
				backdrop && (
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
			}
			autoFocus={false}
			className="flex-col justify-center align-middle items-center w-screen h-screen text-center z-50"
		>
			<motion.div
				initial={{
					scale: 0.8,
					opacity: 0,
				}}
				animate={{
					scale: 1,
					opacity: 1,
				}}
				transition={{
					type: "spring",
					damping: 30,
					stiffness: 500,
					ease: "easeOut",
				}}
				className="fixed z-301 top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2 bg-background-secondary rounded-standard shadow-lg py-6 px-8 max-w-full"
			>
				{title && <h2 className="text-2xl font-medium">{title}</h2>}
				<div className="flex flex-col gap-4 mt-5 overflow-y-auto items-start">
					{children}
				</div>
				{closeButton && (
					<div className="flex gap-2 mt-4 h-12 justify-center mr-12">
						<Button
							onClick={onHide}
							className="bg-background rounded-standard w-28 hover:bg-theme hover:text-foreground text-theme duration-100 cursor-pointer"
						>
							Zamknij
						</Button>
					</div>
				)}
			</motion.div>
		</RestartModal>
	);
}
