const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('findkey')
        .setDescription('Attempt to find the key of a substitution cipher')
        .addStringOption(option => 
            option.setName('cipher')
                .setDescription('Enter the cipher text')
                .setRequired(true)),
    async execute(interaction) {
        const cipherText = interaction.options.getString('cipher').toUpperCase();
        const englishFrequencies = "ETAOINSHRDLCUMWFGYPBVKJXQZ"; // Based on letter frequency in English
        const cipherFrequencies = getCipherFrequencies(cipherText);

        let guessedKey = '';
        cipherFrequencies.forEach(c => {
            guessedKey += englishFrequencies[cipherFrequencies.indexOf(c)];
        });

        let decryptedText = cipherText.split('').map(char => {
            const index = cipherFrequencies.indexOf(char);
            return index !== -1 ? englishFrequencies[index] : char;
        }).join('');

        await interaction.reply(`Guessed Key: ${guessedKey}\nAttempted Decryption: ${decryptedText}`);
    },
};

function getCipherFrequencies(cipherText) {
    let freqMap = new Map();
    for (let char of cipherText) {
        if (char.match(/[A-Z]/)) {
            freqMap.set(char, (freqMap.get(char) || 0) + 1);
        }
    }
    return Array.from(freqMap.entries()).sort((a, b) => b[1] - a[1]).map(entry => entry[0]);
}
