#include "server.hpp"  // has the class definition.

#include <iostream>
#include <cstring>    // - for clearing the buffer std;:memset().
#include <algorithm>  // using STL algo. std::remove()
#include <unistd.h>   // for linux system calls
#include <arpa/inet.h> // for ip addressing

#include <sys/socket.h>  // for networking func.
/*
    socket()
    bind()
    listen()
    accept()
    send()
    recv()
 */

Server::Server(int port): port(port), serverSocket(-1) {} // -1 because initially no socket is created.

Server::~Server(){
    close(serverSocket);
}

void Server::start(){
    serverSocket = socket(AF_INET, SOCK_STREAM, 0);  // creates a tcp socket.
    // AF_INET - IPv4 address.
    // SOCK_STREAM - TCP
    // 0 - default protocol for TCP.
    // (returns a file descriptor.) linux treats sockets as files

    if(serverSocket < 0){
        std::cerr << "failed to create socket\n";
        return;
    }
    sockaddr_in serverAddress{};
    serverAddress.sin_family = AF_INET;
    serverAddress.sin_addr.s_addr = INADDR_ANY;
    serverAddress.sin_port = htons(port);
}
