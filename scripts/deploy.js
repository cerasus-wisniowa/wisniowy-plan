import { NodeSSH } from "node-ssh";
import { config } from "dotenv";
config();

const ssh = new NodeSSH();
const host = "xander302.mikrus.xyz";
const username = "webadmin";

const target =
	process.env.TARGET === "production"
		? "plan.dudko.eu"
		: "plan-test.dudko.eu";

(async () => {
	console.log("Connecting to " + host + " as " + username);
	try {
		await ssh.connect({
			host,
			username,
			privateKey: process.env.PRIVATE_KEY,
			port: 10302,
		});
	} catch (error) {
		console.log(error);
		throw new Error(
			`Failed to connect to ${host} as ${username}. Please check your credentials.`
		);
	}

	if (ssh.isConnected())
		console.log("Connected to " + host + " as " + username);
	else {
		throw new Error("Failed to connect to " + host + " as " + username);
	}

	console.log(`Removing previous ${target} folder`);
	const remove = await ssh.execCommand(`rm -rf /var/www/html/${target}`);
	if (remove.code !== 0) {
		console.log(
			"Failed to remove previous app folder, error:",
			remove.stderr
		);
	} else {
		console.log("Previous app folder removed successfully");
	}

	const transfers = {
		successful: [],
		failed: [],
	};

	console.log("Uploading files");

	await ssh
		.putDirectory("./dist/client", `/var/www/html/${target}/`, {
			recursive: true,
			concurrency: 10,
			tick: (localPath, _remotePath, error) => {
				if (error) {
					transfers.failed.push(localPath);
				} else {
					transfers.successful.push(localPath);
				}
			},
		})
		.then((status) => {
			console.log(
				"dist directory transfer was",
				status ? "successful" : "unsuccessful"
			);
			console.log("failed transfers", transfers.failed);
			console.log("successful transfers", transfers.successful);
		});

	ssh.dispose();
	console.log("Disconnected from " + host);
})();
