import LessonElement from "../lesson/lesson-element";
import Skeleton from "../../ui/skeleton";

// unused
export default function LoadingLessonElement() {
	return (
		<LessonElement>
			<div className="h-full flex flex-col w-full">
				<div
					className={`rounded-full w-[30%] self-end text-sm justify-end `}
				>
					<Skeleton />
				</div>
				<div className="flex flex-col gap-1 justify-end h-full w-full">
					<div className="flex gap-1.5">
						<div className="content-end h-full mb-6 text-md/5.5 font-medium w-4">
							<Skeleton />
						</div>
						<div className="content-end h-full overflow-hidden overflow-ellipsis line-clamp-2 text-md/5.5 font-medium w-[80%]">
							<Skeleton />
							<div className="w-[50%] mt-1">
								<Skeleton />
							</div>
						</div>
					</div>
					<div className="flex gap-2 justify-between w-full text-sm">
						<div className="text-foreground-secondary max-w-42 line-clamp-1 ml-5.5 w-[90%]">
							<Skeleton />
						</div>
						<div className="self-end max-w-14 line-clamp-1 w-[10%]">
							<Skeleton />
						</div>
					</div>
				</div>
			</div>
		</LessonElement>
	);
}
