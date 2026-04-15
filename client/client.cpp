#include <iostream>
#include <cstring>
#include <unistd.h>
#include <arpa/inet.h>
#include <sys/socket.h>

using namespace std;

int main() {

    // 1. Create socket client
    int sock = socket(AF_INET, SOCK_STREAM, 0);
    if (sock == -1) {
        cerr << "Socket creation failed\n";
        return 1;
    }

    // 2. Define server address
    sockaddr_in server_addr;
    memset(&server_addr, 0, sizeof(server_addr));

    server_addr.sin_family = AF_INET;
    server_addr.sin_port = htons(8080);


    // loopback address, same machine (direct memory transfer inside kernel)
    // Convert IP string → binary
    inet_pton(AF_INET, "127.0.0.1", &server_addr.sin_addr);

    // 3. Connect to server
    if (connect(sock, (sockaddr*)&server_addr, sizeof(server_addr)) < 0) {
        cerr << "Connection failed\n";
        return 1;
    }

    cout << "Connected to server\n";

    // 4. Send message
    const char* msg = "Hello from client!";
    send(sock, msg, strlen(msg), 0);

    // 5. Receive response
    char buffer[1024];
    int bytes = recv(sock, buffer, sizeof(buffer), 0);

    if (bytes > 0) {
        buffer[bytes] = '\0';
        cout << "Server: " << buffer << endl;
    }


    
    // 6. Close socket
    close(sock);

    return 0;
}