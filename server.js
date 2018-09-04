var spawn = require('child_process').spawn;
var execSync = require('child_process').execSync;
startBot();
function startBot(){
	var botProcess = spawn('node', ['bot.js']);
	
	botProcess.stdout.on('data', function(data){
		console.log(`STDOUT: ${data.toString()}`);
	});
	
	botProcess.stderr.on('data', function(data){
		console.log(`STDERR: ${data.toString()}`);
	});
	
	botProcess.on('close', function(code){
		console.log('bot closed with code' + code);
		delete botProcess;
		backupSpawn();
	});
	
	setTimeout(function(){
		console.log('KILLING BOT');
		botProcess.kill();
	}, 20000);

	function backupSpawn(){
	console.log('Backup running------------------------------------');
	execSync('sh backup.sh', function(error,stdout,stderr){
		console.log('STDOUT:' + stdout);
		console.log('STDERR:' + stderr);
	});
	console.log('Backup ENDED-------------------------------------');
	setTimeout(startBot,5000);
	}
	
	
	function checkIfKilled(proc){
		if( !proc.killed ) {
			checkIfKilled(proc);
		}
		return proc.killed;
	}



	
}


