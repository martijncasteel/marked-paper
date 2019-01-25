var irc = require('./protocol');

function User(server, client) {
  this.server = server;
  this.nick = null;
  this.away = null;

  this.username = null;
  this.realname = null;

  this.channels = [];

  if (client) {
    this.client = client;

    if (client.stream) {
      this.stream = client.stream;
      this.address = client.stream.remoteAddress;
    }
  }
}

User.prototype = {

  get id() {
    return this.nick;
  },

  get mask() {
    return ':' + this.nick; // + '!' + this.username + '@' + this.address;
  },

  get registered() {
    return this.nick !== null && this.username !== null;
  },

  send: function() {
    if (!this.stream) return;

    var self = this,
        message = arguments.length === 1 ?
          arguments[0]
        : Array.prototype.slice.call(arguments).join(' ');

    // winston.verbose({ client: this.nick, data: message, message: 'outgoing' });
    this.stream.write(message + '\r\n');
  },

  // message: function(nick, message) {
  //   var user = this.server.users.find(nick);
  //   this.updated = new Date();
  //
  //   if (user) {
  //     if (user.isAway) {
  //       this.send(this.server.host, irc.reply.away, this.nick, user.nick, ':' + user.awayMessage);
  //     }
  //     user.send(this.mask, 'PRIVMSG', user.nick, ':' + message);
  //   } else {
  //     this.send(this.server.host, irc.errors.no_such_nick, this.nick, nick, ':No such nick/channel');
  //   }
  // },

  exists: function(nick) {
    var server = this.server
    nick = server.normalize(nick);

    return server.users.users.some(function(obj){
      return server.normalize(obj['nick']) === nick;
    })
  },

  quit: function(message) {
    this.channels.part(user);
    this.server.end(client);
  }
}

function Users(server) {
  this.server = server;
  this.users = [];
}

Users.prototype = {

  find: function(nick) {
    nick = this.server.normalize(nick);
    for (var i = 0; i < this.users.length; i++) {
      if (this.users[i] && this.server.normalize(this.users[i].nick) === nick)
        return this.users[i];
    }
  },

  register: function(user, username, realname) {
    user.username = username;
    user.realname = realname;

    this.users.push(user);
  },

  // push: function(user) {
  //   this.users.push(user);
  // },

  remove: function(user){
    if (this.users.indexOf(user) !== -1) {
      this.users.splice(this.users.indexOf(user), 1);
    }
  }
}

exports.User = User;
exports.Users = Users;
