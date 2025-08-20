import Footer from "../footer/footer";
import Navbar from "../navbar/navbar";

export default function Page({ children }: { children: React.ReactNode }) {
	return (
		<div className="flex flex-col justify-between gap-2 min-h-screen bg-background">
			<div className="text-lg mx-1">
				<Navbar />
				<div className="mx-1 pc:mx-auto pc:w-[95%] p-4">{children}</div>
			</div>
			<Footer />
		</div>
	);
}
