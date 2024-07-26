const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('suggest')
        .setDescription('Submit a suggestion')
        .addStringOption(option =>
            option.setName('suggestion')
                .setDescription('Your suggestion')
                .setRequired(true)),
    async execute(interaction) {
        const filePath = path.join(__dirname, 'suggestions.json');

        // Check if suggestions.json exists, create if not
        if (!fs.existsSync(filePath)) {
            fs.writeFileSync(filePath, '{}', 'utf8');
        }

        // Read and parse suggestions file
        const suggestions = JSON.parse(fs.readFileSync(filePath, 'utf8'));

        const suggestionText = interaction.options.getString('suggestion').slice(0, 500); // Limit to 500 characters
        const suggestionNumber = Object.keys(suggestions).length + 1;
        suggestions[`suggestion${suggestionNumber}`] = suggestionText;

        // Write updated suggestions back to file
        fs.writeFileSync(filePath, JSON.stringify(suggestions, null, 4));

        await interaction.reply(`Suggestion #${suggestionNumber} received: "${suggestionText}"`);
    },
};
