'use strict';

const net = require('net');
const server = net.createServer();

server.listen(3000, () => {
  console.log(`server up on`, server.address().port);
});
