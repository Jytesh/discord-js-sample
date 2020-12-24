const 
    utils = require('../scripts/utils'),
    { MessageEmbed } = require('discord.js'),
    config = require('../config.js'),
    path = require("path"),
    logger = require("../scripts/logger");

module.exports = {
    name: 'help',
    path: __filename,
    aliases: ['h'],
    usage: 'help <module>',
    user: 'Everyone',
    perms : 0,
    description: 'Use this command to learn about the usage of all other commands or a specific <module>',
    run: async(client, receivedMessage) => {
        logger.debug('help.js()','ENTERING')

        let fullCommand = receivedMessage.content.substring(1) // Remove the leading exclamation mark
        let splitCommand = fullCommand.split(" ") // Split the message up in to pieces for each space
    
        let arguments = splitCommand.slice(1) // All other words are arguments/parameters/options for the command
    
        if (arguments.length == 0) {
            let botHelpMsg = "My Prefix is `" + config.prefix + "`\nTo get help on a specific module, do `help <module>` Currently available modules are"
            let modules = client.commands.keyArray();
            let module_list = modules.map(x => "> " + x)
            module_list.unshift(botHelpMsg);
            //let module_list = "`>" + modules.join("`\n`>") + `\``;
            let embed = new MessageEmbed()
                .setTitle("Help Window")
                .setAuthor(client.user.username, client.user.avatarURL)
                .setDescription(module_list)
                .setColor("BLURPLE")
            receivedMessage.channel.send(embed)
        }
        if (arguments.length === 1) {
            let arg = arguments[0]
            if (client.commands.has(arg)) {
    
                command = client.commands.get(arg)
                let embed = new MessageEmbed()
                    .setTitle(command.config.name)
                    .setDescription(command.help.description)
                    .addField('Usage:', "`" + command.help.usage + "`")
                    .setTimestamp()
                    .setColor('BLURPLE')
                    .setFooter("Coded by " + (command.config.author || "Jytesh#3241"))
    
                receivedMessage.channel.send(embed)
            }
    
        }

        logger.debug('help.js()','EXITING')
    }
}

String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1)
}