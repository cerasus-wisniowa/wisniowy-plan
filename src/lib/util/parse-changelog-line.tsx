export function parseChangelogLine(
	line: string,
	className?: string
): (string | React.ReactNode)[] {
	// parse <code></code>
	const codeRegex = /<code>(.*?)<\/code>/g;

	let result: (string | React.ReactNode)[] = [];
	let lastIndex = 0;

	let match;
	while ((match = codeRegex.exec(line)) !== null) {
		if (match.index > lastIndex) {
			result.push(line.slice(lastIndex, match.index));
		}
		result.push(
			<code className={className} key={match.index}>
				{match[1]}
			</code>
		);
		lastIndex = codeRegex.lastIndex;
	}
	if (lastIndex < line.length) {
		result.push(line.slice(lastIndex));
	}

	// parse ``
	const inlineCodeRegex = /`([^`]+)`/g;

	result = result.flatMap((part) => {
		if (typeof part !== "string") return [part];
		let pieces: (string | React.ReactNode)[] = [];
		let idx = 0;
		let m;
		while ((m = inlineCodeRegex.exec(part)) !== null) {
			if (m.index > idx) {
				pieces.push(part.slice(idx, m.index));
			}
			pieces.push(
				<code className={className} key={m.index}>
					{m[1]}
				</code>
			);
			idx = inlineCodeRegex.lastIndex;
		}
		if (idx < part.length) {
			pieces.push(part.slice(idx));
		}
		return pieces;
	});

	return result;
}
