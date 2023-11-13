#!/bin/bash

# Automatically detect the current directory as the git repository path
gitRepoPath="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Install PM2 globally
npm install pm2 -g

# Navigate to the git hooks directory
cd "$gitRepoPath/.git/hooks"

# Create the post-receive file
echo "#!/bin/bash
GIT_WORK_TREE=$gitRepoPath git pull origin main
npm install
npm run build
pm2 restart discord-bot" > post-receive

# Make the post-receive script executable
chmod +x post-receive

# Create the start script
echo "#!/bin/bash
pm2 restart discord-bot" > "$gitRepoPath/start.sh"
chmod +x "$gitRepoPath/start.sh"

# Prompt to start the bot
read -p "Do you want to start the bot now? (yes/no) " shouldStart
if [ "$shouldStart" = "yes" ]; then
    pm2 start bot.js --name discord-bot
fi
