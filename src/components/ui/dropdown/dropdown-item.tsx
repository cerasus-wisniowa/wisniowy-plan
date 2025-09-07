import { useDropdown } from "./dropdown-provider";

export default function DropdownItem({
	children,
	className,
	onClick,
}: {
	children: React.ReactNode;
	className?: string;
	onClick?: () => void;
}) {
	const [, setShow] = useDropdown();

	return (
		<div
			onClick={() => {
				if (onClick) onClick();
				setShow(false);
			}}
			className={className}
		>
			{children}
		</div>
	);
}
