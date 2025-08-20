import { motion } from "motion/react";

type SwitchProps = {
	checked: boolean;
	onChange: (checked: boolean) => void;
	disabled?: boolean;
};

// TODO: fix animations
export default function Switch({
	checked,
	onChange,
	disabled = false,
}: SwitchProps) {
	return (
		<button
			className={`flex h-6 w-11 rounded-full border-2 border-transparent duration-100 shadow-sm ${
				checked
					? "bg-theme justify-end"
					: "bg-background-tertiary hover:bg-black/25 hover:dark:bg-white/25 justify-start"
			} ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
			onClick={() => !disabled && onChange(!checked)}
			disabled={disabled}
		>
			<motion.div
				layout
				className={`h-5 w-5 rounded-full bg-white/80 shadow ring-0`}
				transition={{
					type: "spring",
					visualDuration: 0.2,
					bounce: 0.2,
				}}
			/>
		</button>
	);
}
