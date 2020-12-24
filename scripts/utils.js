const 
    config = require('../config'),
    { MessageEmbed } = require('discord.js'),
    logger = require('./logger'),
    botclient = require('../app.js').client;
/**
 * Creates a MessageEmbed to display errors.
 *
 * @param {String} title       the title of the embed
 * @param {Color}  color       the colour of the embed
 * @param {String} description the description of the embed
 */
function createErrorEmbed(title, color, description) {
    return new MessageEmbed()
        .setTitle(title)
        .setColor(color)
        .setDescription(description);
}

/**
 * Updates an already sent embedded message.
 *
 * @param {MessageEmbed} oldEmbed the targetted embedded message
 * @param {MessageEmbed} newEmbed the updated embedded message to replace the target
 */
async function editEmbed(oldEmbed, newEmbed) {
    if (!oldEmbed.deleted && oldEmbed.editable) oldEmbed.edit(newEmbed).catch(error => { logger.error('utils.js editEmbed()', error) });
}

const 
    staff_roles = config.staffRoles,
    owner_ids = [config.ownerID,config.ownerIDs]
    levels = [0,1,2];//Everyone, Staff,Owner/Admin
function getPermission(member){
    return levels[2]
    staff = member.roles.cache.keyArray().filter(x => staff_roles.includes(x)).length
    owner = owner_ids.includes(member.id)
    if(owner || member.permissions.has(8)){
        return levels[2]
    }else if(staff){
        return levels[1]
    }else return levels[0]
}
function parseTime(t){
    time = null ; 
    if(t.endsWith('d')){
        time = Number(t.slice(0,-1))/30
    }else if(t.endsWith('w')){
        time = Number(t.slice(0,-1))/4
    }else if(t.endsWith('m')){
        time = Number(t.slice(0,-1))    
    }else{
        time = Number(t)
    }

    if(typeof time == 'number'){
        return time
    }else {
        return false
    }
}
function Handle(error,message){
    logger.error('Error Handle',error)
    if(message)message.channel.send(`\`\`\`Encountered error: ${error} \`\`\``)
    return
}

module.exports = {
    parseTime,
    getPermission,
    Handle,
    data : {
        staff_roles,
        owner_ids,
        levels
    },
    Error(str, ID, Title, Color, fields) {
        const Embed_Error = new MessageEmbed()
            .setAuthor(botclient.user.username, botclient.user.avatarURL)
            .setDescription(str)
            .setTitle(Title || 'Error')
            .setColor('RED' || Color)
            .setFooter(ID || 'No ID given')
            .setTimestamp();
        if (fields) {
            fields.forEach(x => {
                const key = Object.keys(x)[0];
                Embed_Error.add(key, x[key]);
            });
        }

        return Embed_Error;
    },
    client: botclient,
    createErrorEmbed,
    editEmbed,
}