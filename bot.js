const Discord = require("discord.js"),
	sql = require("sqlite"),
	winston = require("winston"),
	fs = require("fs"),
	execSync = require("child_process").execSync,
	config = require("./config.json"),
	auth = require("./auth.json"),
	responses = require("./responses.json");
// Logger initialization start------------------

// Creating a log folder if it doesn't exist
if (!fs.existsSync(config.logDirectory)) {
	fs.mkdirSync(config.logDirectory);
}

const { combine, timestamp, printf } = winston.format,
	myFormat = printf(info => {
		return `${info.timestamp} ${info.message}`;
	}),
	logger = winston.createLogger({
		format: combine(timestamp(), myFormat),
		transports: [
			new winston.transports.Console({
				level: "info"
			}),
			new winston.transports.File({
				filename: `${config.logDirectory}/${config.logFilename}`,
				level: "info"
			})
		]
	});
// Logger initialization end--------------------

//Handling commands
const handler = {
	get: function(message, itemName) {
		// Checking if user provided the name of the item.
		if (!itemName) {
			message.reply(responses.whatGet);
		} else if (itemName === "name") {
			message.reply(responses.badInput);
		} else {
			const { username, id } = message.author;
			logger.info(
				`GET!    Username->${username} AuthorID->${id} ItemName->${itemName}`
			);

			sql
				.get(`SELECT * FROM items WHERE name="${itemName}"`)
				.then(row => {
					if (!row) {
						//The item doesn't exist.
						message.reply(responses.couldntGet);
					} else {
						message.reply(row.source);
					}
				})
				.catch(error => {
					message.reply(responses.error);
					logger.info(error);
				});
		}
	},

	create: function(message, itemName, source) {
		// Checking if user provided the name for the new item.
		if (!itemName) {
			message.reply(responses.provideNameAndUrl);
		}
		// This string can cause vulnerability in the SQL below.
		else if (itemName === "name") {
			message.reply(responses.badInput);
		}
		// Checking if user provided the url for the new item.
		else if (!source) {
			message.reply(responses.provideUrl);
		} else {
			const { username, id } = message.author;
			logger.info(
				`CREATE! Username->${username} AuthorID->${id} ItemName->${itemName} Source->${source}`
			);

			// Checking if the item with this name already exists.
			sql
				.get(`SELECT * FROM items WHERE name="${itemName}"`)
				.then(row => {
					if (!row) {
						// We can use the name for the new item.
						sql
							.run("INSERT INTO items (userID,name,source) VALUES (?,?,?)", [
								id,
								itemName,
								source
							])
							.then(() => {
								message.reply(`${responses.createSuccess} ${itemName}!`);
							})
							.catch(error => {
								message.reply(responses.error);
								logger.info(error);
							});
					} else {
						// The item with this name already exists.
						message.reply(responses.existingItem);
					}
				})
				.catch(error => {
					message.reply(responses.error);
					logger.info(error);
				});
		}
	},

	delete: function(message, itemName) {
		// Checking if user provided the name of the item.
		if (!itemName) {
			message.reply(responses.provideName);
		}
		// This string can cause vulnerability in the SQL below.
		else if (itemName === "name") {
			message.reply(responses.badInput);
		} else {
			const { username, id } = message.author;
			logger.info(
				`DELETE! Username->${username} AuthorID->${id} ItemName->${itemName}`
			);

			// Checking permissions for this item.
			sql
				.get(`SELECT * FROM items WHERE name="${itemName}"`)
				.then(row => {
					if (!row) {
						// The item doesn't exist.
						message.reply(responses.couldntGet);
					}
					// Checking if user is the author of the item, or has a role of Administator/ Moderator.
					else if (
						message.author.id === row.userID ||
						message.member.roles.some(r =>
							["Administrator", "Moderator"].includes(r.name)
						)
					) {
						sql
							.run(`DELETE FROM items WHERE name="${itemName}"`)
							.then(() => {
								message.reply(`${responses.deleteSuccess} ${itemName}!`);
							})
							.catch(error => {
								message.reply(responses.error);
								logger.info(error);
							});
					} else {
						message.reply(responses.noPermissionsDelete);
					}
				})
				.catch(error => {
					message.reply(responses.error);
					logger.info(error);
				});
		}
	},

	help: function(message, command) {
		const { username, id } = message.author;
		logger.info(`HELP!   Username->${username} AuthorID->${id}`);

		if (command) {
			switch (command) {
			case "get":
				message.reply(responses.helpGet);
				break;
			case "help":
				message.reply(responses.helpHelp);
				break;
			case "create":
				message.reply(responses.helpCreate);
				break;
			case "delete":
				message.reply(responses.helpDelete);
				break;
			case "edit":
				message.reply(responses.helpEdit);
				break;
			case "random":
				message.reply(responses.helpRandom);
				break;
			case "items":
				message.reply(responses.helpItems);
				break;
			case "wiki":
				message.reply(responses.helpWiki);
				break;
			default:
				message.reply(responses.helpDefault);
				break;
			}
		} else {
			message.reply(responses.help);
		}
	},

	edit: function(message, itemName, source) {
		if (!itemName) {
			message.reply(responses.provideNameAndUrl);
		}
		// This string can cause vulnerability in the SQL below.
		else if (itemName === "name") {
			message.reply(responses.badInput);
		} else if (!source) {
			message.reply(responses.provideUrl);
		} else {
			const { username, id } = message.author;
			logger.info(
				`EDIT!   Username->${username} AuthorID->${id} itemName->${itemName} source->${source}`
			);

			sql
				.get(`SELECT * FROM items WHERE name="${itemName}"`)
				.then(row => {
					if (!row) {
						// This item doesn't exist.
						message.reply(responses.couldntGet);
					}
					// Checking if user is the author of the item, or has a role of Administator/ Moderator.
					else if (
						message.author.id === row.userID ||
						message.member.roles.some(r =>
							["Administrator", "Moderator"].includes(r.name)
						)
					) {
						sql
							.run(
								`UPDATE items SET source="${source}" WHERE name="${itemName}"`
							)
							.then(() => {
								message.reply(`${responses.editSuccess} ${itemName}!`);
							})
							.catch(error => {
								message.reply(responses.error);
								logger.info(error);
							});
					} else {
						message.reply(responses.editNoPermissions);
					}
				})
				.catch(error => {
					message.reply(responses.error);
					logger.info(error);
				});
		}
	},

	items: function(message, search) {
		const { username, id } = message.author;
		logger.info(`ITEMS!  Username->${username} AuthorID->${id}`);

		sql
			.all("SELECT * FROM items")
			.then(rows => {
				if (rows.length === 0) {
					message.reply(responses.noItems);
				} else {
					let items = search ? responses.itemsSearch : responses.items;
					if (search) {
						rows = rows.filter(item => item.name.includes(search));
					}
					if (rows.length === 0) {
						message.reply(responses.itemsSearchCouldntFind);
					} else {
						items += "| ";
						rows.forEach(row => {
							items += row.name + " | ";
						});
						message.reply(items);
					}
				}
			})
			.catch(error => {
				message.reply(responses.error);
				logger.info(error);
			});
	},

	random: function(message, contains) {
		const { username, id } = message.author;
		logger.info(`RANDOM! Username->${username} AuthorID->${id}`);

		sql
			.all("SELECT * FROM items")
			.then(rows => {
				if (contains) {
					rows = rows.filter(item => item.name.includes(contains));
				}
				if (rows.length === 0) {
					message.reply(contains ? responses.couldntRandom : responses.noItems);
					return;
				}
				const numberOfItems = rows.length;
				const rand = Math.floor(Math.random() * numberOfItems);
				message.reply(responses.random + rows[rand].source);
			})
			.catch(error => {
				logger.info(error);
				message.reply(responses.error);
			});
	},

	wiki: function(message, search) {
		const { username, id } = message.author;
		logger.info(
			`WIKI!   Username->${username} AuthorID->${id} Search->${search}`
		);
		if (search) {
			message.reply(`<http://eurekaseven.wikia.com/wiki/${search}>`);
		} else {
			try {
				const randomArticle = execSync(
					"curl -Ls -o /dev/null -w %{url_effective} http://eurekaseven.wikia.com/wiki/Special:Random"
				).toString();
				message.reply(randomArticle);
			} catch (e) {
				logger.info("ERROR: " + e);
				message.reply(responses.error);
			}
		}
	}
};

// Georg logic starts here
const client = new Discord.Client();

client.on("ready", () => {
	logger.info("GEORG LOGGED IN!");
});
client.on("message", message => {
	// Ignore the bots and direct messages.
	if (message.author.bot || message.channel.type === "dm") return;
	console.log(message.content);

	const parameters = message.content.split(" ");

	// Check if the message starts with the 'get' alias defined in config.json.
	if (message.content.indexOf(config.getAlias) === 0) {
		const itemName = parameters[1];
		handler.get(message, itemName);
		return;
	}
	//Check if the bot is mentioned.
	if (message.isMentioned(client.user.id)) {
		// First parameter should be a command.
		if (parameters[1]) {
			switch (parameters[1]) {
			case "create": {
				const itemName = parameters[2],
					source = parameters[3];
				handler.create(message, itemName, source);
				break;
			}
			case "delete": {
				const itemName = parameters[2];
				handler.delete(message, itemName);
				break;
			}
			case "help": {
				const command = parameters[2];
				handler.help(message, command);
				break;
			}
			case "edit": {
				const itemName = parameters[2],
					source = parameters[3];
				handler.edit(message, itemName, source);
				break;
			}
			case "items": {
				const search = parameters[2];
				handler.items(message, search);
				break;
			}
			case "random": {
				const contains = parameters[2];
				handler.random(message, contains);
				break;
			}
			case "wiki": {
				const search = parameters[2];
				handler.wiki(message, search);
				break;
			}
			case "get": {
				const itemName = parameters[2];
				handler.get(message, itemName);
				break;
			}
			default: {
				break;
			}
			}
		}
	}
});
client.on("error", error => logger.info(error));
client.on("reconnecting", () => logger.info("RECONNECTING"));
client.on("resumed", () => logger.info("RESUMED"));

// Launches the bot and sets the timer for backup.
function launchBot() {
	client
		.login(auth.token)
		.then(() => {
			//Backup timeout.
			client.setTimeout(backup, config.backupInterval);
		})
		.catch(error => {
			logger.info(error);
			logger.info("Trying again in 10 seconds");
			setTimeout(launchBot, 10000);
		});
}
// Stops the client and executes the backup script. Then revives the bot.
function backup() {
	client
		.destroy()
		.then(() => {
			try {
				logger.info(execSync("sh backup.sh").toString());
				setTimeout(launchBot, 1000);
			} catch (e) {
				logger.info("ERROR: " + e);
			}
		})
		.catch(error => {
			logger.info(error);
			logger.info("Destroying the client again in 5 seconds.");
			setTimeout(backup, 5000);
		});
}
function healthcheck() {
	logger.info("Status: " + client.status + " ping: " + client.ping);
}

setInterval(healthcheck, 60000);
// Open the database connection.
sql.open("./items.sqlite");
launchBot();
