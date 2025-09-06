import { motion } from "motion/react";
import Close from "@/assets/icons/menu/close.svg?react";
import { Button } from "@restart/ui";
import { useNotifications } from "@/components/context/notifications-provider";
import { cn } from "@/lib/util/classname";

type NotificationType = {
	title: string;
	children: string;
	type: "info" | "success" | "error" | "warning";
	id: string;
};

const styles = {
	info: "border-info bg-info-bg",
	success: "border-accept bg-accept-bg",
	error: "border-deny bg-deny-bg",
	warning: "border-warning bg-warning-bg",
};

export default function NotificationPopup({
	title,
	children,
	type,
	id,
}: NotificationType) {
	const { removeNotification } = useNotifications();

	return (
		<motion.div
			initial={{
				x: 340,
			}}
			animate={{
				x: 0,
			}}
			exit={{
				x: 340,
				transition: {
					type: "tween",
					ease: "easeInOut",
					duration: 0.05,
				},
			}}
			transition={{
				type: "spring",
				ease: "easeInOut",
				damping: 30,
				stiffness: 500,
			}}
			className={cn(
				"w-96 py-1 max-w-[87vw] max-h-64 rounded-standard shadow border-1 flex flex-col pointer-events-auto text-foreground-secondary",
				styles[type]
			)}
			layout
		>
			<div className="flex w-full justify-between">
				<h4 className="mx-3 font-medium text-lg self-end">{title}</h4>
				<Button
					className="p-0.5 m-1 cursor-pointer hover:bg-white/10 rounded-full duration-75"
					onClick={() => removeNotification(id)}
				>
					<Close width={20} height={20} />
				</Button>
			</div>

			<p className="mx-3 mb-2 h-full">{children}</p>
		</motion.div>
	);
}
