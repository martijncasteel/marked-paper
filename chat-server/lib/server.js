// chat-server build for martijncasteel.com using some irc basics but not fully
// implementing the standard. Also borrowed some ideas from ircd.js

var net = require('net'),
    carrier = require('carrier'),

    User = require('./user').User,
    Users = require('./user').Users,

    Channel = require('./channel').Channel,
    Channels = require('./channel').Channels,

    Commands = require('./commands'),

    irc = require('./protocol');

function Connection(stream) {
  this.stream = stream;
  this.object = null;

  this.__defineGetter__('id', function() {
    return this.object ? this.object.id : 'Unregistered';
  });
}

function Server(){
  this.users = new Users(this);
  this.channels = new Channels(this);
  this.commands = new Commands(this);

  this.config = {
    hostname: 'martijncasteel.com',
    network: 'Martijn Casteel IRC network',
    email: 'irc@martijncasteel.com',

    motd: 'hellow to my server!',

    version: '0.2.1',
    comments: null
  };

  this.created = Date.now();
}

Server.init = function(){
  var server = new Server();

  // TODO configuration

  server.start();

  process.on('SIGHUP', function() {
    console.log('Reloading config...');

  });

  process.on('SIGTERM', function() {
    console.log('Exiting...');
    server.close();
  });
}

Server.prototype = {
  version: '0.0.1',

  get host() { return ':' + this.config.hostname; },

  start: function() {
    var server = this;
    this.server = net.createServer(handle);

    this.server.listen({
      host: 'martijncasteel.nl',
      port: 6667,
    });

    console.log('listening on martijncasteel.nl:6667');

    function handle(stream) {
      try {

        var message = carrier.carry(stream),
            client = new Connection(stream);

        client.object = new User(server, client);
        console.log(client.object.address + ' joined');

        message.on('line', function(line) {
          server.data(client, line);
        });

        stream.on('end', function() { server.end(client); });
        stream.on('error', function() { });

      } catch (exception) {
        console.error(exception);
      }
    }
  },

  data: function(client, line) {
    var message = this.parse(line);

    if (client.object.registered === false) {
        if (['PASS', 'USER', 'NICK'].indexOf(message.command) === -1) {
          client.object.send(this.host, irc.errors.not_registered, ':You have not registered');
          return;
        }
    }

    if (!this.commands[message.command]) {
      client.object.send(this.host, irc.errors.unknown_command, message.command, ':Unknown command');
      return;
    }

    // execute command using the parsed message
    this.commands[message.command].apply(this.commands, [client.object].concat(message.args));
  },

  parse: function(data) {
    var parts = data.trim().split(/ :/),
        args = parts[0].split(' ');

    parts = [parts.shift(), parts.join(' :')];

    if (parts.length > 0) {
      args.push(parts[1]);
    }

    if (data.match(/^:/)) {
      args[1] = args.splice(0, 1, args[1]);
      args[1] = (args[1] + '').replace(/^:/, '');
    }

    return {
      command: args[0].toUpperCase(),
      args: args.slice(1)
    };
  },

  end: function(client) {
    var user = client.object;

    if (user) {
      console.log(user.address + ' left');

      if (user.stream && user.stream.end) {
        user.stream.end();
      }

      this.users.remove(user);
      user = null;
    }
  },

  normalize: function(name) {
    return name &&
           name.toLowerCase()
           .replace(/{/g, '[')
           .replace(/}/g, ']')
           .replace(/\|/g, '\\')
           .trim();
  }
}

exports.Server = Server;
