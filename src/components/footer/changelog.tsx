import { Button, Modal } from "@restart/ui";
import { motion } from "motion/react";
import type { Changelog } from "../../lib/definitions/changelog";
import { parseChangelogLine } from "../../lib/util/parse-changelog-line";
import Divider from "../ui/divider";

export default function ChangelogModal({
	changelog,
	show,
	title,
	setShow,
}: {
	changelog: Changelog;
	show: boolean;
	title: string;
	setShow: (show: boolean) => void;
}) {
	return (
		<Modal
			show={show}
			onHide={() => setShow(false)}
			renderBackdrop={(props) => (
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
			)}
			autoFocus={false}
			className="flex-col justify-center align-middle items-center w-screen h-screen z-50"
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
				}}
				className="fixed z-301 top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 bg-background-secondary rounded-standard shadow-lg py-6 px-4 pc:max-w-164 w-[90%] max-h-[90%]"
			>
				<h2 className="text-2xl mb-2 font-medium text-center">
					{title}
				</h2>
				<div className="flex flex-col gap-4 overflow-y-auto max-h-[70vh]">
					{changelog.map((release, i) => (
						<div
							key={release.version}
							className="flex flex-col text-start gap-1 h-full px-4"
						>
							{i !== 0 && (
								<div className="mx-2 mb-3">
									<Divider style="secondary" />
								</div>
							)}
							<h3>
								<div className="text-foreground-tertiary text-md">
									{release.date.toLocaleDateString("pl-PL", {
										day: "numeric",
										month: "long",
										year: "numeric",
									})}
								</div>
								<div className="text-xl font-medium">
									{release.version}
								</div>
							</h3>
							<ul className="list-disc ml-5">
								{release.changes.map((change, j) => (
									<li key={j}>
										{parseChangelogLine(
											change,
											"dark:text-orange-400 rounded-sm dark:bg-black/25 bg-black/15 text-orange-600 px-1"
										).flatMap((el) => el)}
									</li>
								))}
							</ul>
						</div>
					))}
				</div>
				<div className="flex justify-center pt-2">
					<Button
						onClick={() => setShow(false)}
						className="bg-background rounded-standard w-42 h-10 self-center hover:bg-theme hover:text-foreground text-theme duration-100 cursor-pointer"
					>
						Zamknij
					</Button>
				</div>
			</motion.div>
		</Modal>
	);
}
