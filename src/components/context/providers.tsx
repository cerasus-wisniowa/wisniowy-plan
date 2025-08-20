import ChangesProvider from "./changes-provider";
import WeekProvider from "./week-provider";
import ThemeProvider from "./theme-provider";
import PlanListProvider from "./plan-list-provider";
import FavouritesProvider from "./favourites-provider";
import ApiProvider from "./api-provider";

export default function Providers({ children }: { children: React.ReactNode }) {
	return (
		<ThemeProvider>
			<WeekProvider>
				<PlanListProvider>
					<FavouritesProvider>
						<ChangesProvider>
							<ApiProvider>{children}</ApiProvider>
						</ChangesProvider>
					</FavouritesProvider>
				</PlanListProvider>
			</WeekProvider>
		</ThemeProvider>
	);
}
