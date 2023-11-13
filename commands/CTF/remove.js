const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('remove')
        .setDescription('Remove spaces or newlines from a string')
        .addSubcommand(subcommand =>
            subcommand
                .setName('space')
                .setDescription('Remove spaces from a string')
                .addStringOption(option => option.setName('input').setDescription('Enter a string').setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('newline')
                .setDescription('Remove newlines from a string')
                .addStringOption(option => option.setName('input').setDescription('Enter a string').setRequired(true))),
    async execute(interaction) {
        const subcommand = interaction.options.getSubcommand();
        const input = interaction.options.getString('input');

        let result;
        if (subcommand === 'space') {
            result = input.replace(/\s+/g, '');
        } else if (subcommand === 'newline') {
            result = input.replace(/\r?\n|\r/g, '');
        }

        await interaction.reply(`Modified string: ${result}`);
    },
};
