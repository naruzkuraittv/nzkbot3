const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('python')
		.setDescription('runs python scripts')
		.addStringOption(option => 
			option.setName('args')
			.setDescription('Arguments for the python script')
			.setRequired(true)),
		async execute(interaction) {
			// Get the arguments
			const fullArgs = interaction.options.getString('args');
			const [command, ...argumentList] = fullArgs.split(':');
			const py = command.trim() + '.py';
			const pyargs = argumentList.join(':').trim().split(' ');

		// Define the path to the pythonscripts folder
		const pyFolderPath = path.join(__dirname, '..', '..', 'pythonscripts');

		// Check if the python script exists
		if (fs.existsSync(path.join(pyFolderPath, py))) {
			// Run the python script in a separate process
			const pythonProcess = spawn('C:\\Python39\\python.exe', [path.join(pyFolderPath, py), ...pyargs]);

			let output = '';

			pythonProcess.stdout.on('data', (data) => {
				output += data.toString();
			});

			pythonProcess.stderr.on('data', (data) => {
				console.error(`stderr: ${data}`);
			});

			pythonProcess.on('close', async (code) => {
				if (code !== 0) {
					await interaction.reply(`Error: Script "${py}" exited with code ${code}`);
				} else {
					await interaction.reply(`Output: ${output}`);
				}
			});
		} else {

			await interaction.reply(`folder: ${pyFolderPath} file: ${py} args: ${pyargs} not found`);
		}
	},
};
