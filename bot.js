const Discord = require('discord.js');
const client = new Discord.Client();
const auth = require('./auth.json');
const fs = require('fs');
const request = require('request');

var commands = require('./commands.json');

const nirvashDirectives = {
    get: "get",
    create: "create",
    delete: "delete",
    help: "help"
};

function handleGet(message, command) {
    const secondParameter = command[2];
    const resource = commands[secondParameter];

    if (!resource) {
        message.reply("Couldn't find the resource, mukyuuu :(");
    } else {
        switch (resource.type) {
            case "gif":
            case "image":
                message.channel.send('Here you go, mukyuuu!', {
                    files: [
                        resource.source
                    ]
                });
                break;
            case "video":
                message.reply("Here you go, mukyuu!\n" +
                    resource.source
                );
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
        "source": source
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

function handleHelp(message,command) {

    if ( command[2] ) {
        switch(command[2]){
            case nirvashDirectives.get:
                message.channel.send(
                    'If you provide me a name of the asset,' +
                    ' I\'ll provide it to you, mukyuu.'
                );
                break;
            case nirvashDirectives.help:
                message.channel.send(
                    'What do you think it does, dummy...'
                );
                break;
            case nirvashDirectives.create:
                message.channel.send(
                    'If you provide me with a name for the new item,' +
                    ' a type and an url,' +
                    ' I\'ll create a new item for you, mukyuuu.'
                );
                break;
            case nirvashDirectives.delete:
                message.channel.send(
                    'If you provide me with a name of the asset,' +
                    ' I can delete it for you, mukyuuu.'
                );
                break;
            default:
                break;
        }
    }
    else {
        message.channel.send(
            'Here\'s the list of commands, mukyuuu!\n' +
            '\`nirvash get NAME_OF_ITEM\`\n' +
            '\`nirvash create NAME_OF_ITEM TYPE_OF_ITEM LINK\`\n' +
            '\`nirvash delete NAME_OF_ITEM\`\n' +
            'For more information, type \`nirvash help COMMAND\`\n'
        );
    }
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

            case nirvashDirectives.help:

                handleHelp(message,command);
                break;
        }
    }



});

client.login(auth.token);
