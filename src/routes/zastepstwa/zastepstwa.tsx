import { useChanges } from "../../components/context/changes-provider";
import Spinner from "../../components/ui/spinner";
import Error from "../../assets/icons/error.svg?react";
import type { Teacher } from "../../lib/definitions/teacher";
import { areTeachersEqual } from "../../lib/util/teachers-equal";
import bells from "../../data/bells.json";
import Divider from "../../components/ui/divider";
import { areDatesEqual } from "../../lib/util/are-dates-equal";
import { Fragment } from "react/jsx-runtime";

export default function ZastepstwaRoute() {
	const { changes, loading, error } = useChanges();

	if (loading)
		return (
			<div className="w-full h-96 content-center">
				<Spinner className="self-center mx-auto" />
				<div className="w-full text-center mt-2 text-xl">
					Ładowanie zastępstw
				</div>
			</div>
		);
	if (error)
		return (
			<div className="w-full h-96 content-center">
				<Error
					width={42}
					height={42}
					className="self-center mx-auto text-error"
				/>
				<div className="w-full text-center mt-2 text-xl">
					Wystąpił błąd podczas ładowania zastępstw
				</div>
			</div>
		);

	const dates = changes!.dates.map((date) => new Date(date));

	const TextDivider = () => <span className="text-theme mx-1"> • </span>;

	const Changes = ({ date }: { date: Date }) => {
		const filteredChanges = changes!.changes.filter((c) =>
			areDatesEqual(date, new Date(c.date))
		);
		const teachers: Teacher[] = [];
		filteredChanges.forEach((c) => {
			if (!teachers.some((t) => areTeachersEqual(c.teacher, t)))
				teachers.push(c.teacher);
		});
		return teachers
			.sort(
				(a, b) =>
					a.lastName.localeCompare(b.lastName) ||
					a.firstName.localeCompare(b.firstName)
			)
			.map((t) => (
				<div key={t.firstName + ":" + t.lastName}>
					<div className="font-semibold text-md">
						{t.firstName.toUpperCase()} {t.lastName.toUpperCase()}
					</div>
					<div className="text-md flex flex-col gap-0.5 mt-0.5">
						{filteredChanges
							.filter((c) => areTeachersEqual(c.teacher, t))
							.sort((a, b) => a.hour - b.hour)
							.map((c, i) => (
								<p key={i}>
									<span className="text-foreground-tertiary">
										{c.hour}. {bells[c.hour]}
									</span>
									<TextDivider />
									<span className="">
										{c.sections
											.map(
												(s) =>
													`${s.class}${
														s.group
															? " (gr. " +
																s.group +
																")"
															: ""
													}`
											)
											.join(", ")}
									</span>
									{c.consequence && (
										<>
											<TextDivider />
											<span className="">
												{c.consequence}
											</span>
										</>
									)}
									{c.substitutionTeacher && (
										<>
											<TextDivider />
											<span className="font-medium">
												{
													c.substitutionTeacher
														.firstName
												}{" "}
												{c.substitutionTeacher.lastName}
											</span>
										</>
									)}
									{c.classroom && (
										<>
											<TextDivider />
											<span>
												{c.classroom.room} -{" "}
												{c.classroom.name}
											</span>
										</>
									)}
									{c.note && (
										<>
											<TextDivider />
											{c.note}
										</>
									)}
									{c.generated && (
										<>
											{" "}
											<span className="text-sm text-foreground-tertiary">
												(wygenerowano automatycznie)
											</span>
										</>
									)}
								</p>
							))}
					</div>
				</div>
			));
	};

	return (
		<div className="p-2">
			{dates.map((date) => (
				<Fragment key={date.toDateString()}>
					<div
						key={date.toDateString()}
						className="flex flex-col mt-1 text-md"
					>
						<span className="text-foreground-tertiary">
							{date.toLocaleDateString("pl-PL", {
								day: "numeric",
								year: "numeric",
								month: "long",
								weekday: "long",
							})}
						</span>
						<div className="text-foreground-secondary flex flex-col gap-2">
							<Changes date={date} />
						</div>
					</div>
					<Divider className="last:hidden my-3" style="theme" />
				</Fragment>
			))}
		</div>
	);
}
