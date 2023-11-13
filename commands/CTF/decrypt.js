const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('decrypt')
        .setDescription('Decrypt a substitution cipher with a custom key')
        .addStringOption(option => 
            option.setName('key')
                .setDescription('Enter the custom key for decryption')
                .setRequired(true))
        .addStringOption(option => 
            option.setName('cipher')
                .setDescription('Enter the cipher text to decrypt')
                .setRequired(true)),
    async execute(interaction) {
        const key = interaction.options.getString('key');
        const cipherText = interaction.options.getString('cipher');
        const standardAlphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

        // Check if key is valid
        if (key.length !== 26 || new Set(key).size !== 26) {
            await interaction.reply("Error: The key must contain 26 unique alphabetic characters.");
            return;
        }

        let decryptedText = cipherText.split('').map(char => {
            if (key.toUpperCase().includes(char.toUpperCase())) {
                return standardAlphabet[key.toUpperCase().indexOf(char.toUpperCase())];
            } else {
                return char;
            }
        }).join('');

        await interaction.reply(`Decrypted text: ${decryptedText}`);
    },
};
