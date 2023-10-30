import os
import socket
import subprocess

def get_bot_js_directory():
    bot_js_directory = os.getcwd().replace("\\", "/").split("/")[-1]
    bot_js_directory = int(bot_js_directory, 16) % 10000  # Ensure port is < 10000
    return bot_js_directory

def start_python_terminal_server(port):
    with open("server.port", "w") as f:
        f.write(str(port))
    subprocess.Popen(["python", "python_terminal_server.py", str(port)])

def check_if_python_terminal_open():
    if os.path.exists("server.port"):
        return True
    return False

def connect():
    if not check_if_python_terminal_open():
        port = get_bot_js_directory()
        start_python_terminal_server(port)
    else:
        with open("server.port", "r") as f:
            port = int(f.read().strip())
    
    client_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    client_socket.connect(('localhost', port))
    return client_socket

if __name__ == "__main__":
    client_socket = connect()
    client_socket.send("handshake".encode('utf-8'))
    response = client_socket.recv(1024).decode('utf-8')
    print(f"Server response: {response}")
    client_socket.close()
