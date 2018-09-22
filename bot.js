const Discord = require("discord.js");
const client = new Discord.Client();
const auth = require("./auth.json");
const fs = require("fs");
const request = require("request");
const sql = require("sqlite");

sql.open("./commands.sqlite");

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

    sql.get(`SELECT * FROM commands WHERE name="${secondParameter}"`).then(row => {
        if (!row) {
            message.reply("couldn't find the resource :(");
        }
        else {
            message.reply(row.source);
        }
    });
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
    const author = message.author.id;

    sql.get(`SELECT * FROM commands WHERE name="${itemName}"`).then(row => {
        if (!row) {
            sql.run("INSERT INTO commands (userID,name,source) VALUES (?,?,?)", [author, itemName, source]);
            console.log(`${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}---->CREATED COMMAND!:
          Author: ${author}
          Item Name: ${itemName}
          source: ${source}`);
            message.reply(`success! created ${itemName}!`);
            return;
        }
        else {
            message.reply("there's already a resource with this name. Use `edit` command to edit it :)");
            return;
        }
    })
}

function handleDelete(message, command) {

    const itemName = command[2];
    if (!itemName) {
        message.reply("you have to provide me with a name of the item :/");
        return;
    }

    sql.get(`SELECT * FROM commands WHERE name="${itemName}"`).then(row => {
        if (!row) {
            message.reply(
                "sorry, I can\'t find it..."
            );
        }
        else if (message.author.id === row.userID || message.member.roles.some(r => ["Administrator", "moderator"].includes(r.name))) {
            sql.run(`DELETE FROM commands WHERE name="${itemName}"`);
            console.log(`${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}---->DELETED COMMAND!:
            Item Name: ${itemName} by ${message.author.id}`);
            message.reply(`deleted ${itemName} from resources :)`);
        }
        else {
            message.reply("you do not have permissions to delete this resource:/");
        }
    });
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
            case georgDirectives.random:
                message.reply(
                    "I'll bring you the most random thing I can find!"
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
            `\`georg random\`\n` +
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
    const author = message.author.id;

    sql.get(`SELECT * FROM commands WHERE name="${itemName}"`).then(row => {
        if (!row) {
            message.reply("sorry, can't find it...");
        }
        else if (message.author.id === row.userID || message.member.roles.some(r => ["Administrator", "moderator"].includes(r.name))) {
            sql.run(`UPDATE commands SET source="${source}" WHERE name="${itemName}"`);
            console.log(`${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}---->EDITED COMMAND!:
            Item Name: ${itemName} by ${message.author.id}`);
            message.reply(`edited item ${itemName}!`);
        }
        else {
            message.reply("you don't have permissions to edit this item...");
        }
    });
}

function handleCommands(message, command) {
    let cmds = "Availible commands:\n";

    sql.all("SELECT * FROM commands").then(rows => {
        if (!rows) {
            message.reply('there are no commands yet :(');
        }
        else {
            rows.forEach(row => {
                cmds += row.name + "\n";
            });
            message.reply(cmds);
        }
    })
}

function handleRandom(message, command) {

    sql.all("SELECT * FROM commands").then(rows => {
        let numberOfItems = rows.length;
        const rand = Math.floor(Math.random() * numberOfItems);
        message.reply("the most random thing I found!\n" + rows[rand].source);
    })

}

client.on("ready", () => {
    console.log(`${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}---->${client.user.username} logged in!`);
});

client.on("message", message => {
    if (message.author.bot) return;
    if (message.channel.type !== 'dm' && message.content.substring(0, 5).toLowerCase() === "georg") {
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
