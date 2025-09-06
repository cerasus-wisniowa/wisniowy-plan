import ChangesProvider from "./changes-provider";
import WeekProvider from "./week-provider";
import ThemeProvider from "./theme-provider";
import PlanListProvider from "./plan-list-provider";
import ApiProvider from "./api-provider";
import StatusProvider from "./status-provider";
import NotificationsProvider from "./notifications-provider";

export default function Providers({ children }: { children: React.ReactNode }) {
	return (
		<ThemeProvider>
			<StatusProvider>
				<NotificationsProvider>
					<WeekProvider>
						<PlanListProvider>
							<ChangesProvider>
								<ApiProvider>{children}</ApiProvider>
							</ChangesProvider>
						</PlanListProvider>
					</WeekProvider>
				</NotificationsProvider>
			</StatusProvider>
		</ThemeProvider>
	);
}
