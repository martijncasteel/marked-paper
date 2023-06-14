---
title: Launchpad
date: 14 June 2023
description: Latest side project, creating my own usb hid device from scratch. 
---

For the last two years I have been working on [Launchpad](https://github.com/martijncasteel/launchpad) (trademark pending). This is a simple device with just 7 buttons that would make me the best Microsoft Teams user there is! A device that can easily mute my microphone with the press of a button, or even holding it to talk. 

![launchpad](/launchpad/image.jpeg)

It was an awesome way to learn more about [hardware](https://github.com/martijncasteel/launchpad/tree/main/pcb), flashing microcontrollers, and learning [embedded programming](https://github.com/martijncasteel/launchpad/tree/main/code). I spend more money and time than I would admit, but I liked it a lot. Unfortunately, I have not achieved my goal. Microsoft Teams requires a certification to really create a device that manipulate Teams without being in focus. 

I started of by creating schematics. The opensource schematics of Arduino are very helpful. After like half a year of checking the schematics, the bill of materials, and the crystal circuit I ordered a manufacturer to create and populate five of my Launchpad 1.0 boards. There was a small problem where I added the wrong usb-c port to the bom. So that probably set me back another half year. After ruining 2 boards myself I found someone with better equipment and a steadier hand. He managed to solder all the pins of the usb-c port. Thanks!

![schematic](/launchpad/schematic.jpg)

Then the programming began, first I started with the Arduino IDE. The Atmega32u4 is a very common microcontroller in the Arduino Pro Micro and Leonardo. What a great feeling to see the led blinking. But I wanted more, I have been using Arduino quite often and I liked to be more in control. Also, I needed it since Arduino doesn't provide USB-HID control out of the box other than a mouse or a keyboard.

So I set up VSCode to be able to make use of avr-gcc. A simple [Makefile](https://github.com/martijncasteel/launchpad/blob/main/code/Makefile) made my life a lot easier. Using an example of one other guy, some great explanation videos of [Ben Eater](https://www.youtube.com/watch?v=2lPzTU-3ONI) on USB keyboards, and reading through lots of [documentation](https://github.com/martijncasteel/launchpad/tree/main/code/docs) of USB.org. I managed to get ahead with small steps. Eventually, the board was able to increase and decrease my output volume and mute it. As mentioned, the board is not able to mute the microphone on Teams without having focus.