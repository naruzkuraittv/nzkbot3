from python_terminal import connect

def print_to_terminal(words):
    client_socket = connect()
    command = f'print|"{words}"'
    client_socket.send(command.encode('utf-8'))
    response = client_socket.recv(1024).decode('utf-8')
    print(f"Server response: {response}")
    client_socket.close()

if __name__ == "__main__":
    words = "words that I want to print to terminal"
    print_to_terminal(words)
