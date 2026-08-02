#ifndef SERVER_HPP
#define SERVER_HPP

#include <mutex>
#include <thread>
#include <vector>

class Server {
public:
    explicit Server(int port);
    ~Server();

    void start();

private:
    int port;
    int serverSocket;

    std::vector<int> clients;
    std::mutex clientsMutex;

    void handleClient(int clientSocket);
    void broadcastMessage(const char* buffer, int bytesReceived, int senderSocket);
};

#endif
