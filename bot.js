const fs = require('node:fs');
const path = require('node:path');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
const { token, clientId, guildId } = require('./config.json');

// Initialize REST API
const commands = [];
const rest = new REST({ version: '9' }).setToken(token);

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.commands = new Collection();
process.env.PATH = "C:/Users/admin/AppData/Local/Programs/Python/Python311/python.exe;" + process.env.PATH;
// define functions coz im a python user
function loadCommands(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const filePath = path.join(dir, file);
        const stats = fs.statSync(filePath);
        if (stats.isDirectory()) {
            loadCommands(filePath);
        } else if (file.endsWith('.js')) {
            const command = require(filePath);
            console.log(`Loaded command: ${command.data.name} - ${command.data.description}`);
            client.commands.set(command.data.name, command);
            commands.push(command.data.toJSON());
        }
    }
}
async function clearCommands() {
    // Fetch all guilds the bot is a member of
    const guilds = await client.guilds.fetch();

    // Extract the IDs of these guilds
    const guildIds = guilds.map(guild => guild.id);

    // Iterate over each guild ID and clear its commands
    for (const guildId of guildIds) {
        try {
            await rest.put(
                Routes.applicationGuildCommands(clientId, guildId), 
                { body: [] }
            );
            console.log(`Successfully deleted all guild commands for guild ${guildId}.`);
        } catch (error) {
            console.error(`Failed to delete commands for guild ${guildId}:`, error);
        }
    }

    // Clear global commands as well
    try {
        await rest.put(
            Routes.applicationCommands(clientId), 
            { body: [] }
        );
        console.log('Successfully deleted all global application commands.');
    } catch (error) {
        console.error('Failed to delete global application commands:', error);
    }
}
async function registerCommandsForAllGuilds() {
    // Fetch all guilds the bot is a member of
    const guilds = await client.guilds.fetch();

    // Iterate over each guild and register the commands
    for (const guild of guilds.values()) {
        try {
            await rest.put(
                Routes.applicationGuildCommands(clientId, guild.id),
                { body: commands }
            );
            console.log(`Successfully registered commands for guild ${guild.id}.`);
        } catch (error) {
            console.error(`Failed to register commands for guild ${guild.id}:`, error);
        }
    }
}

client.once(Events.ClientReady, async () => {
    console.log('Ready!');

    // Load commands from the specified directory
    loadCommands(path.join(__dirname, 'commands'));

    // Clear commands from all guilds and then register new commands
    await clearCommands();
    await registerCommandsForAllGuilds();
});

client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
        } else {
            await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        }
    }
});

client.login(token);