const fs = require('node:fs');
const path = require('node:path');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { token, clientId } = require('./config.json');
// old const client = new Client({ ws: { intents: ['GUILDS', 'GUILD_MEMBERS', 'GUILD_MESSAGES', 'DIRECT_MESSAGES'] } });
const { Client, GatewayIntentBits } = require('discord.js');
console.log(clientId);
guildid = 926254479974740069;
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers] });

client.once('ready', async () => {
    console.log('Client is ready. Fetching guild...');

    try {
        const guild = await client.guilds.fetch(guildid.toString()); // Make sure guildid is a string
        if (!guild) {
            console.error('Guild not found.');
            return;
        }
        console.log(`Guild fetched: ${guild.name}`);

        const memberIDs = await fetchMemberIDs(guild);
        console.log('Member IDs:', memberIDs);
    } catch (error) {
        console.error('Error:', error);
    }
});

async function fetchMemberIDs(guild) {
    try {
        const memberCollection = await guild.members.fetch();
        return Array.from(memberCollection.keys());
    } catch (error) {
        console.error('Error fetching members:', error);
        return [];
    }
}

client.login(token);



client.login(token);

/*
async function assignRoles(guild) {
    console.log('assignRoles function started');
    console.log(guild);
    console.log('guild fetched');
    console.log("guild.members.fetch() started");

    const members = await guild.members.fetch();
    console.log(`Fetched ${members.size} members`);


    const roleMappings = [
        {
            years_roles: ['1152423933736398858', '926751892502118450', '926750983445413940', '1187993274108104704'],
            joined: '1160355635922210906'
        },
        {
            p_roles: ['927258355553161296', '926629451939315743', '1160329608474927125', '926296019560435763', '1160352598596010137', '1160352965668900946'],
            pings: '1160375449352937493'
        },
        {
            fr_roles: ['1187987033126359060', '1160424091631755364', '1148576418289172491', '1187990619268841523', '1160384005296898188', '1160384005296898188', '1160384116143951944', '1187991758861250620', '1148577452633894923', '1187991098547785798', '1162236102791405739'],
            follower_rank_role: '1160378426532823050'
        }
    ];

    for (let [memberId, member] of members) {
        let added_roles = [];
        console.log(`Member: ${member.user.username}`);
        console.log('Roles:', member.roles.cache.map(role => role.id));
        
        if (member.roles.cache.some(role => roleMappings[0].years_roles.includes(role.id)) && !member.roles.cache.has(roleMappings[0].joined)) {
            await member.roles.add(roleMappings[0].joined);
            added_roles.push(roleMappings[0].joined);
        }
        if (member.roles.cache.some(role => roleMappings[1].p_roles.includes(role.id)) && !member.roles.cache.has(roleMappings[1].pings)) {
            await member.roles.add(roleMappings[1].pings);
            added_roles.push(roleMappings[1].pings);
        }
        if (member.roles.cache.some(role => roleMappings[2].fr_roles.includes(role.id)) && !member.roles.cache.has(roleMappings[2].follower_rank_role)) {
            await member.roles.add(roleMappings[2].follower_rank_role);
            added_roles.push(roleMappings[2].follower_rank_role);
        }
        console.log(`Roles have been assigned based on your existing roles. ${added_roles} to ${member.user.username}`);    }
}
*/
client.login(token);