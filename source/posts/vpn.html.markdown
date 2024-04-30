---
title: VPN
date: 30 April 2024
description: Small project to be able to create a vpn 
---

During a holiday in the UK we encounted a great show called _Pottery throwdown_. Which is a great show about pottery, since then we did a workshop to do our own pottery. Pottery throwdown is free to watch on channel 4 in the UK, unfortantly I cannot watch it at home. 

Flustered by his, as any IT guy would do, I created something to fix this issue. Using Ansible I am now able to setup an on the fly vpn server in the UK to connect to from home. Using [Wireguard](https://www.wireguard.com/) I can act if I'm in Londen. 

The project started small. I have done ansible before so using a little bit of commandline locally I could setup a small virtual server, a droplet. This VM has the latest ubuntu version and the ssh credentials it needs to connect to. Ansible will wait for the server to be up and running and then will login and install software like Wireguard.

After the wireguard is installed and configured with my keys I am able to connect with the vpn and watch my tv show. To reduce costs I have a create a simple webpage to create and destroy this server. It takes a few minutes to build up which is fine. This webpage has an api written in Go which I wanted to learn as well.

So the webpage is able to create a server and let Ansible install all the required software and configuration for Wireguard. I wanted to have some more feedback, therefore I added a simple go script that runs on the server and uses the Wireguard cli to retrieve usage information. This script reports this information to the webpage mentioned earlier. The webpage is updated with this information using websockets giving a live view of the bandwidth used on the vpn server.

This project is far from perfect but I did like to do some programming and learn a little bit of [Go](https://go.dev/). And I can now happily finish the season of [Pottery throwdown](https://www.channel4.com/programmes/the-great-pottery-throw-down)! 