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
//basicaly required to use this bot if you intend on adding or removing or editing commands
function clearCommands() {
    //base delete arguments for guild and global commands
    rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: [] })
    .then(() => console.log('Successfully deleted all guild commands.'))
    .catch(console.error);

    // for global commands
    rest.put(Routes.applicationCommands(clientId), { body: [] })
    .then(() => console.log('Successfully deleted all application commands.'))
    
    .catch(console.error);
};
client.once(Events.ClientReady, async () => {
    console.log('Ready!');
    // basically reload discord's cache so u can use your new or editied commands
    clearCommands();
    // this actuialy sends the commands to discord's (the company's api servers) bot cache so you can actuially use new commands
    // figuring out this actuially pissed me off
    loadCommands(path.join(__dirname, 'commands'));

    //handshakes, and loads the commands for Discord
    try {
        await rest.put(
            Routes.applicationGuildCommands(clientId, guildId),
            { body: commands },
        );
        console.log('Successfully registered application commands.');
    } catch (error) {
        console.error(error);
    }
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
