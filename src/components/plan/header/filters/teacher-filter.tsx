import type { Teacher } from "../../../../lib/definitions/teacher";
import Dropdown from "../../../ui/dropdown";
import RestartDropdown from "@restart/ui/Dropdown";
import Arrow from "../../../../assets/icons/navigation/next.svg?react";
import Overlay from "../../../ui/overlay";
import { motion } from "motion/react";

export default function TeacherDropdown({
	children,
	selected,
	teachers,
	onSelect,
}: {
	children: React.ReactNode;
	selected?: string;
	teachers: Teacher[];
	onSelect: (id?: string) => void;
}) {
	const teacher = teachers.find((t) => t.initials === selected);
	const teacherName = (teacher: Teacher) =>
		`${teacher.firstName}. ${teacher.lastName} (${teacher.initials})`;

	const Toggle = ({ show }: { show: boolean }) => (
		<div className="rounded-standard justify-between bg-background items-center flex gap-2 p-2 pl-3 text-foreground-secondary hover:bg-black/15 dark:hover:bg-white/20 duration-100 max-w-60 shadow-sm">
			<div className="line-clamp-1">
				{teacher ? teacherName(teacher) : "wybierz"}
			</div>
			<motion.div
				animate={{ rotate: show ? 90 : 0 }}
				transition={{
					duration: 0.2,
					ease: "easeInOut",
				}}
			>
				<Arrow width={28} height={28} />
			</motion.div>
		</div>
	);

	return (
		<div className="flex gap-2 items-center">
			<div className="text-foreground-secondary self-center text-start">
				{children}
			</div>
			<Dropdown
				toggle={(show) => <Toggle show={show} />}
				backdrop={
					<Overlay
						visible
						className="z-4 bg-black/20 dark:bg-black/40 fixed top-0 left-0 w-full h-full"
					/>
				}
			>
				<ul className="flex flex-col gap-1 pb-1">
					<RestartDropdown.Item
						className="py-1 px-3 hover:text-theme cursor-pointer text-md text-start w-full"
						onClick={() => onSelect()}
					>
						brak
					</RestartDropdown.Item>
					{teachers.map((teacher, i) => (
						<RestartDropdown.Item
							key={i}
							className="py-1 px-3 hover:text-theme cursor-pointer text-md duration-75 text-start w-full"
							onClick={() => onSelect(teacher.initials!)}
						>{`${teacher.firstName}. ${teacher.lastName} (${teacher.initials})`}</RestartDropdown.Item>
					))}
				</ul>
			</Dropdown>
		</div>
	);
}
