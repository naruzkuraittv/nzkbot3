#run git pull with gitpython
import os
import subprocess
import time
import git

def gitupdate():
        gitpull = git.cmd.Git().pull()
        git.cmd.Git().pull()
        print(f"Git pull: {gitpull}")
        
#create fille called updated
def create_java_signal():
    with open("updated", "w") as f:
        f.write("updated")
        f.close()
gitupdate()
create_java_signal()
exit()