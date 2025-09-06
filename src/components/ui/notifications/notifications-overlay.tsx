import { useNotifications } from "@/components/context/notifications-provider";
import NotificationPopup from "./notification-popup";
import { AnimatePresence } from "motion/react";

export default function NotificationsOverlay() {
	const { notifications } = useNotifications();

	return (
		<div className="fixed w-screen h-screen z-1 items-end flex flex-col not-pc:mt-22 pc:flex-col-reverse gap-2 pointer-events-none pr-6 pb-4">
			<AnimatePresence>
				{notifications.map((notification) => (
					<NotificationPopup
						title={notification.title}
						type={notification.type}
						id={notification.id}
						key={notification.id}
					>
						{notification.message}
					</NotificationPopup>
				))}
			</AnimatePresence>
		</div>
	);
}
