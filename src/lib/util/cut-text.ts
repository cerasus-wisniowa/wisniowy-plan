export function cutText(string: string) {
	if (string.length > 16) return string.substring(0, 14) + "...";
	return string;
}
