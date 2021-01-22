---
title: A simple game
date: 11 November 2020
---

To try something new I got the idea to create a very basic game. It's just for fun! And as you can see it appears to be pong, a classic. This game works on laptop with the arrow keys and with your thumb on mobile devices. It is build with plain javascript and fun to do.

<canvas id="simple-game"></canvas>
<script defer src="/simple-game/simple-game.js"></script>

Like more game platforms it calculates new positions, possible collisions, and then it will draw the result on the canvas. Repeating this over and over you'll get a game reaching around 60fps. It will also pause the game if you're in a different tab.

```js
// request frames to update values and render the game
window.onload = function() {
  window.requestAnimationFrame(loop)
};

// calculate new positions and draw on canvas
let loop = function() {

  update();
  render();

  // creating a loop, with around 60 loops per second
  window.requestAnimationFrame(loop);
};
```

I couldn't find a nice font that worked with these large texts. So I made my own letters, each of them with a height of 7 blocks. Each character has a variable width, but all letters had a width of 5 and the numbers 6 across. Using a simple array I would know where to draw a rectangle creating a letter. Each rectangle had a variable size. It was not really nessesary but fun to do!

For now you play against a simple AI which improves if your score increases. The game ends if you have a score of 16, good luck! 


```js
// some hints if you're having a hard time
pong.player.width = 450
pong.score = 15
```