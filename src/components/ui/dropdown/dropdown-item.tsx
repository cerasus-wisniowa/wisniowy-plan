import { useDropdown } from "./dropdown-provider";

export default function DropdownItem({
	children,
	className,
}: {
	children: React.ReactNode;
	className?: string;
}) {
	const [, setShow] = useDropdown();

	return (
		<li onClick={() => setShow(false)} className={className}>
			{children}
		</li>
	);
}
