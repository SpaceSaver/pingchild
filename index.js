const Discord = require("discord.js");
const https = require("https");
const http = require("http");
const fetcher = https.request("https://Discord-Ping-Farm-Brain.spacesaver2000.repl.co", { method: "POST" });
const { exec } = require('node:child_process')
let looking = true;
fetcher.write(process.env["id"]);
fetcher.end();
const server = http.createServer(function (req, res) {
	let body = "";
	req.on("data", data => {
		body += data;
	});
	req.on("end", () => {
		if (looking) {
			if (body.startsWith("{")) {
				res.writeHead(200);
				res.write("Thx!");
				res.end();
				const jsondat = JSON.parse(body);
				start(jsondat.token, jsondat.categories, jsondat.frequency);
			}
			else {
				res.writeHead(503);
				res.write("Waiting for data...");
				res.end();
			}
		} else {
			if (req.url == "/stop") {
				res.writeHead(200);
				res.write("Stopping...");
				res.end();
				console.log("Stopping upon request....");
				process.exit(0);
			} else {
				res.writeHead(200);
				res.write("Staying alive...");
				res.end();
			}
		}
	})
}).listen(8080);
function start(token, categories, frequency) {
	looking = false;
	/**
	 * @type {Client}
	 */
	const client = new Discord.Client({ intents: [Discord.Intents.FLAGS.GUILD_MESSAGES, Discord.Intents.FLAGS.GUILDS] });
	client
		.on("debug", console.log)
		.on("warn", console.log);
	client.once('ready', async () => {
		clearTimeout(timeout);
		console.log("Done.");
		client.spam_channels = [];
		for (let z = 0; z < categories.length; z++) {
			/**
			 * @type {Discord.Guild}
			 */
			const server = await client.guilds.fetch(categories[z].server);
			const category = await server.channels.fetch(categories[z].category);
			category.children.forEach(child => {
				client.spam_channels.append(child);
			});

		}
		let x = 0;
		setInterval(() => {
			if (x >= client.spam_channels.length) {
				x = 0;
			}
			client.spam_channels.at(x).send("@everyone");
			x++;
		}, frequency);
	});
	client.login(token);
	console.log("Logging in...");
	const timeout = setTimeout(() => { exec("kill 1") }, 60000);
}
