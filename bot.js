const Discord = require("discord.js");
const client = new Discord.Client();
const auth = require("./auth.json");
const fs = require("fs");
const request = require("request");

var commands = require("./commands.json");

const georgDirectives = {
  get: "get",
  create: "create",
  delete: "delete",
  help: "help",
  edit: "edit",
  commands: "commands",
  random: "random"
};

function handleGet(message, command) {
  const secondParameter = command[2];
  if (!secondParameter) {
    message.reply("what do you want me to get?");
    return;
  }
  const resource = commands[secondParameter];

  if (!resource) {
    message.reply("couldn't find the resource :(");
  } else {
    message.reply("here you go!\n" + resource.source);
  }
}

function handleCreate(message, command) {
  const itemName = command[2];
  if (!itemName) {
    message.reply(
      "you have to provide me with a name for the item and an url :)"
    );
    return;
  }
  const source = command[3];
  if (!source) {
    message.reply("you have to provide me with an url for the item :)");
    return;
  }
  const author = message.author.username;
  if (commands[itemName]) {
    message.reply(
      "there's already a resource with this name. Use `edit` command to edit it :)"
    );
    return;
  }

  commands[itemName] = {
    author: author,
    source: source
  };
  fs.writeFile(
    "./commands.json",
    JSON.stringify(commands, null, "\t"),
    function() {
      console.log(`CREATED COMMAND!:
          Author: ${author}
          Item Name: ${itemName}
          source: ${source}`);
    }
  );
  message.reply(`success! created ${itemName}!`);
}

function handleDelete(message, command) {
  const itemName = command[2];
  if (!itemName) {
    message.reply("you have to provide me with a name of the item :/");
    return;
  }
  if (
    commands[itemName] &&
    message.author.username === commands[itemName].author
  ) {
    delete commands[itemName];

    fs.writeFile(
      "./commands.json",
      JSON.stringify(commands, null, "\t"),
      function() {
        console.log(`DELETED COMMAND!:\n
            Item Name: ${itemName}\n`);
        message.reply(`deleted ${itemName} from resources :)`);
      }
    );
  } else {
    message.reply(
      "sorry, this item either does not exist or you do not have permissions to delete this resource :/"
    );
  }
}

function handleHelp(message, command) {
  if (command[2]) {
    switch (command[2]) {
      case georgDirectives.get:
        message.reply(
          "If you provide me a name of the asset,\n" +
            " I'll provide it to you. for eg.\n" +
            "`georg get niji`"
        );
        break;
      case georgDirectives.help:
        message.reply("What do you think it does, dummy...");
        break;
      case georgDirectives.create:
        message.reply(
          "If you provide me with a name for the new item\n" +
            " and an url," +
            " I'll create a new item for you. For eg.\n" +
            "`georg create niji https://www.google.com`"
        );
        break;
      case georgDirectives.delete:
        message.reply(
          "If you provide me with a name of the asset,\n" +
            " I can delete it for you if you are the author. For eg.\n" +
            "`georg delete niji`"
        );
        break;
      case georgDirectives.edit:
        message.reply(
          "If you provide me with a name of the asset,\n" +
            " I can edit it for you if you are the author. for eg.\n" +
            "`georg edit niji https://www.bing.com`"
        );
        break;
      default:
        message.reply(
          "I did not recognize this command :/ type `georg help` for more info."
        );
        break;
    }
  } else {
    message.reply(
      `Here\'s the list of commands!\n` +
        `\`georg get NAME_OF_ITEM\`\n` +
        `\`georg create NAME_OF_ITEM LINK\`\n` +
        `\`georg delete NAME_OF_ITEM\`\n` +
        `\`georg edit NAME_OF_ITEM LINK\`\n` +
        `For more information, type \`georg help COMMAND\``
    );
  }
}
function handleEdit(message, command) {
  const itemName = command[2];
  if (!itemName) {
    message.reply(`you have to provide me with a name of the item and an url!`);
    return;
  }
  const source = command[3];
  if (!source) {
    message.reply(`you have to provide me with an url for the resource!`);
    return;
  }
  const author = message.author.username;
  if (
    commands[itemName] &&
    message.author.username === commands[itemName].author
  ) {
    commands[itemName] = {
      author: author,
      source: source
    };
    fs.writeFile(
      "./commands.json",
      JSON.stringify(commands, null, "\t"),
      function() {
        console.log(`EDITED COMMAND!:
          Author: ${author}
          Item Name: ${itemName}
          source: ${source}`);
      }
    );
    message.reply(`edited item ${itemName}!`);
  } else {
    message.reply(
      "you either not have permissions to edit this item, or it doesn't exist :/"
    );
  }
}

function handleCommands(message, command) {
  let cmds = "Availible commands:\n";
  for (item in commands) {
    cmds += item + "\n";
  }
  message.reply(cmds);
}

function handleRandom(message, command) {
  let numberOfItems = 0;
  for (key in commands) {
    numberOfItems++;
  }

  const rand = Math.floor(Math.random() * numberOfItems);
  let itemNumber = 0;
  for (key in commands) {
    if (itemNumber === rand) {
      message.reply("the most random thing I found!\n" + commands[key].source);
      break;
    }
    itemNumber++;
  }
}

client.on("ready", () => {
  console.log(`${client.user.username} logged in!`);
});

client.on("message", message => {
  if (message.content.substring(0, 7).toLowerCase() === "georg") {
    const command = message.content.split(" ");
    const firstParameter = command[1];

    switch (firstParameter) {
      case georgDirectives.get:
        handleGet(message, command);
        break;

      case georgDirectives.create:
        handleCreate(message, command);
        break;

      case georgDirectives.delete:
        handleDelete(message, command);
        break;

      case georgDirectives.help:
        handleHelp(message, command);
        break;
      case georgDirectives.edit:
        handleEdit(message, command);
        break;
      case georgDirectives.commands:
        handleCommands(message, command);
        break;
      case georgDirectives.random:
        handleRandom(message, command);
        break;
    }
  }
});

client.login(auth.token);
