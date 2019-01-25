exports.reply = {
  welcome:          '001',
  your_host:        '002',
  created:          '003',
  my_info:          '004',

  names_reply:      '353',
  names_end:        '366',

  list_reply:       '322',
  list_end:         '323',

  version:          '351',
  time:             '391',

  motd_start:       '375',
  motd:             '372',
  motd_end:         '376'
};

exports.errors = {
  no_such_nick:     '401',
  cannot_send:      '404',
  no_recipient:     '411',
  no_text_to_send:  '412',

  unknown_command:  '421',

  no_nick_given:    '431',
  bad_nick:         '432',
  name_in_use:      '433',
  no_such_channel:  '403',
  no_on_channel:    '442',
  not_registered:   '451',

  need_more_params: '461',

  already_registred:'462',
  you_are_banned:   '465',
  ban_chan_mask:    '476'
};

exports.validations = {
  // starts with letter, than more letters, digits or -[]\`^{}
  invalid_nick: /^[^a-z]|[^\w_^`\\\[\]{}]/i,

  // any 8bit code except NUL, BELL, LF, CR, SPACE and comma
  invalid_channel: /[\x00\x07\n\r ,]/
};
