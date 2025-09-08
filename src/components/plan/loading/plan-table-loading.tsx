import Spinner from "../../../components/ui/spinner";

// unused
export default function PlanTableLoading({ planName }: { planName: string }) {
	/*
	const { week, mobileDay } = useWeek();
	
	const lessons = [
		[1, 6],
		[2, 4],
		[1, 5],
		[3, 5],
		[2, 4],
	];

	return (
		<>
			<div className="flex justify-between not-pc:hidden mt-[-0.5rem] flex-1 w-full">
				{lessons.map(([start, length], i) => (
					<PlanColumnLoading
						date={getDayOffset(week, i + 1)}
						start={start}
						length={length}
					/>
				))}
			</div>
			<div className="pc:hidden self-center mx-auto w-full">
				<PlanColumnLoading
					date={getDayOffset(week, mobileDay)}
					start={lessons[mobileDay - 1][0]}
					length={lessons[mobileDay - 1][1]}
					mobile
				/>
			</div>
		</>
	);
	*/

	return (
		<div className="w-full min-h-[calc(100vh-26.25rem)] pc:min-h-[calc(100vh-24rem)] items-center justify-center text-center flex flex-col gap-2 py-8 my-1">
			<Spinner />
			<div className="text-xl text-foreground-secondary">
				Pobieranie planu lekcji dla {planName}
			</div>
		</div>
	);
}
