const Discord = require('discord.js');
const client = new Discord.Client();
const auth = require('./auth.json');
const fs = require('fs');
const request = require('request');

var commands = require('./commands.json');

const nirvashDirectives = {
    get: "get",
    create: "create",
    delete: "delete"
};

function handleGet(message, command) {
    const secondParameter = command[2];
    const resource = commands[secondParameter];

    if (!resource) {
        message.reply("Couldn't find the resource, mukyuuu :(");
    } else {
        switch (resource.type) {
            case "image":
                message.channel.send('Here you go, mukyuuu!', {
                    files: [
                        resource.source
                    ]
                });
                break;
        }
    }
}

function handleCreate(message, command) {

    const itemName = command[2];
    const itemType = command[3];
    const source = command[4];

    commands[itemName] = {
        "type": itemType,
        "source": itemValue
    }
    fs.writeFile('./commands.json', JSON.stringify(commands, null, '\t'), function() {
        console.log(`UPDATED COMMAND!:\n
          Item Name: ${itemName}\n
          type: ${itemType}\n
          source: ${source}\n`);
    })
}
function handleDelete(message, command) {

  const itemName = command[2];
  delete commands[itemName];

  fs.writeFile('./commands.json', JSON.stringify(commands, null, '\t'), function() {
      console.log(`DELETED COMMAND!:\n
        Item Name: ${itemName}\n`
      );
  })


}



client.on('ready', () => {
    console.log(`${client.user.username} logged in!`);
});

client.on('message', message => {
    if (message.content.substring(0, 7).toLowerCase() === "nirvash") {
        const command = message.content.split(' ');
        const firstParameter = command[1];

        switch (firstParameter) {
            case nirvashDirectives.get:
                handleGet(message, command);
                break;

            case nirvashDirectives.create:

                handleCreate(message, command);
                break;

            case nirvashDirectives.delete:

                handleDelete(message,command);
                break;

        }
    }



});

client.login(auth.token);
