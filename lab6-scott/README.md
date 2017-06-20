##Chat room lab##

**Author**
Scott McCoy

**Description**
This application will function as a basic chat room. It will start a new server when node is ran on the index.js module. A user can connect to the server and create a user name. When connected, the user can type in their console a message they'd like to share with other users that are connected. User will also have the ability to direct message other users.

**index.js**

*start the server*
server.listen will start the server on port 3000 and log a message that it's running

*user connections*
server.on manages the connections for the users. It will detect a socket connection and pass the socket object through. It will automatically assign that instance of the socket object a user name between 1-1000.

#handleDisconnect
This this will be called if the user is idle for too long, has an error, or disconnects. It will then log that the user has vanished and it will remove the socket object from the clientPool.

*ux*
On first connection it will greet the user with:
You're Connected!
Your username is (random number)
Type /menu to access the menu commands

Typing /menu shows the commands on how to change your name, send a direct message, and quit the chatroom.
