import { cn } from "@/lib/util/classname";
import { lessonHeight } from "./lesson-element";

export default function EmptyLessonElement() {
	return <li className={cn("w-full p-2 pr-3", lessonHeight)} />;
}
