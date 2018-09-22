var spawn = require('child_process').spawn;
var execSync = require('child_process').execSync;
startBot();

function startBot() {
	var botProcess = spawn('node', ['bot.js']);

	botProcess.stdout.on('data', function (data) {
		console.log(`${data.toString()}`);
	});

	botProcess.stderr.on('data', function (data) {
		console.log(`STDERR: ${data.toString()}`);
	});

	botProcess.on('close', function () {
		console.log(`${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}---->Deleting bot process and spawning backup process`);
		delete botProcess;
		backupSpawn();
	});

	setTimeout(function () {
		console.log(`${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}---->KILLING BOT`);
		botProcess.kill();
	}, 180000);

	function backupSpawn() {
		console.log(`${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}---->Backup running------------------------------------`);
		execSync('sh backup.sh', function (error, stdout, stderr) {
			console.log('STDOUT:' + stdout);
			console.log('STDERR:' + stderr);
		});
		console.log(`${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}---->Backup ended------------------------------------`);
		console.log(`${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}---->REVIVING BOT`);

		setTimeout(startBot, 0);
	}


	function checkIfKilled(proc) {
		if (!proc.killed) {
			checkIfKilled(proc);
		}
		return proc.killed;
	}

}
