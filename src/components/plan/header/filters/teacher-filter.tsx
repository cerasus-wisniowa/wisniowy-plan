import type { Teacher } from "@/lib/definitions/teacher";
import Dropdown from "@/components/ui/dropdown/dropdown";
import Arrow from "@/assets/icons/navigation/next.svg?react";
import Overlay from "@/components/ui/overlay";
import { motion, stagger, type Variants } from "motion/react";
import DropdownItem from "@/components/ui/dropdown/dropdown-item";
import DropdownProvider from "@/components/ui/dropdown/dropdown-provider";

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
			<DropdownProvider>
				<Dropdown
					position="bottom-right"
					toggle={(show) => <Toggle show={show} />}
					backdrop={
						<Overlay
							visible
							className="z-4 bg-black/20 dark:bg-black/40 fixed top-0 left-0 w-full h-full"
						/>
					}
					hideDelay={0}
				>
					<motion.ul
						className="flex flex-col gap-1 p-1"
						variants={ulVariants}
					>
						<motion.li variants={liVariants}>
							<DropdownItem
								className="py-1 px-3 hover:bg-white/15 cursor-pointer duration-100 text-md text-start w-full rounded-t-standard rounded-b-sm"
								onClick={() => onSelect()}
							>
								brak
							</DropdownItem>
						</motion.li>
						{teachers.map((teacher, i) => (
							<motion.li variants={liVariants}>
								<DropdownItem
									key={i}
									className={
										"py-1 px-3 hover:bg-white/15 cursor-pointer text-md duration-100 text-start w-full rounded-t-sm " +
										(i === teachers.length - 1
											? "rounded-b-standard"
											: "rounded-b-sm")
									}
									onClick={() => onSelect(teacher.initials!)}
								>{`${teacher.firstName}. ${teacher.lastName} (${teacher.initials})`}</DropdownItem>
							</motion.li>
						))}
					</motion.ul>
				</Dropdown>
			</DropdownProvider>
		</div>
	);
}

const ulVariants: Variants = {
	open: {
		transition: {
			delayChildren: stagger(0.03),
		},
	},
	closed: {
		transition: {
			delayChildren: stagger(0.01),
		},
	},
};

const liVariants: Variants = {
	open: {
		translateY: [-5, 0],
		opacity: [0, 1],
		transition: {
			duration: 0.2,
		},
	},
	closed: {
		translateY: -5,
		opacity: 0,
		transition: {
			duration: 0.1,
		},
	},
};
