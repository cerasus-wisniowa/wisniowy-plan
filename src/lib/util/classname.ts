export function cn(...strings: (string | undefined)[]) {
	return strings.map((s) => s).join(" ");
}
