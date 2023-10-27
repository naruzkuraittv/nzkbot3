const fs = require('fs');
const { Client, GatewayIntentBits, Events } = require('discord.js');
const { token } = require('./config.json');

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// Initialize commands map
client.commands = new Map();

// Read command files
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

// Loop to register commands
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.data.name, command);
}

// When the client is ready
client.once(Events.ClientReady, c => {
	console.log(`Ready! Logged in as ${c.user.tag}`);
});

// Function to handle command interactions
async function handleCommandInteraction(interaction) {
    const command = client.commands.get(interaction.commandName);
    if (!command) return;
    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
}

// Event listener for interactions
client.on(Events.InteractionCreate, async interaction => {
    if (interaction.isCommand()) {
        await handleCommandInteraction(interaction);
    }
});

// Log in to Discord
client.login(token);
