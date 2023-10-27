//additional arguments from bot.js gets read as which python scrypt to run. search for that python script, then run it. else return error "argument" not found
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('python')
		.setDescription('runs python scripts'),
	async execute(interaction) {
        // get the arguments
        const args = interaction.options.getString('args');
        // get the python script to run
        const py = args.split(' ')[0];
        // get the arguments for the python script
        const pyargs = args.split(' ').slice(1).join(' ');
        // run the python script
        const cons = require('child_process').execSync(`python ${py} ${pyargs}`);
        // send the output
		await interaction.reply('output:');
	},
};
