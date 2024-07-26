// File: commands/add_flag_part.js

const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

const flagsDirectory = path.join(__dirname, '../flag_storage');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('add_flag_part')
        .setDescription('Adds a part to an existing flag')
        .addStringOption(option => 
            option.setName('ctfname')
                .setDescription('Name of the CTF challenge')
                .setRequired(true))
        .addIntegerOption(option => 
            option.setName('part_number')
                .setDescription('The part number of the flag')
                .setRequired(true))
        .addStringOption(option => 
            option.setName('part_value')
                .setDescription('Value for the specified part of the flag')
                .setRequired(true)),
    async execute(interaction) {
        const ctfName = interaction.options.getString('ctfname');
        const partNumber = interaction.options.getInteger('part_number');
        const partValue = interaction.options.getString('part_value');

        const filePath = path.join(flagsDirectory, `${ctfName}.json`);

        if (!fs.existsSync(filePath)) {
            return await interaction.reply(`Flag '${ctfName}' does not exist. Please create it first using /flag_storage.`);
        }

        let flagData = JSON.parse(fs.readFileSync(filePath, 'utf8'));

        // Add or update the flag part
        flagData.parts[partNumber] = partValue;

        // Write updated data back to file
        fs.writeFileSync(filePath, JSON.stringify(flagData, null, 2));

        await interaction.reply(`Part ${partNumber} added/updated for flag '${ctfName}'.`);
    },
};
