import { Link } from "react-router";
import type { PlanType } from "../../lib/definitions/plan";

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
	if (!name) return children;
	return (
		<Link
			to={`/plan/${type}/${name}`}
			title={title}
			className={
				"hover:text-theme duration-100 cursor-pointer " + className
			}
		>
			{children}
		</Link>
	);
}
