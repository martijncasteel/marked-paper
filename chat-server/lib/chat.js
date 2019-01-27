const express = require('express');
const app = express();
const path = require('path');

const server = require('http').createServer(app);
const io = require('socket.io')(server, {
  path: '/api/chat'
});

const helpers = require('helpers');

// set the address of the server
const hostname = '127.0.0.1';
const port = process.env.PORT || 3000;

// name the default room for users connecting
const room = 'martijncasteel.com'; // TODO rooms


// start the server on specified port
server.listen(port, hostname, () => {
  console.log(`NodeJS server running`);
  console.log(`http://${hostname}:${port}`);
});

// Routing
app.use(express.static(path.join(__dirname, 'public')));


// define socket logics; connecting, sending, typing, leaving
io.on('connection', function(socket){

  // broadcast message to all whome are listening
  socket.on('broadcast', function (data) {

    var helpers = require('helpers');
    helpers.log(socket.id, socket.username, 'broadcast', {message: data})

    // broadcast to all others
    socket.broadcast.emit('broadcast', {
      username: socket.username,
      message: helpers.clean(data),
      datetime: new Date(socket.handshake.time).toISOString()
    });
  });

  // send message to specified user
  socket.on('message', function (data, receiver) {

    var helpers = require('helpers');
    helpers.log(socket.id, socket.username, 'message', { name: socket.sockets.sockets.find(s => s.id == receiver).username, message: data})

    // broadcast to all others
    socket.to(receiver).emit('message', {
      username: socket.username,
      message: helpers.clean(data),
      datetime: new Date(socket.handshake.time).toISOString()
    });
  });

  // connects a new user
  socket.on('connected', function (username) {

    var helpers = require('helpers');
    helpers.log(socket.id, username, 'connected', {ip: socket.handshake.address})
    socket.username = helpers.clean(username);

    socket.emit('hello', {
      message: `Welcome ${socket.username}!`
    });

    // broadcast a user has joined
    socket.broadcast.emit('hello', {
      message: `${socket.username} joined`,
      username: socket.username
    });
  });

  socket.on('reconnected', function (username) {

    var helpers = require('helpers');
    helpers.log(socket.id, username, 'reconnected', {ip: socket.handshake.address})
    socket.username = helpers.clean(username);
  });

  // a user has dropped their connection
  socket.on('disconnect', function () {

    var helpers = require('helpers');
    helpers.log(socket.id, socket.username, 'disconnected', {})

    // broadcast a user has left the conversation
    socket.broadcast.emit('bye', {
      message: `${socket.username} left`,
      username: socket.username
    });
  });

});
