const 
    Discord = require("discord.js"),
    client = new Discord.Client(),
    bot = require('./package.json'),
    config = require("./config.js"),
    token = config.token,
    fs = require('fs'),
    logger = require("./scripts/logger"),
    utils = require("./scripts/utils"),
    { Handle } = require("./scripts/utils");

module.exports = {
    client: client,
};
(function login() {
    logger.debug('app.js login()', 'ENTERING');

    // File loader for commands and reactions

    client.commands = new Discord.Collection
    client.aliases = new Discord.Collection();


    // Load in commands
    
    logger.debug('app.js commandBinder()', 'ENTERING');
    fs.readdir("./commands/", (err, files) => {
        if (err) return console.error(err);
        let jsfile = files.filter(f => f.split(".").pop() === "js");
        if (jsfile.length <= 0) return console.log("[KB Bot] There aren't any commands!"); //JJ has fucked up
        jsfile.forEach((f, i) => {
            const pull = require(`./commands/${f}`)
            client.commands.set(pull.name, pull);
            client.aliases.set(pull.aliases,pull.name)
        });
    });
    logger.debug('app.js commandBinder()', 'EXITING');

    client.login(token).catch(error => { console.log('client.login', error) });
    
    logger.debug('app.js login()','EXITING')
})();

client.on('ready',async()=>{
    logger.info("Bot Online!")
    client.user.setStatus('online');
    client.user.setActivity(`for ${config.prefix}help @v${bot.version}`, { type: 'WATCHING' });

})
client.on('message', async(message) => {
    logger.debug('app.js client.on(\'message\', () => (...))', 'ENTERING');

    if (message.author.bot || !message.guild) { return logger.debug(`app.js client.on('message', () => (...))', 'Message is ${message.author.bot ? 'from bot' : 'not from guild'}'`) } // Ignore bot messages and DMs

    logger.debug('MESSAGE:', `${message}`);
    logger.debug('GUILD:', `${message.guild.name}`)

    // Getting server prefix
    let prefix = config.prefix
    
    if (message.content == `<@!${client.user.id}>`) { message.channel.send('My prefix is `' + prefix + '`') } // Ping bot for prefix

    if (message.content.startsWith(prefix)) { 
        // Ignores messages that don't start with prefix elsewise 
        const command = message.content.substring(1).split(' ')[0].toLowerCase(); // Command itself

        const permsIn = message.guild.me.permissionsIn(message.channel).missing(388160); // Checking for perms
        if (permsIn.length > 0) { return message.channel.send(`I am missing **${permsIn.join(' and ')}** permissions,\nPlease give me perms`) }

        if (command) {
            // This will look for the command's file by searching it in names and aliases.
            const commandFile = client.commands.get(command) || client.commands.get(client.aliases.get(command));
            if (commandFile) { // If it finds the command, it will run it
                logger.info(`======================== ===\nCOMMAND: ${command} \nARGS: ${message.content.split(' ').splice(1).join(', ')} \n=== ========================`);
                const args = message.content.split(' ').splice(1);
                const perms = utils.getPermission(message.member);
                if(commandFile.perms > perms) return
                commandFile.run(client, message,args,perms);
            }
        }
    }

    logger.debug('app.js client.on(\'message\', () => (...))', 'EXITING');
});

client.login(token,{disableEveryone:true})