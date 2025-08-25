import { Link } from "react-router";
import type { PlanType } from "../../lib/definitions/plan";
import { useState } from "react";
import Spinner from "../ui/spinner";

export default function PlanLink({
	children,
	name,
	type,
	className,
	title,
}: {
	children: React.ReactNode;
	name?: string;
	type: PlanType;
	className?: string;
	title?: string;
}) {
	const [loading, setLoading] = useState(false);

	if (!name) return children;
	return (
		<Link
			to={`/plan/${type}/${name}`}
			title={title}
			className={
				"hover:text-theme duration-100 cursor-pointer " + className
			}
			onClick={() => setLoading(true)}
		>
			{loading ? <Spinner className="w-[0.8lh] h-[0.8lh]" /> : children}
		</Link>
	);
}
