// File: show.js (a new command file)

const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

const flagsDirectory = path.join(__dirname, 'flag_storage');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('showflag')
        .setDescription('Shows stored flag data')
        .addSubcommand(subcommand =>
            subcommand
                .setName('data')
                .setDescription('Shows data of a specific stored flag')
                .addStringOption(option => 
                    option.setName('ctfname')
                        .setDescription('Name of the CTF challenge')
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('names')
                .setDescription('Shows the names of all stored flags')),
    async execute(interaction) {
        if (interaction.options.getSubcommand() === 'data') {
            const ctfName = interaction.options.getString('ctfname');
            const filePath = path.join(flagsDirectory, `${ctfName}.json`);

            if (fs.existsSync(filePath)) {
                const flagData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
                let response = `Data for '${ctfName}':\n`;
                response += `Link: ${flagData.link}\n`;
                Object.keys(flagData.parts).forEach(part => {
                    response += `Part ${part}: ${flagData.parts[part]}\n`;
                });
                await interaction.reply(response);
            } else {
                await interaction.reply(`No data found for '${ctfName}'.`);
            }
        } else if (interaction.options.getSubcommand() === 'names') {
            const files = fs.readdirSync(flagsDirectory);
            const names = files.map(file => path.basename(file, '.json'));
            await interaction.reply(`Stored flags: ${names.join(', ')}`);
        }
    },
};
