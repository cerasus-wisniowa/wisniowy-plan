import Page from "./page";
import TableNavigation from "./table-navigation";

export default function TablePage({ children }: { children: React.ReactNode }) {
	return (
		<Page>
			<div className="self-center mt-4">
				<div className="flex gap-2 justify-center items-end md:max-w-[90%] mx-auto">
					<TableNavigation href="/plan">plan zajęć</TableNavigation>
					<TableNavigation href="/zastepstwa">
						zastępstwa
					</TableNavigation>
				</div>
				<div className="w-full bg-background-secondary py-2 px-3 rounded-standard not-md:rounded-t-md shadow-md">
					{children}
				</div>
			</div>
		</Page>
	);
}
