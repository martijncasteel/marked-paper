const MOBILE_DEVICE = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
const STATES = { COIN: 0, PLAYING: 1, GAMEOVER: 2 }
const MAX_SCORE = 17;

let canvas = document.getElementById('simple-game')
canvas.width  = canvas.offsetWidth;
canvas.height = canvas.width * 1,5;

if(MOBILE_DEVICE)
  canvas.height = canvas.width * 2;

let context = canvas.getContext('2d');
let state = STATES.COIN;
let frame_count = 0;
let pressed = {};

const characters = {
  '0': [...'011110110011110011110011110011110011011110'],
  '1': [...'001100011100001100001100001100001100011110'],
  '2': [...'011110110011000011001110011000110000111111'],
  '3': [...'011110110011000011001110000011110011011110'],
  '4': [...'010011010011110011110011011111000011000011'],
  '5': [...'111111110000111110000011000011110011011110'],
  '6': [...'011110110011110000111110110011110011011110'],
  '7': [...'111111000011000110001100001100001100001100'],
  '8': [...'011110110011110011011110110011110011011110'],
  '9': [...'011110110011110011011111000011110011011110'],

  // fontstruct.com/fontstructions/show/629793/5x7_pixel_monospace
  'A': [...'01110100011000111111100011000110001'],
  'E': [...'11111100001000011110100001000011111'],
  'G': [...'01110100001000010111100011000101110'],
  'M': [...'10001110111010110001100011000110001'],
  'N': [...'10001110011100110101100111001110001'],
  'O': [...'01110100011000110001100011000101110'],
  'P': [...'11110100011000111110100001000010000'],
  'R': [...'11110100011000111110100011000110001'],
  'S': [...'01110100011000001110000011000101110'],
  'V': [...'10001100010101001010010100010000100'],

  'c': [...'00000000000111010001100001000101110'],
  'e': [...'00000000000111010001111101000001110'],
  'i': [...'00100000000110000100001000010000100'],
  'n': [...'00000000001011011001100011000110001'],
  'o': [...'00000000000111010001100011000101110'],
  'r': [...'00000000001011011001100001000010000'],
  's': [...'00000000000111110000011100000111110'],
  't': [...'01000010001111001000010000100100110'],

  ' ': [...'00000'],
}

let character = function(character, offset_x, offset_y, size = 5) {
  const pixels = characters[character];
  context.fillStyle = '#fff';

  if(pixels == undefined)
    return 0

  if(character === ' ')
    return pixels.length * size;

  const cols = pixels.length / 7;

  for(let y = 0; y < 7; y++)
    for(let x = 0; x < cols; x++)
      if(pixels[y * cols + x] == '1')
        context.fillRect(x * size + offset_x, y * size + offset_y, size, size)

  // width of the letter
  return cols * size
}

let text = function(string, offset_x, offset_y, size = 5, spacing = 5) {
  let offset = 0;

  for(let c in [...string]){
    offset = character([...string][c], offset_x + c * offset, offset_y, size) + spacing
  }
}

window.addEventListener('keydown', function(event) {
  pressed[event.key] = true;
});

window.addEventListener('keyup', function(event) {
  delete pressed[event.key];
});

canvas.addEventListener('click', function(event){
  if(state == STATES.GAMEOVER) {
    player.reset()
    computer.reset()

    capture_touches(enable=false)
    state = STATES.PLAYING;
    return;
  }

  capture_touches(enable=true)
  state = STATES.PLAYING;
});


// request frames to update values and render the game
window.onload = function() {
  frame_count = window.requestAnimationFrame(loop)
};

let capture_touches = function(enable){
  if(!enable){
    canvas.removeEventListener('touchstart');
    canvas.removeEventListener('touchmove');

    return
  }

  if(!MOBILE_DEVICE)
    return

  let touch = function(event){
    if(event.touches)
      pressed['touch'] = event.touches[0].pageX - canvas.offsetLeft - player.width / 2;
    event.preventDefault();
  }

  canvas.addEventListener("touchstart", touch, {passive: false});
  canvas.addEventListener("touchmove", touch, {passive: false});
}

let loop = function() {
  if('Enter' in pressed)
    if(state == STATES.COIN || state == STATES.GAMEOVER)
      state = STATES.PLAYING;

  update();
  render();

  frame_count = window.requestAnimationFrame(loop);
};

// computer and player paddle
class Paddle {
  constructor(x, y) {
    this.x = x;
    this.y = y;

    this.dx = 0;

    this.height = 12;
    this.width = canvas.width * 0.25;

    this.score = 0;
  }

  update(level = 0) {
    const max_movement = 4 + level / 4;
    this.dx = 0; // if no keys are pressed, movement is 0

    for(let key in pressed){
      if(key == 'ArrowLeft')
        this.move(-max_movement);

      else if(key == 'ArrowRight')
        this.move(max_movement);

      else if(key == 'touch') {
        if(player.x - pressed['touch'] > 0)
          player.move(Math.max(pressed['touch'] - player.x, -4))

        else if(player.x - pressed['touch'] < 0)
          player.move(Math.min(pressed['touch'] - player.x, 4))
      } else
        this.move(0)
    }
  }

  compute(ball, level = 0) {
    const max_movement = 4 + level / 3;
    this.dx = 0;

    let center = this.x + this.width / 2 - 5;

    if(center < ball.x) {
      this.move(Math.min(ball.x - center, max_movement))
    } else if(center > ball.x) {
      this.move(Math.max(ball.x - center, -max_movement))
    } 
  }

  move(dx) {
    this.dx = dx;
    this.x += dx;

    if(this.x < 0){
      this.x = 0;
      this.dx = 0;
    } else if(this.x + this.width > canvas.width) {
      this.x = canvas.width - this.width;
      this.dx = 0;
    }
  }

  hit(ball) {
    if(ball.y > this.y && ball.y < this.y + this.height) {
      if(ball.x > this.x && ball.x < this.x + this.width) {
        // TODO maybe check direction with paddle (or halve of screen) to prevent sticking

        ball.dy = -ball.dy * 1.05;
        ball.dx += this.dx / 2;

        return true;
      }
    }

    return false;
  }

  draw(context) {
    context.fillStyle = '#fff';
    context.fillRect(this.x, this.y, this.width, this.height)
  }

  reset() {
    this.x = canvas.width / 2 - canvas.width * 0.25 / 2;
    this.dx = 0;
    this.score = 0;
  }
}

class Ball {
  constructor() {
    this.reset()
  }

  update(player, computer) {
    this.x += this.dx;
    this.y += this.dy;

    // check for sides
    if(this.x - 5 < 0 || this.x + 5 > canvas.width)
      this.dx = -this.dx;

    // ball passed paddle
    if(this.y < 0){
      player.score++
      ball.reset(3)
    } else if(this.y > canvas.height) {
      computer.score++
      ball.reset(-3)
    }

    player.hit(ball);
    computer.hit(ball);
  }

  reset(dy = 3) {
    this.x = canvas.width / 2 - 5;
    this.y = canvas.height / 2 - 5;

    this.dx = 0;
    this.dy = dy;
  }

  draw(context) {
    context.beginPath();
    context.fillStyle = '#fff';
    context.arc(this.x, this.y, 5, 2 * Math.PI, false);
    context.fill();
  }
}


// initialize player and computer's paddle, and the star of the game the ball
const player = new Paddle(canvas.width / 2 - canvas.width * 0.25 / 2, canvas.height - 30);
const computer = new Paddle(canvas.width / 2 - canvas.width * 0.25 / 2, 15);
const ball = new Ball();


// compute collisions and sofort
let update = function() {
  if(player.score > MAX_SCORE || computer.score > MAX_SCORE){
    state = STATES.GAMEOVER
    capture_touches(enable=false)
  }

  if(state != STATES.PLAYING)
    return

  player.update(computer.score);
  computer.compute(ball, player.score);

  ball.update(player, computer);
};

// draw new frame
let render = function() {
  context.clearRect(0, 0, canvas.width, canvas.height)

  player.draw(context);
  computer.draw(context);

  // ask for coin
  if(state == STATES.COIN)
    text('PONG', canvas.width/2 - 107, 200, 10)

  if(state == STATES.GAMEOVER)
    text('GAME OVER', canvas.width/2 - 245, 200, 10)

  if(state == STATES.COIN || state == STATES.GAMEOVER){
    if(frame_count % 60 < 30){
      context.strokeStyle = '#fff';
      context.lineWidth = 5;
      context.strokeRect(canvas.width/2 - 107, 380, 215, 40);

      text('insert coin', canvas.width/2 - 92, 390, 3, 2)
      text('or PRESS enter', canvas.width/2 - 83, 430, 2, 2)
    }
  }
  
  if(state == STATES.PLAYING)
    ball.draw(context);

  // score board
  text(player.score.toString(), canvas.width - player.score.toString().length * 35 - 5, canvas.height - 45) 
  text(computer.score.toString(), 10, 10) 
};