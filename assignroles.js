const { SlashCommandBuilder } = require('@discordjs/builders');
const { CommandInteraction, GuildMember, MessageEmbed } = require('discord.js');

// Define role lists and corresponding roles
// Define role lists and corresponding roles
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
async function assignRoles(interaction, roleMappings) {
    const years_roles = roleMappings[0].years_roles;
    const pings_roles = roleMappings[1].p_roles;
    const follower_rank_roles = roleMappings[2].fr_roles;
    const joined_role = roleMappings[0].joined;
    const pings_role = roleMappings[1].pings;
    const follower_rank_role = roleMappings[2].follower_rank_role;
    let members_q = [];
    let fetchedMembers;
    let after = 0;
    
    do {
        fetchedMembers = await interaction.guild.members.fetch({ limit: 1000, after });
        members_q = [...members_q, ...fetchedMembers.array()];
        after = members_q[members_q.length - 1].id;
    } while (fetchedMembers.size === 1000);

    for (let member of members_q){
        let added_roles = [];
        console.log(`Member: ${member.user.username}`);
        console.log('Roles:', member.roles.cache.map(role => role.id));        
        if (member.roles.cache.some(role => years_roles.includes(role.id)) && !member.roles.cache.has(joined_role)) {
            await member.roles.add(joined_role);
            added_roles.push(joined_role);
        }
        else if (member.roles.cache.some(role => pings_roles.includes(role.id)) && !member.roles.cache.has(pings_role)) {
            await member.roles.add(pings_role);
            added_roles.push(pings_role);
        }
        else if (member.roles.cache.some(role => follower_rank_roles.includes(role.id)) && !member.roles.cache.has(follower_rank_role)) {
            await member.roles.add(follower_rank_role);
            added_roles.push(follower_rank_role);
        }
        console.log(`Roles have been assigned based on your existing roles. ${added_roles}`);
        if (added_roles.length > 0) {
            const embed = new MessageEmbed()
                .setColor('#0099ff')
                .setTitle('Roles have been updated!')
                .setDescription(`${member.user} was missing ${added_roles}`);
            await member.send({ embeds: [embed] });
        }
    }
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('assignroles')
        .setDescription('cleans up the roles of all users in the server'),
    async execute(interaction) {
        await interaction.deferReply();
        await assignRoles(interaction, roleMappings).catch(console.error);
        interaction.editReply('done');
    }
};