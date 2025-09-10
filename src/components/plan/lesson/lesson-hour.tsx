import bells from "../../../data/bells.json";

export default function LessonHour({ hour }: { hour: number }) {
	return (
		<div className="w-fit self-end text-sm font-bold">{bells[hour]}</div>
	);
}
