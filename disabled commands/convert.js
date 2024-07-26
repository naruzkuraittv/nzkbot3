const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('convert')
        .setDescription('Conversion tools')
        .addStringOption(option => 
            option.setName('type')
                .setDescription('Conversion type')
                .setRequired(true)
                .addChoices(
                    { name: 'd2h', value: 'd2h' },
                    { name: 'dah', value: 'dah' },
                    { name: 'a2h', value: 'a2h' },
                    { name: 'h2d', value: 'h2d' },
                    { name: 'h2a', value: 'h2a' },
                    { name: 'h2da', value: 'h2da' },
                    { name: 'a2hd', value: 'a2hd' },
                    { name: 'a232', value: 'a232' },
                    { name: 'a264', value: 'a264' }
                )
        )
        .addStringOption(option =>
            option.setName('input')
                .setDescription('Input for conversion')
                .setRequired(true)
        ),

    async execute(interaction) {
        const conversionType = interaction.options.getString('type');
        const inputValue = interaction.options.getString('input');

        switch (conversionType) {
            case 'd2h':
                await handleD2H(interaction, inputValue);
                break;
            case 'dah':
                await handleDAH(interaction, inputValue);
                break;
            case 'a2h':
                await handleA2H(interaction, inputValue);
                break;
            case 'h2d':
                await handleH2D(interaction, inputValue);
                break;
            case 'h2a':
                await handleH2A(interaction, inputValue);
                break;
            case 'h2da':
                await handleH2DA(interaction, inputValue);
                break;
            case 'a2hd':
                await handleA2HD(interaction, inputValue);
                break;
            case 'a232':
                await handleA232(interaction, inputValue);
                break;
            case 'a264':
                await handleA264(interaction, inputValue);
                break;
        }
    },
};

async function handleD2H(interaction, input) {
    const decimalValues = input.split(' ');
    const hexOutput = decimalValues.map(val => '0x' + parseInt(val).toString(16)).join(' ');
    await interaction.reply(`Decimal to Hex: ${hexOutput}`);
}



async function handleDAH(interaction, input) {
    const decimalValues = input.split(' ');
    const hexOutput = decimalValues.map(val => '0x' + val).join(' ');
    await interaction.reply(`Decimal as Hex: ${hexOutput}`);
}


async function handleA2H(interaction, input) {
    const hexValue = input.split('').map(char => '0x' + char.charCodeAt(0).toString(16)).join(' ');
    await interaction.reply(`ASCII to Hex: ${hexValue}`);
}



async function handleH2D(interaction, input) {
    const hexValues = input.split(' ');
    const decimalOutput = hexValues.map(hex => parseInt(hex.startsWith('0x') ? hex.substring(2) : hex, 16));
    await interaction.reply(`Hex to Decimal: ${decimalOutput.join(' ')}`);
}



async function handleH2A(interaction, input) {
    const hexValues = input.split(' ');
    const asciiOutput = hexValues.map(hex => String.fromCharCode(parseInt(hex, 16))).join('');
    await interaction.reply(`Hex to ASCII: ${asciiOutput}`);
}



async function handleH2DA(interaction, input) {
    const hexValues = input.split(' ');
    const decimalOutput = hexValues.map(hex => parseInt(hex, 16));
    const asciiOutput = decimalOutput.map(dec => String.fromCharCode(dec)).join('');

    await interaction.reply(`Hex to Decimal and ASCII: Decimal - ${decimalOutput.join(' ')}, ASCII - ${asciiOutput}`);
}



async function handleA2HD(interaction, input) {
    const hexValue = input.split('').map(char => char.charCodeAt(0).toString(16)).join(' ');
    await interaction.reply(`ASCII to Hexadecimal: ${hexValue}`);
}



async function handleA232(interaction, input) {
    const base32Value = Buffer.from(input).toString('base32');
    await interaction.reply(`temporaryly disabled`);
}



async function handleA264(interaction, input) {
    const base64Value = Buffer.from(input).toString('base64');
    await interaction.reply(`ASCII to Base64: ${base64Value}`);
}


// Implement each handler function according to its conversion logic.
