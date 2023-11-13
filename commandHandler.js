const fs = require('fs');
const path = require('path');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { token, clientId, guildId } = require('./config.json');

// Load commands from the specified directory
function loadCommands(commandsDir, commands, client) {
    const commandFiles = fs.readdirSync(commandsDir).filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
        const filePath = path.join(commandsDir, file);
        const command = require(filePath);
        console.log(`Loaded command: ${command.data.name} - ${command.data.description}`);
        client.commands.set(command.data.name, command);
        commands.push(command.data.toJSON());
    }
}

// Clear existing commands
function clearCommands() {
    const rest = new REST({ version: '9' }).setToken(token);

    // Clear guild-specific commands
    rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: [] })
        .then(() => console.log('Successfully cleared guild commands.'))
        .catch(console.error);

    // Clear global commands
    rest.put(Routes.applicationCommands(clientId), { body: [] })
        .then(() => console.log('Successfully cleared global commands.'))
        .catch(console.error);
}

module.exports = { loadCommands, clearCommands };
