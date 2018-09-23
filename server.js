var spawn = require('child_process').spawn;
var execSync = require('child_process').execSync;
const logDir = "log";
const fs = require("fs");
const winston = require("winston");


if (!fs.existsSync(logDir)) {
	fs.mkdirSync(logDir);
}

const {
	combine,
	timestamp,
	printf
} = winston.format;
const myFormat = printf(info => {
	return `${info.timestamp} ${info.message}`;
});
const logger = winston.createLogger({
	format: combine(
		timestamp(),
		myFormat
	),
	transports: [
		// colorize the output to the console
		new(winston.transports.Console)({
			colorize: true,
			level: "info"
		}),
		new(winston.transports.File)({
			filename: `${logDir}/serverLog.txt`,
			level: "info"
		})
	]
});

startBot();

function startBot() {
	var botProcess = spawn('node', ['bot.js']);

	botProcess.stdout.on('data', function (data) {
		console.log(data.toString());
	});

	botProcess.stderr.on('data', function (data) {
		console.log(`STDERR: ${data.toString()}`);
	});

	botProcess.on('close', function () {
		logger.info(`DELETING BOT PROCESS AND SPAWNING BACKUP PROCESS.`);
		delete botProcess;
		backupSpawn();
	});

	setTimeout(function () {
		logger.info(`KILLING BOT`);
		botProcess.kill();
	}, 10800000);
	//3hours
	function backupSpawn() {
		logger.info(`BACKUP RUNNING------------------------------------`);
		logger.info("\n" + execSync('sh backup.sh').toString());
		logger.info("BACKUP DONE---------------------------------------");
		logger.info("REVIVING BOT PROCESS");

		setTimeout(startBot, 0);
	}


	function checkIfKilled(proc) {
		if (!proc.killed) {
			checkIfKilled(proc);
		}
		return proc.killed;
	}

}
