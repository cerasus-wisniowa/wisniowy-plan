import { Button } from "@restart/ui";

type GroupFilterProps = {
	selected?: string | number;
	options: (string | number)[];
	onSelect: (value: string | number) => void;
	title?: string;
};

export default function GroupFilter({
	selected,
	options,
	onSelect,
	title,
}: GroupFilterProps) {
	return (
		<div className="flex h-full text-foreground-secondary pc:self-center">
			{title && (
				<div className="h-10 mr-3 my-auto content-center">{title}</div>
			)}
			<div className="content-center bg-background rounded-standard flex h-10 items-center self-center">
				{options.map((i) => (
					<Button
						key={i}
						onClick={() => onSelect(i)}
						className={`${selected === i && "text-theme"} first:rounded-l-standard last:rounded-r-standard w-9 h-full first:pl-1 last:pr-1 cursor-pointer hover:bg-black/15 dark:hover:bg-white/20 duration-100`}
					>
						{i}
					</Button>
				))}
			</div>
		</div>
	);
}
