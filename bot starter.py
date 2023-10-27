import os
import subprocess
import time
import gitpy as git
#curently only works for xayah bot by default, as this is run in her folder
rebooting = False
process = None
wait = time.sleep(1)
def wait():
    wait
def get_cwd():
    # Get the current working directory
    global cwd
    cwd = os.path.dirname(os.path.realpath(__file__))
def start_bot():
    global process
    global rebooting
    #if rebooting = true then print rebooted sub process
    if rebooting == True:
        
    # Open a new PowerShell window and run the bot and run     process = subprocess.Popen(["powershell.exe", f"cd {cwd}; node ./bot.js"], stdout=subprocess.PIPE, stderr=subprocess.PIPE), but tell it rebooting  == true
        print("Rebooted Sub Process")
        process = subprocess.Popen(["powershell.exe", f"cd {cwd}; node ./bot.js"], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        loop()

    else:
        # Open a new PowerShell window and run the bot
        print("Started Sub Process")
        process = subprocess.Popen(["powershell.exe", f"cd {cwd}; node ./bot.js"], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        loop()

ignore_first_output = True

def loop():
    global process
    global ignore_first_output
    while True:
        # print whatever comes from the ./bot.js file
        output = process.stdout.readline()
        print(output.strip())
        
        # If the bot exits with an error of "reboot" run start_bot() again
        if output == b'[] reboot\n':

            process.terminate() # Close the existing process

            global rebooting
            rebooting = True

            start_bot()
        
        # If the bot exits with an error of b'[] exit' or b'[] stop' exit the loop and close the program
        elif output == b'': # specifically if theres a bot error, u can fix it with a git pull if it doesnt auto reboot within a minute.
            #error()
            print("Bot error")
        elif output == output == b'[] exit\n' or output == b'[] stop\n':
            process.terminate()
            gitupdate()
            #wait 10 seconds
            time.sleep(43200, 0) # 12 hours
            
            # figure out how to make node.js print arbitrary code to run extra python in the same process
        #elif output == b'e_arbitrarycode':
            #run: str = process.stdout.readline().strip().decode("utf-8")


        #elif output == 'gitpull' or update run git pull in the cwd 
        elif output == b'git_pull\n'or output == b'[] gitpull\n' or output == b'[] update\n':
            process.terminate()
            print("Updating...")
            gitupdate()
            start_bot() # Restart the bot
            
def gitupdate():
    gitpull = git.cmd.Git().pull()
    git.cmd.Git().pull()
    print(f"Git pull: {gitpull}")
def error():
    #close all children processes then start bot
    if ignore_first_output == True:
        ignore_first_output = False
        #exit this elif statement and restart the loop
    process.terminate()
    print("Stopped Sub Process")
    start_bot() #backup if somehow you get an error from the bot's commands 
    print("Updating... coz something happened")

    gitupdate()
    #wait 10 seconds
    time.sleep(60) # 1 minute i asume you are gonna edit the code within a few minutes or so. and checks in 1 minute intervals.

if __name__ == "__main__":
    get_cwd()
    start_bot()