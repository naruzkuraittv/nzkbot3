import socket
import sys
import os

port = int(sys.argv[1])

with open("server.pid", "w") as f:
    f.write(str(os.getpid()))

server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
server_socket.bind(('localhost', port))
server_socket.listen(1)

print(f"Python terminal server started on port {port}")

while True:
    client_socket, address = server_socket.accept()
    data = client_socket.recv(1024).decode('utf-8')
    
    if data == "handshake":
        client_socket.send("handshake_ack".encode('utf-8'))
    else:
        py_command, arguments = data.split('|', 1)
        try:
            exec(f"{py_command}({arguments})")
            client_socket.send("Command executed successfully".encode('utf-8'))
        except Exception as e:
            client_socket.send(f"An error occurred: {e}".encode('utf-8'))
    
    client_socket.close()
