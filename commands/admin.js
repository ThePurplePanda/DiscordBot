exports.channel = function(message, args) {
    if (args[0] === 'list') {
        //TODO
        message.channel.send(`**The following channels shortcuts are available: **Currently Bugged #TODO**`);
    }
    else if (args[0] === 'set') {
        if(!args[1] || !args[2]){
            message.channel.send("Specify a role and a channel to assign it to!");
        }
        var id_rx = /^<#([0-9]+)>$/g;
        var id = id_rx.exec(args[2]);
        id = id ? id[1] : args[2];
        var channel = global.util.getChannel({id: id, type: 'text'});
        if(channel === undefined){
            message.channel.send("Could not find the channel!");
        }
        else{
            global.database.setSpecialChannel(args[1], channel.id, channel.name, message.channel);
            global.util.updateSpecialChannels(message.channel,`Successfully set channel ${args[2]} as the ${args[1]} channel`);
        }
    }
    else if(args[0] === 'remove'){
        if(!args[1]){
            message.channel.send("Specify a role to remove!");
        }
        global.database.removeSpecialChannel(args[1]);
        global.util.updateSpecialChannels(message.channel, `Successfully removed the ${args[1]} channel role`);
    }
    else {
        message.channel.send(`**Info for** ${message.channel}`);
        message.channel.send(`**ID:** ${message.channel.id}`);
    }
    return;
}

exports.emotelist = function(message, args) {
    const emojiList = message.guild.emojis.map(e => e.toString()).join(` `);
    message.channel.send(emojiList);
    return;
}  

exports.devmode = function(message, args) {
    if (global.devMode) {
        message.channel.send(`Disabling DevMode. Who needs all those nerdy stats anyways.`);
        global.devMode = false;
    }
    else {
        message.channel.send(`Enabling DevMode. Do your best!`);
        global.devMode = true;
    }
    return;
}

exports.cleanmode = function(message, args) {
    if (global.cleanMode) {
        message.channel.send(`Disabling CleanMode. Back to normal.`);
        global.cleanMode = false;
    }
    else {
        message.channel.send(`Enabling CleanMode. Working in secret I see.`);
        global.cleanMode = true;
    }
    return;
}

exports.status = function(message, args) {
    if (!global.cleanMode) {
        message.channel.send(`**Status:** \nDev Mode: \`${global.devMode}\`\nClean Mode: \`${global.cleanMode}\`\nDatabase Connection: \`${global.enableDB}\`\nWelcome Message: \`${global.welcomeMessage}\``);
    }
    else {
        message.author.send(`**Status:** \nDev Mode: \`${global.devMode}\`\nClean Mode: \`${global.cleanMode}\`\nDatabase Connection: \`${global.enableDB}\`\nWelcome Message: \`${global.welcomeMessage}\``);
    }
    return;
}

exports.welcome_message = function(message, args) {
    if (global.welcomeMessage) {
        message.channel.send(`Disabling Welcome Message!`);
        global.welcomeMessage = false;
    }
    else {
        message.channel.send(`Enabling Welcome Message. Happy to help!`);
        global.welcomeMessage = true;
    }
    return;
}

exports.admin = function(message, args) {
    message.channel.send(`Here are some things I can help you with as an admin: \n${global.util.listToString(Object.keys(exports))}`);
    return;
}

exports.welcome = function(message, args){
    message.channel.send(" ", {files: [global.welcomeImage]}).catch(console.error);
    setTimeout(function(){
        member.send(`Welcome to the Tespa Carleton Discord Server!\nPlease read the rules in <#${global.specialChannels['rules']}> and  then introduce yourself in <#${global.specialChannels['introductions']}> .\nIf you have any questions, do not hesitate to send a direct message to an Executive or Council member!`);
        }, 1000);
    return;
}

exports.welcome_image = function(message, args) {
    if (!args[0]) {
        message.channel.send(`You need arguements for \`${command}\``);
        return;
    }
    global.welcomeImage = args[0];
    message.channel.send(`Changed Welcome image to ${global.welcomeImage}.`);
    return;
}

exports.promote = function(message, args) {
    if (!args[0]) {
        message.channel.send(`You need arguments for promote!`);
        return;
    }
    var id_rx = /^<@([0-9]+)>$/g;
    var id = id_rx.exec(args[0]);
    console.log(id);
    id = id ? id[1] : args[0]
         console.log(id);
    var user = global.util.getUser({id: id});
    if(user === undefined || global.userList[user.id]>=2){
        message.channel.send(`Cannot promote that user!`)
        return;
    }
    global.database.promoteUser(user).then(
        function(results){
            global.util.updateUserPermissions(message.channel, `Successfully promoted ${args[0]}`);
        }).catch(
        function(reason){
            console.log(reason);
            message.channel.send(`Update Failed, see system logs`);
        }
    );
}

exports.demote = function(message, args) {
    if (!args[0]) {
        message.channel.send(`You need arguments for demote!`);
        return;
    }
    var id_rx = /^<@([0-9]+)>$/g;
    var id = id_rx.exec(args[0]);
    console.log(id);
    id = id ? id[1] : args[0]
    console.log(id);
    var user = global.util.getUser({id: id});
    if(user === undefined || global.userList[user.id] === undefined || global.userList[user.id]>=3 || global.userList[user.id]<=0){
        message.channel.send(`Cannot demote that user!`)
        return;
    }
    global.database.demoteUser(user).then(
        function(results){
            global.util.updateUserPermissions(message.channel, `Successfully demoted ${args[0]}`);
        }).catch(
        function(reason){
            console.log(reason);
            message.channel.send(`Update Failed, see system logs`);
        }
    );
    return;
}