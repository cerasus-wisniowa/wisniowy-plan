import type {
	AppNotification,
	RawAppNotification,
} from "@/lib/definitions/notification";
import { uuid } from "@/lib/util/uuid";
import { createContext, useContext, useState } from "react";

type NotificationsContextType = {
	notifications: AppNotification[];
	addNotification: (notification: RawAppNotification) => void;
	removeNotification: (id: string) => void;
};

const NotificationsContext = createContext<NotificationsContextType | null>(
	null
);

export default function NotificationsProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const [notifications, setNotifications] = useState<AppNotification[]>([]);

	const removeNotification = (id: string) => {
		setNotifications((prev) => prev.filter((n) => n.id !== id));
	};
	const addNotification = (notification: RawAppNotification) => {
		const notif = { ...notification, id: uuid() };
		setNotifications((prev) => [...prev, notif]);
		if (notification.duration)
			setTimeout(() => {
				removeNotification(notif.id);
			}, notification.duration);
	};

	return (
		<NotificationsContext.Provider
			value={{ notifications, addNotification, removeNotification }}
		>
			{children}
		</NotificationsContext.Provider>
	);
}

export function useNotifications() {
	const notifications = useContext(NotificationsContext);
	if (!notifications) {
		throw new Error("useNotifications must be used within an ApiProvider");
	}

	return notifications;
}
