import { Link, useLocation } from "react-router";

export default function TableNavigation({
	children,
	href,
}: {
	children: React.ReactNode;
	href: string;
}) {
	const { pathname } = useLocation();
	const className =
		(pathname.startsWith(href) && "text-theme") +
		" bg-background-secondary w-full md:w-64 h-10 p-1 rounded-t-standard rounded-b-md mb-1 flex flex-col justify-center items-center shadow-md hover:bg-background-tertiary duration-100 cursor-pointer";

	if (pathname.startsWith(href)) {
		return <div className={className}>{children}</div>;
	}

	return (
		<Link
			to={href}
			className={
				(pathname.startsWith(href) && "text-theme") +
				" bg-background-secondary w-full md:w-64 h-10 p-1 rounded-t-standard rounded-b-md mb-1 flex flex-col justify-center items-center shadow-md hover:bg-background-tertiary duration-100"
			}
		>
			{children}
		</Link>
	);
}
