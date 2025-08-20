import RestartDropdown from "@restart/ui/Dropdown";
import type { Placement } from "@restart/ui/usePopper";
import { AnimatePresence, motion } from "motion/react";

export default function Dropdown({
	toggle,
	children,
	placement,
	className,
	backdrop,
	alwaysRender,
	transitions = true,
}: {
	toggle: (show: boolean) => React.ReactNode;
	children: React.ReactNode;
	placement?: Placement;
	className?: string;
	backdrop?: React.ReactNode;
	alwaysRender?: boolean;
	transitions?: boolean;
}) {
	return (
		<RestartDropdown>
			<RestartDropdown.Toggle>
				{(props, { show }) => (
					<div {...props} className="cursor-pointer">
						{toggle(show)}
					</div>
				)}
			</RestartDropdown.Toggle>
			<RestartDropdown.Menu flip placement={placement}>
				{(props, { show }) => {
					const classname =
						"absolute bg-background-secondary rounded-standard shadow-md mt-1 text-foreground block cursor-default z-5 " +
						className +
						(show || !alwaysRender ? "" : " hidden");
					if (transitions)
						return (
							<AnimatePresence>
								{(show || alwaysRender) && (
									<>
										<motion.div
											{...props}
											initial={{
												opacity: 0,
											}}
											animate={{
												opacity: 1,
											}}
											exit={{
												opacity: 0,
											}}
											transition={{
												duration: 0.2,
												ease: "easeInOut",
											}}
											className={classname}
										>
											{children}
										</motion.div>
										{show && backdrop}
									</>
								)}
							</AnimatePresence>
						);
					else if (show || alwaysRender)
						return (
							<>
								<div {...props} className={classname}>
									{children}
								</div>
								{show && backdrop}
							</>
						);
				}}
			</RestartDropdown.Menu>
		</RestartDropdown>
	);
}
