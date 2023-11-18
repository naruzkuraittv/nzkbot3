// File: commands/flag_storage.js

const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

const flagsDirectory = path.join(__dirname, '../flag_storage');

// Ensure the flags directory exists
if (!fs.existsSync(flagsDirectory)) {
    fs.mkdirSync(flagsDirectory, { recursive: true });
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('flag_storage')
        .setDescription('Creates or updates flag storage')
        // Base options
        .addStringOption(option => 
            option.setName('name')
                .setDescription('Name of the CTF challenge')
                .setRequired(true))
        .addStringOption(option => 
            option.setName('link')
                .setDescription('Link to the challenge (optional)')
                .setRequired(false))
        .addIntegerOption(option => 
            option.setName('numberofparts')
                .setDescription('Total number of parts in the flag')
                .setRequired(true))
        .addBooleanOption(option => 
            option.setName('overwrite')
                .setDescription('Whether to overwrite existing flag storage')
                .setRequired(false)),
    async execute(interaction) {
        const ctfName = interaction.options.getString('name');
        const link = interaction.options.getString('link') || '';
        const numberOfParts = interaction.options.getInteger('numberofparts');
        const overwrite = interaction.options.getBoolean('overwrite') || false;

        const filePath = path.join(flagsDirectory, `${ctfName}.json`);

        // Load existing data or initialize new structure
        let flagData = { link, parts: {}, totalParts: numberOfParts };
        if (fs.existsSync(filePath) && !overwrite) {
            return await interaction.reply(`Flag '${ctfName}' already exists. Use overwrite option to modify.`);
        }

        // Update flag data based on command input
        for (let i = 1; i <= 6; i++) {
            const partValue = interaction.options.getString(`value${i}`);
            if (partValue) {
                flagData.parts[i] = partValue;
            }
        }

        // Write updated data to file
        fs.writeFileSync(filePath, JSON.stringify(flagData, null, 2));

        await interaction.reply(`Flag '${ctfName}' created/updated with the provided values.`);
    },
};
