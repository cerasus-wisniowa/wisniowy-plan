import type { BaseHTMLAttributes } from "react";

export default function NavbarButton(
	props: BaseHTMLAttributes<HTMLDivElement> & {
		children: React.ReactNode;
	}
) {
	return (
		<div
			{...props}
			className={
				"hover:bg-background-tertiary cursor-pointer p-1 flex h-full rounded-full duration-150 " +
				props.className
			}
		>
			{props.children}
		</div>
	);
}
