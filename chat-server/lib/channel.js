var irc = require('./protocol');

function Channel(name, server) {
  this.server = server;
  this.name = name;
  this.users = [];
}

Channel.prototype = {
  isMember: function(user) {
    return this.users.indexOf(user) !== -1;
  },

  broadcast: function() {
    var message = arguments.length === 1 ? arguments[0] : Array.prototype.slice.call(arguments).join(' '),
        server = this.server;

    this.users.forEach(function(user) {
      user.send(message);
    });
  },

  part: function(user) {
    this.users.splice(this.users.indexOf(user), 1);
    user.channels.splice(user.channels.indexOf(this), 1);
  }
}

function Channels(server) {
  this.server = server;
  this.channels = {};
}

Channels.prototype = {

  find: function(name) {
    return this.channels[this.server.normalize(name)];
  },

  join: function(user, name) {
    var channel = this.find(name);

    if (!channel) channel = this.channels[this.server.normalize(name)] = new Channel(name, this.server);
    if (channel.isMember(user)) return;

    channel.users.push(user);
    user.channels.push(channel);

    channel.users.forEach(function(receiver) {
      receiver.send(user.mask, 'JOIN', channel.name);
    });

    user.send(this.server.host, irc.reply.names_reply, user.nick, '=' + channel.name, ':' + channel.users.map(function(user) {
      return user.nick;
    }).join(' '));

    user.send(this.server.host, irc.reply.names_end, user.nick, channel.name, ':End of NAMES list.');
  },

  remove: function(channel) {
    delete this.channels[channel.name];
  }
}

exports.Channel = Channel;
exports.Channels = Channels;
