export type AppNotification = RawAppNotification & {
	id: string;
};

export type RawAppNotification = {
	title: string;
	message: string;
	type: NotificationType;
	duration?: number;
};

export type NotificationType = "info" | "success" | "error" | "warning";
