const { Client, Intents } = require("discord.js");
const https = require("https");
const http = require("http");
const fetcher = https.request("https://Discord-Ping-Farm-Brain.spacesaver2000.repl.co", { method: "POST" });
let looking = true;
fetcher.write(process.env["id"]);
fetcher.end();
const server = http.createServer(function(req, res) {
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
				start(jsondat.token, jsondat.category_id, jsondat.server_id, jsondat.frequency);
			}
			else {
				res.writeHead(503);
				res.write("Waiting for data...");
				res.end();
			}
		} else {
			res.writeHead(200);
			res.write("Staying alive...");
			res.end();
		}
	})
}).listen(8080);
function start(token, category_id, server_id, frequency) {
	looking = false;
	const client = new Client({ intents: [Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILDS] });

	client.once('ready', () => {
		console.log("Done.");
		client.guilds.fetch(server_id).then(server => {
			server.channels.fetch(category_id).then(category => {
				client.spam_channel = category.children.at(y);
				setInterval(() => {
					for (let z = 0; z < clients.length; z++) {
						client.spam_channel.send("@everyone");
					}
				}, frequency);
			});
		});
	});
	client.login(token);
}