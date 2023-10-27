const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { SlashCommandBuilder } = require('discord.js');

    module.exports = {
        data: new SlashCommandBuilder()
            .setName('clearcommands')
            .setDescription('resets all applicationcommands for this bot!'),
        async execute(interaction) {
            //base delete arguments for guild and global commands
            rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: [] })
            .then(() => console.log('Successfully deleted all guild commands.'))
            .catch(console.error);
    
            // for global commands
            rest.put(Routes.applicationCommands(clientId), { body: [] })
            .then(() => console.log('Successfully deleted all application commands.'))
            
            .catch(console.error);
    
            await interaction.reply('deleted all commands');
        },
    };