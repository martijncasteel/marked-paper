const express = require('express');
const app = express();
const path = require('path');

const server = require('http').createServer(app);
const io = require('socket.io')(server);

// set the address of the server
const hostname = '0.0.0.0';
const port = process.env.PORT || 3000;

// name the default room for users connecting
const room = 'martijncasteel.com'; // TODO rooms


// start the server on specified port
server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

// Routing
app.use(express.static(path.join(__dirname, 'public')));


// define socket logics; connecting, sending, typing, leaving
io.on('connection', function(socket){

  // broadcast message to all whome are listening
  socket.on('broadcast', function (data) {
    console.log([socket.id, socket.username, 'broadcast', data])

    var helpers = require('helpers');

    // broadcast to all others
    socket.broadcast.emit('broadcast', {
      username: socket.username,
      message: helpers.clean(data),
      datetime: new Date(socket.handshake.time).toISOString()
    });
  });

  // send message to specified user
  socket.on('message', function (data, receiver) {
    console.log([socket.id, socket.username, 'message', socket.sockets.sockets.find(s => s.id == receiver).username, data])

    var helpers = require('helpers');

    // broadcast to all others
    socket.to(receiver).emit('message', {
      username: socket.username,
      message: helpers.clean(data),
      datetime: new Date(socket.handshake.time).toISOString()
    });
  });

  // connects a new user
  socket.on('connected', function (username) {
    console.log([socket.id, username, 'connected', socket.handshake.address])

    var helpers = require('helpers');
    socket.username = helpers.clean(username);

    var users = helpers.users( io.sockets, socket );
    var string = helpers.toString( users );

    socket.emit('hello', {
      message: `Welcome ${socket.username}, ${string}`,
      users: users
    });

    // broadcast a user has joined
    socket.broadcast.emit('hello', {
      message: `${socket.username} has joined`,
      username: socket.username
    });
  });

  socket.on('reconnected', function (username) {
    console.log([socket.id, username, 'reconnected', socket.handshake.address])

    var helpers = require('helpers');
    socket.username = helpers.clean(username);
  });

  // a user has dropped their connection
  socket.on('disconnect', function () {
    console.log([socket.id, socket.username, 'disconnected'])

    // broadcast a user has left the conversation
    socket.broadcast.emit('bye', {
      message: `${socket.username} left`,
      username: socket.username
    });
  });

});
