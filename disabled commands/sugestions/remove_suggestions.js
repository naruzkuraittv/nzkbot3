const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('remove_suggestion')
		.setDescription('Remove a suggestion')
		.addStringOption(option =>
			option.setName('suggestion')
				.setDescription('Suggestion number to remove')
				.setRequired(true)),
	async execute(interaction) {
		const suggestionNumber = interaction.options.getString('suggestion');
		const suggestions = JSON.parse(fs.readFileSync('suggestions.json', 'utf8'));

		if (suggestions[`suggestion${suggestionNumber}`]) {
			delete suggestions[`suggestion${suggestionNumber}`];
			fs.writeFileSync('suggestions.json', JSON.stringify(suggestions, null, 4));
			await interaction.reply(`Suggestion #${suggestionNumber} removed.`);
		} else {
			await interaction.reply(`No suggestion found with number: ${suggestionNumber}`);
		}
	},
};
