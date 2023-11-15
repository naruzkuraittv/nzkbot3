const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('convert')
        .setDescription('Conversion tools')
        .addSubcommand(subcommand =>
            subcommand
                .setName('d2h')
                .setDescription('Convert decimal to hex')
                .addStringOption(option => option.setName('number').setDescription('Enter a decimal number').setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('dah')
                .setDescription('Decimal as hex')
                .addStringOption(option => option.setName('values').setDescription('Enter decimal values').setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('a2h')
                .setDescription('ASCII to hex')
                .addStringOption(option => option.setName('text').setDescription('Enter ASCII text').setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('h2d')
                .setDescription('Hex to decimal')
                .addStringOption(option => option.setName('hex').setDescription('Enter a hex number').setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('h2a')
                .setDescription('Hex to ASCII')
                .addStringOption(option => option.setName('hex').setDescription('Enter hex values').setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('h2da')
                .setDescription('Hex to Decimal and ASCII')
                .addStringOption(option => option.setName('hex').setDescription('Enter hex values').setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('a2hd')
                .setDescription('ASCII to Hexadecimal')
                .addStringOption(option => option.setName('text').setDescription('Enter ASCII text').setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('a232')
                .setDescription('ASCII to Base32')
                .addStringOption(option => option.setName('text').setDescription('Enter ASCII text').setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('a264')
                .setDescription('ASCII to Base64')
                .addStringOption(option => option.setName('text').setDescription('Enter ASCII text').setRequired(true))),

    async execute(interaction) {
        const subcommand = interaction.options.getSubcommand();

        switch (subcommand) {
            case 'd2h':
                await handleD2H(interaction);
                break;
            case 'dah':
                await handleDAH(interaction);
                break;
            case 'a2h':
                await handleA2H(interaction);
                break;
            case 'h2d':
                await handleH2D(interaction);
                break;
            case 'h2a':
                await handleH2A(interaction);
                break;
            case 'h2da':
                await handleH2DA(interaction);
                break;
            // add other cases for different subcommands
            case 'a2hd':
                await handleA2HD(interaction);
                break;
            case 'a232':
                await handleA232(interaction);
                break;
            case 'a264':
                await handleA264(interaction);
                break;
        }
    },
};

async function handleD2H(interaction) {
    const decimalNumber = interaction.options.getString('number');
    const hexValue = parseInt(decimalNumber).toString(16);
    await interaction.reply(`Decimal to Hex: ${hexValue}`);
}

async function handleDAH(interaction) {
    const decimalValues = interaction.options.getString('values').split(' ');
    const hexOutput = decimalValues.map(val => parseInt(val).toString(16)).join(' ');
    await interaction.reply(`Decimal as Hex: ${hexOutput}`);
}

async function handleA2H(interaction) {
    const asciiText = interaction.options.getString('text');
    const hexValue = asciiText.split('').map(char => char.charCodeAt(0).toString(16)).join(' ');
    await interaction.reply(`ASCII to Hex: ${hexValue}`);
}

async function handleH2D(interaction) {
    const hexNumber = interaction.options.getString('hex');
    const decimalValue = parseInt(hexNumber, 16);
    await interaction.reply(`Hex to Decimal: ${decimalValue}`);
}

async function handleH2A(interaction) {
    const hexValues = interaction.options.getString('hex').split(' ');
    const asciiOutput = hexValues.map(hex => String.fromCharCode(parseInt(hex, 16))).join('');
    await interaction.reply(`Hex to ASCII: ${asciiOutput}`);
}

async function handleH2DA(interaction) {
    const hexValues = interaction.options.getString('hex').split(' ');
    const decimalOutput = hexValues.map(hex => parseInt(hex, 16));
    const asciiOutput = decimalOutput.map(dec => String.fromCharCode(dec)).join('');
    await interaction.reply(`Hex to Decimal and ASCII: Decimal - ${decimalOutput.join(' ')}, ASCII - ${asciiOutput}`);
}
async function handleA2HD(interaction) {
    const asciiText = interaction.options.getString('text');
    const hexValue = asciiText.split('').map(char => char.charCodeAt(0).toString(16)).join(' ');
    await interaction.reply(`ASCII to Hexadecimal: ${hexValue}`);
}

async function handleA232(interaction) {
    const asciiText = interaction.options.getString('text');
    const base32Value = Buffer.from(asciiText).toString('base32');
    await interaction.reply(`ASCII to Base32: ${base32Value}`);
}

async function handleA264(interaction) {
    const asciiText = interaction.options.getString('text');
    const base64Value = Buffer.from(asciiText).toString('base64');
    await interaction.reply(`ASCII to Base64: ${base64Value}`);
}