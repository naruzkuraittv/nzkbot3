const { SlashCommandBuilder } = require('discord.js');

function random_type() {
    const types = [normal, fire, water, grass, electric, ice, fighting, poison, ground, flying, psychic, bug, rock, ghost, dragon, dark, steel, fairy];
    let chozentype = '';
    while (chozentype === '') {
        //pick a random type from the list 
        chozentype = types[Math.floor(Math.random(), types.length)];
    }
    return chozentype;
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('TypeRoulette')
        .setDescription('Responds with a random pokemon type'),
    async execute(interaction) {
         //3% chance to send the special message
        if (Math.random() < 0.1) {
            await interaction.reply(shiny  + random_type()); 
        } else {
            await interaction.reply(random_type());
        }
    },
};

