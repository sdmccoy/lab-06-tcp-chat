'use strict';

const net = require('net');
const server = net.createServer();

let clientPool = [];

server.on('connection', (socket) => {
  //sets a random number between 1000&1 to a username property so we can identify the user
  socket.username = `${Math.floor(Math.random() * (1000 - 1)) + 1}`;
  console.log('user connected', socket.username);
  socket.write(`You're connected!\nYour username is ${socket.username}\nType /menu to access the menu commands`);
  //this set the new socket object inside the clientPool array while keeping any previous objects in the array.
  clientPool = [...clientPool, socket];

  //this will log a message of the user that left and remove the user from the clientPool. This is invoked if the user timesout, leaves, or errors.
  let handleDisconnect = () => {
    console.log(`${socket.username} has vanished`);
    clientPool = clientPool.filter(item => item !== socket);
  };
  socket.setTimeout(10000000);
  socket.on('timeout', handleDisconnect);
  socket.on('close', handleDisconnect);
  socket.on('error', handleDisconnect);

  //this will allow the user to change their user name if they input /nick newName
  socket.on('data', (buffer) => {
    let data = buffer.toString();
    if (data.startsWith('/nick')) {
      socket.username = data.split(' ')[1] || socket.username;
      socket.username = socket.username.trim();
      socket.write(`You are now known as ${socket.username}!`);
      return;
    } else {
      //this will put the username infront of everything the user types
      socket.write(`${socket.username}: ${buffer}`);
    }
  });
    //this allows the user to dm another user by nickname with the following syntax   /dm username message
  socket.on('data', (buffer) => {
    let data = buffer.toString();
    if (data.startsWith('/dm')) {
      let recipient = data.split(' ')[1].toString();
      console.log(`recipient: `, recipient);
      let message = data.slice(data.indexOf(' ', 5));
      console.log(`message: `, message);
      for (var i = 0; i < clientPool.length; i++) {
        if (clientPool.username === recipient) {
          socket.username = recipient;
          socket.write(message);
        }
      }
    }
  });
  //this allows the user to type /quit and it will end the connection and remove them from the clientPool
  socket.on('data', (buffer) => {
    let data = buffer.toString();
    if (data.startsWith('/quit')) {
      socket.end();
      return handleDisconnect;
    }
  });
  //this prints the user a menu of commands to use
  socket.on('data', (buffer) => {
    let data = buffer.toString();
    if (data.startsWith('/menu')) {
      socket.write(`:MENU:\nChanging your username\n/nick yourNewNameHere\n\nSending a direct message:\n/dm recipientUserName yourMessage\n\nQuit the chatroom:\n/quit\n\nEnjoy!`);
    }
  });
});

server.listen(3000, () => {
  console.log(`server up on`, server.address().port);
});
