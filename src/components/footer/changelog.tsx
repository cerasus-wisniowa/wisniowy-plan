import { parseChangelogLine } from "../../lib/util/parse-changelog-line";
import type { Changelog } from "../../lib/definitions/changelog";
import Divider from "../ui/divider";
import Modal from "../ui/modal/modal";
import { motion, type Variants } from "motion/react";

const types = {
	changed: "Zmiany",
	fixed: "Poprawki",
};

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
	const Line = ({ children }: { children: string }) => (
		<li>
			{parseChangelogLine(
				children,
				"dark:text-orange-400 rounded-sm dark:bg-black/25 bg-black/15 text-orange-600 px-1"
			).flatMap((el) => el)}
		</li>
	);

	return (
		<Modal
			show={show}
			onHide={() => setShow(false)}
			title={title}
			closeButton
			backdrop
			className="pc:max-w-164 w-[90%] max-h-[90%]"
		>
			{changelog.map((release, i) => (
				<motion.div
					variants={releaseVariants}
					initial={{ originY: 10, opacity: 0 }}
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
					{release.changes && (
						<ul className="list-disc ml-5">
							{release.changes?.map((change, j) => (
								<Line key={j}>{change}</Line>
							))}
						</ul>
					)}
					{release.changeSets && (
						<div className="flex flex-col gap-2">
							{release.changeSets?.map((set, j) => (
								<div key={j}>
									<h4 className="text-lg font-medium">
										{types[set.type]}:
									</h4>
									<ul className="list-disc ml-5">
										{set.changes.map((change, k) => (
											<Line key={k}>{change}</Line>
										))}
									</ul>
								</div>
							))}
						</div>
					)}
				</motion.div>
			))}
		</Modal>
	);
}

const releaseVariants: Variants = {
	open: {
		originY: 0,
		opacity: 1,
		transition: {
			ease: "easeInOut",
			duration: 0.2,
		},
	},
};
