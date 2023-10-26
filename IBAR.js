const config = require("./config"); // literally just loads stuff from .env file but i used my secret id n stuff u can map them too with the use varaibles bit just below this
const Enmap = require("enmap");

// Use the variables
/*
console.log(config.TOKEN);
console.log(config.CLIENT_SECRET);
console.log(config.APPLICATION_ID);
console.log(config.PUBLICKEY);
*/
//modes case sensitive

//const botmode = 'plato';
//const botmode = 'P_test'
const botmode = 'ibar';
//const botmode = 'I_test'


let prefix;
let Admin_Role_ID;
let logChannel_Id;

// Check bot mode
if (botmode === 'plato') {
    prefix = 'nzk';
    Admin_Role_ID = "808785985852801062";
    logChannel_Id = "808786574590083142";
} else if (botmode === 'ibar') {
    prefix = 'xayah';
    Admin_Role_ID = "915611505565786163";
    logChannel_Id = "1163828242453635102";

    /*fake ibar mode
    prefix = 'xayah'; // go to my test server i invited you works with admin role id = 808785985852801062
    Admin_Role_ID = "808785985852801062";
    logChannel_Id = "808786574590083142";
*/
} else if (botmode === 'P_test') {
    prefix = 'nzk';
    Admin_Role_ID = "808785985852801062";
    logChannel_Id = "808786574590083142";
} else if (botmode === 'I_test') {
    prefix = 'xayah';
    Admin_Role_ID = "915611505565786163";
    logChannel_Id = "1163828242453635102";
} else {
    prefix = 'xayah'; // go to my test server works with admin role id = 808785985852801062
    Admin_Role_ID = "808785985852801062";
    logChannel_Id = "808786574590083142";
}


//old prefix = 'xayah';
// do this first or start.py will not work coz weird console output b'' meaning either loop or error failure. will kill then reboot bot over and over again till it works, or the git pull happens.
const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.DirectMessages,
    ]
});


// Declare global variables


client.on('ready', () => {
    console.log(prefix + " is up and running");
    //send message when bot is online to log channel
    console.log("sent message to log channel");
});

const talkedRecently = new Set();

client.loyalty = new Enmap("loyalty");

client.on('messageCreate', async message => {
    if (message.author.bot) return;
    if (message.guild) {

        const key = `${message.guild.id}-${message.author.id}`;


        client.loyalty.ensure(`${message.guild.id}-${message.author.id}`, {
            user: message.author.id,
            guild: message.guild.id,
            loyalty: 0,
        });
        //client.loyalty.inc(key, "loyalty");
    }

    //if (message.content.indexOf(prefix) !== 0) return;
    //if (!message.content.startsWith(prefix) || message.author.bot) return;
    if (!message.content.startsWith(prefix)) {
        //console.log("command prefix not found");
        return;
    }

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    console.log(args, command)
    if (command === "addpoints") {
        console.log("add point")
        //admin role id = 808785985852801062
        if (message.member.roles.cache.has(Admin_Role_ID)) {
            const user = message.mentions.users.first() || client.users.cache.get(args[0]);
            if (!user) return message.reply("you didnt give me a user? are you stupid?");

            const pointsToAdd = parseInt(args[1], 10);
            if (!pointsToAdd) return message.reply("you didnt tell me how many loyalty points they are getting? do you want to lose points?")


            const reason = args.slice(2);
            const reasonString = reason.join(' ');

            
            client.loyalty.ensure(`${message.guild.id}-${user.id}`, {
                user: message.author.id,
                guild: message.guild.id,
                loyalty: 0
            });


            let userPoints = client.loyalty.get(`${message.guild.id}-${user.id}`, "loyalty");
            userPoints += pointsToAdd;

            client.loyalty.set(`${message.guild.id}-${user.id}`, userPoints, "loyalty");
            //channel a id = 1163828242453635102 
            const channel = client.channels.cache.get(logChannel_Id);
            const verb = pointsToAdd > 0 ? 'gained' : 'lost'; // Ternary operator to determine the verb
            channel.send({ content: `${user} has ${verb} **${Math.abs(pointsToAdd)}** Dango Loyalty. \n**Reason:** ${reasonString}` });

        }
    }

    if (command === "showpoints") {
        console.log("showing points yo");
        //original role id = 915611505565786163
        //now admin role, id = 808785985852801062
        if (message.member.roles.cache.has(Admin_Role_ID)) {
            const user = message.mentions.users.first() || client.users.cache.get(args[0]);
            if (!user) return message.reply("you didnt give me a user? are you stupid?");

            client.loyalty.ensure(`${message.guild.id}-${user.id}`, {
                user: message.author.id,
                guild: message.guild.id,
                loyalty: 0
            });
            let userPoints = client.loyalty.get(`${message.guild.id}-${user.id}`, "loyalty");
            //const channel = client.channels.cache.get(logChannel_Id);
            message.channel.send({ content: `${user} has **${userPoints}** Dango Loyalty` });
            //message.channel.send(`${user.tag} has **${Math.abs(userPoints)}** Dango Loyalty`);
        }
    }

    if (command === "setpoints") {
        //admin role id = 808785985852801062
        if (message.member.roles.cache.has(Admin_Role_ID)) {
            const user = message.mentions.users.first() || client.users.cache.get(args[0]);
            if (!user) return message.reply("you didn't give me a user... are you TRYING to make me angry?");

            client.loyalty.ensure(`${message.guild.id}-${user.id}`, {
                user: message.author.id,
                guild: message.guild.id,
                loyalty: 0
            });

            let userpoints = client.loyalty.get(`${message.guild.id}-${user.id}`, "loyalty");
            const pointsToAdd = parseInt(args[1], 10);
            if (!pointsToAdd) return message.reply("PLEASE tell me WHAT YOU WANT IT TO BE SET TO");
            userpoints = pointsToAdd;
            client.loyalty.set(`${message.guild.id}-${user.id}`, userpoints, "loyalty");
            //old channel id = 1163828242453635102
            //new channel id == 808786574590083142
            const channel = client.channels.cache.get('1808786574590083142');
            const verb = pointsToAdd > 0 ? 'gained' : 'lost'; // Ternary operator to determine the verb
            channel.send({ content: `${user} has had their Dango Loyalty set to ${userpoints}` });
        }
    }

    if (command === "editpoints") {
        //original admin role id = 915611505565786163
        //admin role id = 808785985852801062
        if (message.member.roles.cache.has(Admin_Role_ID)) {
            const user = message.mentions.users.first() || client.users.cache.get(args[0]);
            if (!user) return message.reply("you didn't give me a user... are you TRYING to make me angry?");

            client.loyalty.ensure(`${message.guild.id}-${user.id}`, {
                user: message.author.id,
                guild: message.guild.id,
                loyalty: 0
            });

            let userpoints = client.loyalty.get(`${message.guild.id}-${user.id}`, "loyalty");
            const pointsToAdd = parseInt(args[1], 10);
            if (!pointsToAdd) return message.reply("PLEASE tell me WHAT YOU WANT IT TO BE SET TO");
            userpoints = pointsToAdd;
            client.loyalty.set(`${message.guild.id}-${user.id}`, userpoints, "loyalty");
            //old channel id = 565978267450867733
            //new channel id = 808786574590083142
            const channel = client.channels.cache.get('808786574590083142');
            const verb = pointsToAdd > 0 ? 'gained' : 'lost'; // Ternary operator to determine the verb
            channel.send({ content: `${user} has had their Dango Loyalty set to ${userpoints}` });
        }
    }

    if (command === "showleaderboard") {
        //old role id = 915611505565786163
        //new role id = 808785985852801062
        if (message.member.roles.cache.has(Admin_Role_ID)) {
            const filtered = client.loyalty.filter(p => p.guild === message.guild.id).array();

            const sorted = filtered.sort((a, b) => b.loyalty - a.loyalty);

            const top10 = sorted.splice(0, 10);
            const embed = new EmbedBuilder()
                .setTitle("Highest Ranking Dangonians")
                .setDescription("The upper echelon of Dangonia")
                //.setThumbnail("./DangoReef.png")
                .setColor('#f106ee');
            for (const data of top10) {
                try {
                    embed.addFields({ name: client.users.cache.get(data.user).tag, value: `${data.loyalty} Dango Loyalty` });
                } catch {
                    embed.addFields({ name: `<@${data.user}>`, value: `${data.loyalty} Dango Loyalty` });
                }
            }
            //old channel id = 1163828242453635102
            //new channel id = 808786574590083142
            const channel = client.channels.cache.get(logChannel_Id);
            channel.send({ embeds: [embed] });
        }
    };

        if (command === "reboot") {
            // Check if the user has the admin role
            if (message.member.roles.cache.has(Admin_Role_ID)) {
                // Send a message to the channel
                message.channel.send("bored now, cya").then(() => {
                    // Exit the bot process
                    print("reboot");
                    process.exit("reboot");
                });
            }
        }
    
    

        // if command == stop or exit
        if (command === "stop" || command === "exit") {
            // Check if the user has the admin role
            if (message.member.roles.cache.has(Admin_Role_ID)) {
                // Send a message to the channel
                message.channel.send("xayah, out").then(() => {
                    // Exit the current process
                    process.exit();
                });
            }
        }
        if (command === "git_pull" || command === "gitpull" || command === "update") {
            // Check if the user has the admin role
            if (message.member.roles.cache.has(Admin_Role_ID)) {
                // Send a message to the channel
                message.channel.send("Updating from git repo");
                message.channel.send("xayah, out").then(() => {
                    // Exit the current process
                    process.exit();
                });
            }
        }

    if (command === "say") {
        if (message.author.id == (409795588289331200)) {
            let channel = message.mentions.channels.first();
            let specifiedChannel = message.guild.channels.cache.find(t => t.id == channel.id);
            const reason = args.slice(1);
            const reasonString = reason.join(' ');

            specifiedChannel.send(reasonString);
        }
    }

    if (command === "opgg") {
        if (args.length === 0) {
            message.channel.send("Please provide a summoner name.");
        } else {
            let ign = "";
            let server = "euw"; // Default to "euw" if no server is provided

            // Check if the last argument is a valid server
            const validServers = ["euw", "kr", "na", "eune"];
            const potentialServer = args[args.length - 1].toLowerCase();
            if (validServers.includes(potentialServer)) {
                server = potentialServer;
                ign = args.slice(0, -1).join(" ");
            } else {
                ign = args.join(" ");
            }

            message.channel.send(`[${encodeURIComponent(ign)}](https://www.op.gg/summoners/${server}/${encodeURIComponent(ign)})`);
        }
    }

    if (command === "mastery") {
        if (args.length === 0) {
            message.channel.send("Please provide a summoner name.");
        } else {
            let ign = "";
            let server = "euw"; // Default to "euw" if no server is provided

            // Check if the last argument is a valid server
            const validServers = ["euw", "kr", "na", "eune"];
            const potentialServer = args[args.length - 1].toLowerCase();
            if (validServers.includes(potentialServer)) {
                server = potentialServer;
                ign = args.slice(0, -1).join(" ");
            } else {
                ign = args.join(" ");
            }

            message.channel.send(`[${encodeURIComponent(ign)}](https://championmastery.gg/summoner?summoner=${encodeURIComponent(ign)}&region=${server}&lang=en_US)`);
        }
    }
    //client.on('messageCreate', async message => {
    //    if (message.author.id === '286227994119503882') {
    //        await message.react("<:nickspin:1142501756518019072>");
    //    };

    //    if (message.author.id == '389052553138143232') {
    //        await message.react('🤓')
    //    };

});

//make sure this line is the last line idky but it works lol
client.login(process.env.TOKEN);
