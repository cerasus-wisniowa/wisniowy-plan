import { AnimatePresence, motion } from "motion/react";
import Spinner from "./spinner";
import { useStatus } from "../context/status-provider";
import { useEffect } from "react";
import { useChanges } from "../context/changes-provider";

export default function Status() {
	const [status, setStatus] = useStatus();
	const { loading } = useChanges();

	useEffect(() => {
		if (loading) setStatus("Aktualizacja danych...");
		else setStatus(null);
	}, [loading, setStatus]);

	return (
		<AnimatePresence>
			{status && (
				<motion.div
					initial={{
						y: -150,
					}}
					animate={{
						y: 0,
					}}
					exit={{
						y: -150,
					}}
					transition={{
						delay: 0.1,
						type: "spring",
						damping: 20,
						stiffness: 400,
					}}
					className="fixed top-8 z-200 left-1/2 transform -translate-x-1/2 w-fit max-w-92 flex gap-2 font-medium text-foreground items-center text-xl shadow-md rounded-standard px-3 pr-4 py-2 border-2 bg-warning-bg border-warning-bg dark:border-warning"
				>
					<Spinner width={32} height={32} style="regular" />
					<div>{status}</div>
				</motion.div>
			)}
		</AnimatePresence>
	);
}
