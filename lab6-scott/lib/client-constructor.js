'use strict';

const net = require('net');
const server = net.createServer();

let clientPool = [];

server.on('connection', (socket) => {
  console.log(socket.address());
  //sets a random number between 1000&1 to a username property so we can identify the user
  socket.username = `Name: ${Math.floor(Math.random() * (1000 - 1)) + 1}`;
  //this set the new socket object inside the clientPool array while keeping any previous objects in the array.
  clientPool = [...clientPool, socket];
});

//this will log a message of the user that left and remove the user from the clientPool. This is invoked if the user timesout, leaves, or errors.
let handleDisconnect = (eventType, socket) => {
  if (eventType === 'timeout') {
    console.log(`${socket.username} fell asleep and was booted`);
  } else if (eventType === 'close') {
    console.log(`${socket.username} has vanished`);
  } else {
    console.log(`${socket.username} broke something and left`);
  }
  clientPool = clientPool.filter(item => item !== socket);
};

socket.setTimeout(1000000);
socket.on('timeout', handleDisconnect('timeout', socket));
socket.on('close', handleDisconnect('close', socket));
socket.on('error', handleDisconnect('error', socket));
