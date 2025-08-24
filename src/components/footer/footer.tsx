import { Button } from "@restart/ui";
import { useApi } from "../context/api-provider";
import Divider from "../ui/divider";
import ChangelogModal from "./changelog";
import { useEffect, useState } from "react";
import type { Changelog } from "../../lib/definitions/changelog";
import {
	fetchApiChangelog,
	fetchSiteChangelog,
} from "../../lib/fetch/changelog";

export default function Footer() {
	const { api, success, loading } = useApi();

	const [siteChangelog, setSiteChangelog] = useState<Changelog | null>(null);
	const [apiChangelog, setApiChangelog] = useState<Changelog | null>(null);

	const [showChangelog, setShowChangelog] = useState<"site" | "api" | null>(
		null
	);

	useEffect(() => {
		fetchSiteChangelog().then((changelog) => {
			setSiteChangelog(changelog);
		});

		fetchApiChangelog().then((changelog) => {
			setApiChangelog(changelog);
		});
	}, []);

	return (
		<div className="w-full self-center mx-auto text-md font-normal">
			<div className="self-center mx-4">
				<Divider style="footer" />
			</div>
			{siteChangelog && (
				<ChangelogModal
					title="Aktualizacje strony"
					show={showChangelog === "site"}
					setShow={(show) =>
						show ? setShowChangelog("site") : setShowChangelog(null)
					}
					changelog={siteChangelog}
				/>
			)}{" "}
			{apiChangelog && (
				<ChangelogModal
					title="Aktualizacje API"
					show={showChangelog === "api"}
					setShow={(show) =>
						show ? setShowChangelog("api") : setShowChangelog(null)
					}
					changelog={apiChangelog}
				/>
			)}
			<div className="flex not-sm:flex-col items-center sm:justify-between mx-8 gap-4 p-4 bg-background text-foreground-tertiary dark:text-white/30 flex-wrap">
				<div className="flex not-sm:flex-col sm:gap-6 gap-2 items-center">
					<Button
						className={
							"duration-100 " + siteChangelog
								? "hover:text-foreground-secondary cursor-pointer"
								: ""
						}
						onClick={() => setShowChangelog("site")}
					>
						Strona: v{__VERSION__}
					</Button>
					{success ? (
						<Button
							className={
								"duration-100 " + apiChangelog
									? "hover:text-foreground-secondary cursor-pointer"
									: ""
							}
							onClick={() => setShowChangelog("api")}
						>
							API: {api!.name} v{api!.version}
						</Button>
					) : loading ? (
						"..."
					) : (
						<div>
							API:{" "}
							<span className="text-deny">brak połączenia</span>
						</div>
					)}
				</div>
				<div>Made by dudko</div>
			</div>
		</div>
	);
}
