const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Lists all commands in the CTF category'),
    async execute(interaction) {
        const commandsDir = path.join(__dirname, 'CTF');
        let commandFiles = fs.readdirSync(commandsDir).filter(file => file.endsWith('.js'));

        let commandList = commandFiles.map(file => file.slice(0, -3)).join(', '); // Removes '.js' and joins names with commas
        await interaction.reply(`CTF Commands: ${commandList}`);
    },
};
