#include<iostream>
#include<cstring>
#include<unistd.h>
#include<arpa/inet.h>
#include<sys/socket.h>

using namespace std;

int main(){
    /*1. create a socket.

      basically requesting the kernel to give a communication 
      end point

      parameters-

      AF_INET - address family for IPv4
      SOCK_STREAM - TCP stream
      0

    */
   int server_fd = socket(AF_INET, SOCK_STREAM, 0);

   if(server_fd == -1) {
      cerr << "Socket not created.\n";
      return 1;
    }
   cout << "Socket created successfully\n";

   /*2. Define server address structure sockaddr_in

    struct sockaddr_in {
      sa_family_t sin_family;   // address family (IPv4)
      uint16_t    sin_port;     // port (network byte order)
      struct in_addr sin_addr;  // IP address
    };

    sockaddr_in is a struct.
   
   */
    
    sockaddr_in server_addr;

    /* clear memory (good practice) 
    set all bytes to 0.
    */
    memset(&server_addr, 0, sizeof(server_addr));

    server_addr.sin_family = AF_INET; // IPv4 socket.
    server_addr.sin_port = htons(8080); // port no. network byte order.
    server_addr.sin_addr.s_addr = INADDR_ANY; // Server will accept connections on all its IP addresses.


    /*3. Bind socket to IP + Port
       tells the OS - this socket will listen on port 8080. 
    */
    
    if(bind(server_fd, (sockaddr*)&server_addr, sizeof(server_addr)) < 0){
        cerr << "Binding failed\n";
        close(server_fd);
        return 1;
    }

    cout << "Bind success\n";

   /*
   start listening for incoming connections.
   no. 5 -> max no. of pending connections in the queue.
   */

    if(listen(server_fd,5) < 0){
        cerr <<"Listen failed\n";
        close(server_fd);
        return 1;
    }

    cout << "Server is listening on port 8080...\n";

    /*5. accept a client connection
      
      accept() blocks until a client connects
   */
    
   sockaddr_in client_addr; 
   socklen_t client_size = sizeof(client_addr);
   
     
    int client_socket = accept(server_fd, (sockaddr*)&client_addr, &client_size);

    if (client_socket < 0) { 
        cerr << "Accept failed\n"; 
        close(server_fd); 
        return 1; 
    } 
    cout << "Client connected\n"; 
    
    /* 6. Receive data from client 
     recv() reads data sent by client
     */

     char buffer[1024];
     int bytes_received = recv(client_socket, buffer, sizeof(buffer), 0); 

    if (bytes_received > 0) {
         buffer[bytes_received] = '\0';
         cout << "Message: " << buffer << endl;
        }

    else if (bytes_received == 0) {
         cout << "Client closed connection\n";
         close(client_socket);
        }

    else {
          perror("recv failed"); // prints system error
           close(client_socket);
        }


    // 7. Send response back to client
    const char* response = "Hello from server!";
    send(client_socket, response, strlen(response), 0);

    // 8. Close sockets
    close(client_socket);
    close(server_fd);

    cout << "Server shutting down\n";

    return 0;

}


