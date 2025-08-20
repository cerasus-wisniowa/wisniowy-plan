import config from "./src/data/config.json" with { type: "json" };

const version = process.env.npm_package_version;

if (!version) {
	throw new Error(
		"Version is not defined. Please ensure that the version is set in your package.json."
	);
} else console.log("Version: " + version);

if (version.split("-").length > 1) {
	throw new Error(
		"You are using a development version of the app. Please use a stable version for production."
	);
} else console.log("Stable version detected: " + version);

(async () => {
	const res = await fetch(config.api);
	if (!res.ok) {
		throw new Error("Failed to connect to the API.");
	}
	const data = await res.json();
	if (!data || !data.version) {
		throw new Error(
			"API response is invalid or does not contain the version information."
		);
	}
	if (data.environment !== "production") {
		throw new Error(
			`You are not using the production environment (${config.api}). Please switch to the production environment.`
		);
	}
	console.log(
		`Using API ${data.name} v${data.version} in production environment.`
	);
})();
