var irc = require('./protocol'),
    User = require('./user');

const util = require('util')

function Commands(server) {
  this.server = server;
}

Commands.prototype = {

  // polling ensuring client is still connected
  PING: function(user, hostname) {
    user.lastPing = Date.now();
    user.send(this.server.host, 'PONG', this.server.config.hostname, this.server.host);
  },

  PONG: function(user, hostname) {
    user.lastPing = Date.now();
  },

  // USER type messages for logging in and changing nick
  NICK: function(user, nick) {
    if (!nick || nick.length === 0) {
      return user.send(this.server.host, irc.errors.no_nick_given, ':No nickname given');
    } else if (nick === user.nick) {
      return;
    } else if (nick.length > 9 || nick.match(irc.validations.invalid_nick)) {
      return user.send(this.server.host, irc.errors.bad_nick, (user.nick || ''), nick, ':Erroneous nickname');
    } else if (user.exists(nick)) {
      return user.send(this.server.host, irc.errors.name_in_use, '*', nick, ':is already in use');
    }

    nick = nick.trim();
    user.send(user.mask, 'NICK', ':' + nick);

    user.channels.forEach(function(channel) {
      var users = channel.users.splice(channel.users.indexOf(user), 1);

      users.forEach(function(user) {
        user.send(user.mask, 'NICK : ' + nick);
      });
    });

    user.nick = nick;
  },

  // after NICK command is received, a USER command is expected
  USER: function(user, username, hostname, servername, realname) {
    if(user.registered) return user.send(this.server.host, irc.errors.already_registred, ':Unauthorized command (already registered)');

    this.server.users.register(user, username, realname);

    user.send(this.server.host, irc.reply.welcome, 'Welcome to the', this.server.config.network, user.nick + '@' + user.address);
    user.send(this.server.host, irc.reply.your_host, 'Your host is', this.server.config.hostname, 'running version', this.server.config.version);
    user.send(this.server.host, irc.reply.created, 'This server was created', this.server.created);
    user.send(this.server.host, irc.reply.my_info, this.server.config.hostname, this.server.config.version);
  },

  JOIN: function(user, channels) {
    var server = this.server;
    if (!channels || !channels.length) return user.send(this.server.host, irc.errors.need_more_params, user.nick, ':Need more parameters');

    channels.split(',').forEach(function(args){
      var name = args.split(' ')[0];

      if(name.match(irc.validations.invalid_channel)) return user.send(server.host, irc.errors.ban_chan_mask, ':No such channel');
      if(['#','&'].indexOf(name[0]) === -1) return user.send(server.host, irc.errors.ban_chan_mask, ':No such channel');

      server.channels.join(user, name);
    });
  },

  PART: function(user, channels) {
    var server = this.server;
    if (!channels || !channels.length) return user.send(this.server.host, irc.errors.need_more_params, user.nick, ':Need more parameters');

    channels.split(',').forEach(function(args){
      var channel = server.channels.find(args.split(' ')[0]);

      if (!channel) return user.send(server.host, irc.errors.no_such_channel, ':No such channel');
      if (user.channels.indexOf(channel) === -1) return user.send(server.host, irc.errors.no_on_channel, channel.name, ':You\'re not on that channel');

      channel.broadcast(user.mask, 'PART', channel.name);
      channel.part(user);

      if (channel.users.length === 0 ) server.channels.remove(channel);
    });
  },

  PRIVMSG: function(user, target, message) {
    if(!target || target.length === 0) return user.send(this.server.host, irc.errors.no_recipient, ':No recipient given');
    if(!message || message.length === 0) return user.send(this.server.host, irc.errors.no_text_to_send, ':No text to send');

    var channel = this.server.channels.find(target);

    if(channel) {
      if (user.channels.indexOf(channel) === -1) return user.send(this.server.host, irc.errors.cannot_send, channel.name, ':Cannot send to channel');
      return channel.broadcast(user.mask, 'PRIVMSG', channel.name, ':' + message)
    } else {
      recipient = this.server.users.find(target);
      if(recipient) return recipient.send(user.mask, 'PRIVMSG', recipient.nick, ':' + message);
    }

    user.send(this.server.host, irc.errors.no_such_nick, user.nick, target, ':No such nick/channel');
  },

  // listing available channels
  // TODO: subselection
  LIST: function(user, target) {
    var channels = this.server.channels.channels;

    for (var i in channels) {
      var channel = channels[i];

      if(target && target.length !== 0 && target.split(',').indexOf(channel.name) === -1) continue;
      user.send(this.server.host, irc.reply.list_reply, user.nick, channel.name, channel.users.length);
    }

    user.send(this.server.host, irc.reply.list_end, user.nick, ':End of LIST');
  },

  // retrieving a list
  NAMES: function(user, target) {
    var server = this.server,
        channels = this.server.channels.channels
        users = this.server.users.users;

    for (var i in channels) {
      if(target && target.length !== 0 && target.split(',').indexOf(channels[i].name) === -1) continue;
      user.send(server.host, irc.reply.names_reply, user.nick, '=' + channels[i].name, ':' + channels[i].users.map(function(user) {
        return user.nick;
      }).join(' '));
    }
    user.send(this.server.host, irc.reply.names_end, user.nick, '*', ':End of NAMES list.');
  },

  QUIT: function(user, message) {
    user.quit(message);
    delete user;
  },

  // TODO: newline on every 80 characters
  MOTD: function(user) {
    if(!this.server.config.motd) return user.send(this.server.host, irc.error.nomotd, user.nick, ':MOTD File is missing');

    user.send(this.host, irc.reply.motd_start, user.nick, ':- Message of the Day -');
    user.send(this.host, irc.reply.motd, user.nick, ':-', this.server.config.motd);
    user.send(this.host, irc.reply.motd_end, user.nick, ':End of MOTD command.');
  },

  // some stats from the serverside
  TIME: function(user) {
    user.send(this.server.host, irc.reply.time, user.nick, this.server.config.hostname, ':' + (new Date()));
  },

  VERSION: function(user) {
    user.send(this.server.host, irc.reply.version, user.nick, this.server.config.version, this.server.config.hostname, (this.server.config.comments) ? ':' + this.server.config.comments : '');
  },

  ADMIN: function(user) {
    user.send(this.host, irc.reply.admin_me, this.server.hostname, ':Administrative info');
    user.send(this.host, irc.reply.admin_email, ':' + this.server.config.email);
  }
}

module.exports = Commands;
