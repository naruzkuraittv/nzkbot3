const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

const borderStyles = [0, 1, 2, 3]; // Example border styles
const preferencesPath = path.join(__dirname, 'borderPreferences.json'); // Path to the JSON file

module.exports = {
    data: new SlashCommandBuilder()
        .setName('border-set')
        .setDescription('Set your border style preference')
        .addIntegerOption(option => 
            option.setName('style')
                .setDescription('The border style number')
                .setRequired(true)),
    async execute(interaction) {
        const style = interaction.options.getInteger('style');

        // Check if the style is valid
        if (!borderStyles.includes(style)) {
            await interaction.reply({ content: 'Invalid border style.', ephemeral: true });
            return;
        }

        // Read or initialize the preferences file
        let preferences;
        if (fs.existsSync(preferencesPath)) {
            preferences = JSON.parse(fs.readFileSync(preferencesPath, 'utf8'));
        } else {
            preferences = {};
        }

        // Set the user's preference
        preferences[interaction.user.id] = style;
        fs.writeFileSync(preferencesPath, JSON.stringify(preferences, null, 2));

        await interaction.reply({ content: `Border style set to ${style}.`, ephemeral: true });
    },
};
