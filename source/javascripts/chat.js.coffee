###
Using socket.io I created a small app for chatting with other
visitors. The NodeJS server is located in `/node`, all messages
are logged. This file has the following sections;

- utility function
- templating for messages
- method setting up a connection
- method retrieving username
###

###
declare the chat window if present on this page
most functions are relative from this
###
$chat = $('.chat-window')


# sanitize input for sending chat messages
String::clean = ->
  obj = document.createElement("DIV");
  obj.textContent = this
  return obj.innerHTML || obj.innerText || "";

# parse a template and set variables from arguments
String::format = ->
  args = arguments
  @replace /{(\d+)}/g, (match, number) ->
    if typeof args[number] != 'undefined' then args[number] else match

# create a color from a string (username)
String::color = (s = 50, l = 50) ->
  hash = 0
  i = 0
  while i < this.length
    hash = this.charCodeAt(i) + (hash << 5) - hash
    i++
  h = hash % 360
  return 'hsl(' + h + ', ' + s + '%, ' + l + '%)'


# events printing messages or events
$chat.on 'message', (event, data) ->
  $chat.find('.body > ul').append($('template.message').html().format(data.username, data.message, data.username.color()))
  $chat.find('.body > ul').stop().animate({ scrollTop: $chat.find('.body > ul')[0].scrollHeight}, 500);

$chat.on 'event', (event, data) ->
  $chat.find('.body > ul').append($('template.event').html().format(data))
  $chat.find('.body > ul').stop().animate({ scrollTop: $chat.find('.body > ul')[0].scrollHeight}, 500);



###
Connect to server using socket.io. Set all required
events for sending and receiving messages.
###
jQuery.fn._setup = (user) ->
  socket = io('http://localhost:3000')
  window.reconnect_attempt = 0

  $chat.find('input.message').removeAttr('placeholder').val('');
  $chat.find('form.terminal').off()
  $chat.find('input[name=submit]').val('send')

  # send message on submit
  $chat.find('form.terminal').on 'submit', (event) ->
    event.preventDefault()

    message = $chat.find('input.message').val().clean()
    return unless !!message

    response = socket.emit 'broadcast', message

    if response.connected
      $chat.trigger 'message', {username: user, message: message}
      $chat.find('input.message').val('')


  # someone connected or left
  socket.on 'hello', (data) ->
    $chat.trigger 'event', data.message
    console.log data.users

  socket.on 'bye', (data) ->
    $chat.trigger 'event', data.message

  socket.on 'typing', (data) ->
    console.log data


  # receiving a message
  socket.on 'broadcast', (data) ->
    $chat.trigger 'message', data

  # default socket events
  # disconnected
  socket.on 'disconnect', ->
    $chat.trigger 'event', 'you have been disconnected'

  # you're reconected
  socket.on 'reconnect', ->
    socket.emit 'reconnected', user
    $chat.trigger 'event', 'you are reconnected, welcome back'

    window.reconnect_attempt = 0

  # reconnect has failed
  socket.on 'reconnect_error', (error) ->
    if window.reconnect_attempt < 1
      $chat.trigger 'event', 'we\'re not able to reconnect, where are you at?'

    if window.reconnect_attempt > 5
      socket.close()
      $chat.trigger 'event', 'it seems we\'re not able to find eachother.. goodbye'
      $chat._init()

    ++window.reconnect_attempt

  # close connection on red button and clear username from cookie
  $chat.find('span.bullet-close').on 'click', (event) ->
    localStorage.removeItem 'username'

    socket.close()
    $chat._init()

  # start connection, sent first message once all
  # events are set. Good to go!
  socket.emit 'connected', user


###
method requesting username. Before messages are send
a username should be entered either from input or using
the cookie from previous sessions.
###
jQuery.fn._init = ->
  $chat.find('form.terminal').off()
  $chat.find('input[name=submit]').val('enter')

  $chat.find('form.terminal').on 'submit', (event) ->
    event.preventDefault()

    user = $chat.find('input.message').val().clean()
    return unless !!user

    localStorage.username = user
    $chat._setup user


###
Check if username is already set otherwise prompt for
a username in the input box
###
username = localStorage.username
if username?
  $chat._setup username
else
  $chat._init()
