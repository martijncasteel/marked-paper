---
title: Chat over websockets
date: 24 November 2017
additional: Hello there!
description: A pratical approach to chat over websockets. A fun way to communicatie with others on my website.
---

A new small project, something to play around with. A chat application that allows people to chat on my webpages using websockets.

<template class="message">
  <li>
    <span style="color: {2}" class="name">{0}</span>
    <span style="border-color: {2}" class="message">{1}</span>
  </li>
</template>

<template class="event">
  <li>
    <span class="event">{0}</span>
  </li>
</template>

<div class="chat-window">
  <div class="header">
    <span class="bullet bullet-close"></span>
    <span class="bullet bullet-minimize"></span>
    <span class="bullet bullet-maximize"></span>
  </div>

  <div class="body">
    <ul>
      <li>
        <span style="color: hsl(359, 50%, 50%)" class="name">martijn</span>
        <span style="border-color: hsl(359, 50%, 50%)" class="message">Hello! First of all welcome to my blog, this is a chat window you can use to chat with anybody.<br/><br/>Due notice that the chat is not private so anybody can read your messages! For any questions contact me at <a href="mailto:hello@martijncasteel.nl">hello@martijncasteel.nl</a>.</span>
      </li>
      <li>
        <span style="color: hsl(359, 50%, 50%)" class="name">martijn</span>
        <span style="border-color: hsl(359, 50%, 50%)" class="message">The chat client is currently disabled, since it wasn't use by anyone.</span>
      </li>   
    </ul>
  </div>

  <form class="terminal">
    <span>martijn is typing...</span>
    <input name="message" class="message" disabled="disabled" />
    <input type="submit" name="submit" value="send" disabled="disabled" />
  </form>
</div>

This small project is made using NodeJS, I tried NodeJS before but I didn't like it that much. However for websockets I think it's the tool to use. For the application I used Socket.io which helps a lot; creating a connection, trying to reconnect, and sending messages to the connected sockets.
