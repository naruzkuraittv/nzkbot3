@echo off
(
# Automatically detect the current directory as the git repository path
$gitRepoPath = Split-Path -Parent $MyInvocation.MyCommand.Definition

# Install PM2 globally
npm install pm2 -g

# Navigate to the git hooks directory
$hooksPath = Join-Path $gitRepoPath ".git\hooks"
cd $hooksPath

# Create the post-receive file
$postReceive = Join-Path $hooksPath "post-receive"
"#!/bin/bash`nGIT_WORK_TREE=$gitRepoPath git pull origin main`npm install`npm run build`pm2 restart discord-bot" | Set-Content $postReceive

# Check if the OS is Unix-like and set the executable flag
if (-Not [System.Environment]::OSVersion.Platform -eq [System.PlatformID]::Win32NT) {
    chmod +x $postReceive
}

# Create the start script
$startScript = Join-Path $gitRepoPath "start.ps1"
"pm2 restart discord-bot" | Set-Content $startScript

# Create the start bat that opens the ps1


# Prompt to start the bot
$shouldStart = Read-Host "Do you want to start the bot now? (yes/no)"
if ($shouldStart -eq "yes") {
    pm2 start bot.js --name discord-bot
}
) > file.ps1

echo "file.ps1 created successfully."
