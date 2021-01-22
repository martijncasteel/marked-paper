const MOBILE_DEVICE = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
const STATES = { COIN: 0, PLAYING: 1, GAMEOVER: 2 }
const MAX_SCORE = 16;

const CHARACTERS = {
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

let pong;
let canvas;
let frame_count = 0;
let pressed = {};


// computer and player paddle
class Paddle {
  constructor(canvas, y) {
    this.canvas = canvas
    this.x = this.canvas.width / 2 - this.canvas.width * 0.25 / 2;
    this.y = y;

    this.dx = 0;

    this.height = 12;
    this.width = this.canvas.width * 0.25;

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
        if(this.x - pressed['touch'] > 0)
          this.move(Math.max(pressed['touch'] - this.x, -4))

        else if(this.x - pressed['touch'] < 0)
          this.move(Math.min(pressed['touch'] - this.x, 4))
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
    } else if(this.x + this.width > this.canvas.width) {
      this.x = this.canvas.width - this.width;
      this.dx = 0;
    }
  }

  hit(ball) {
    if(ball.y > this.y && ball.y < this.y + this.height) {
      if(ball.x > this.x && ball.x < this.x + this.width) {
        ball.dy = -ball.dy;
        ball.dx += this.dx / 2;

        if(ball.dy > -10 && ball.dy < 10)
          ball.dy *= 1.05;
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
    this.x = this.canvas.width / 2 - this.canvas.width * 0.25 / 2;
    this.dx = 0;
    this.score = 0;
  }
}

class Ball {
  constructor(canvas) {
    this.canvas = canvas
    this.reset()
  }

  update(player, computer) {
    this.x += this.dx;
    this.y += this.dy;

    // check for sides
    if(this.x - 5 < 0 || this.x + 5 > this.canvas.width)
      this.dx = -this.dx;

    // ball passed paddle
    if(this.y < 0){
      player.score++
      this.reset(3)
    } else if(this.y > this.canvas.height) {
      computer.score++
      this.reset(-3)
    }

    player.hit(this);
    computer.hit(this);
  }

  reset(dy = 3) {
    this.x = this.canvas.width / 2 - 5;
    this.y = this.canvas.height / 2 - 5;

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


class Pong {
  #canvas;
  #player;
  #computer;
  #ball;
  #state

  constructor(el) {
    this.#canvas = el;
    this.#canvas.width  = this.#canvas.offsetWidth;
    this.#canvas.height = this.#canvas.width * 1,5;

    if(MOBILE_DEVICE)
      this.#canvas.height = this.#canvas.width * 2;
  
    this.context = this.#canvas.getContext('2d');
    this.#state = STATES.COIN;

    // initialize player and computer's paddle, and the star of the game the ball
    this.#player = new Paddle(this.#canvas, this.#canvas.height - 30);
    this.#computer = new Paddle(this.#canvas, 15);
    this.#ball = new Ball(this.#canvas);

    this.#addEventListeners(this.#canvas)
  }

  // compute collisions and sofort
  update() {
    if('Enter' in pressed)
      if(this.#state == STATES.COIN || this.#state == STATES.GAMEOVER)
        this.#state = STATES.PLAYING;

    if(this.#player.score >= MAX_SCORE || this.#computer.score >= MAX_SCORE){
      this.#state = STATES.GAMEOVER
      capture_touches(this.#canvas, false)
    }

    if(this.#state != STATES.PLAYING)
      return

    this.#player.update(this.#computer.score);
    this.#computer.compute(this.#ball, this.#player.score);

    this.#ball.update(this.#player, this.#computer);
  }

  // draw new frame
  render(frame_count) {
    this.context.clearRect(0, 0, this.#canvas.width, this.#canvas.height)

    this.#player.draw(this.context);
    this.#computer.draw(this.context);

    // ask for coin
    if(this.#state == STATES.COIN)
      this.#text('PONG', this.#canvas.width/2 - 107, 200, 10)

    if(this.#state == STATES.GAMEOVER)
      this.#text('GAME OVER', this.#canvas.width/2 - 245, 200, 10)

    if(this.#state == STATES.COIN || this.#state == STATES.GAMEOVER){
      if(frame_count % 60 < 30){
        this.context.strokeStyle = '#fff';
        this.context.lineWidth = 5;
        this.context.strokeRect(this.#canvas.width/2 - 107, 380, 215, 40);

        this.#text('insert coin', this.#canvas.width/2 - 92, 390, 3, 2)
        this.#text('or PRESS enter', this.#canvas.width/2 - 83, 430, 2, 2)
      }
    }
    
    if(this.#state == STATES.PLAYING)
      this.#ball.draw(this.context);

    // score board
    this.#text(this.#player.score.toString(), this.#canvas.width - this.#player.score.toString().length * 35 - 5, this.#canvas.height - 45) 
    this.#text(this.#computer.score.toString(), 10, 10) 
  }

  #addEventListeners(canvas) {
    window.addEventListener('keydown', (event) => {
      pressed[event.key] = true;
    });

    window.addEventListener('keyup', (event) => {
      delete pressed[event.key];
    });

    canvas.addEventListener('click', (event) => {
      if(this.#state == STATES.GAMEOVER) {
        this.#player.reset()
        this.#computer.reset()

        this.#capture_touches(canvas, false)
        this.#state = STATES.PLAYING;
        return;
      }

      this.#capture_touches(canvas, true)
      this.#state = STATES.PLAYING;
    })
  }

  #capture_touches(canvas, enable) {
    let touch = (event) => {
      if(event.touches)
        pressed['touch'] = event.touches[0].pageX - canvas.offsetLeft - this.#player.width / 2;
      event.preventDefault();
    }

    if(!enable){
      canvas.removeEventListener('touchstart', touch);
      canvas.removeEventListener('touchmove', touch);

      return
    }

    if(!MOBILE_DEVICE)
      return

    canvas.addEventListener("touchstart", touch, {passive: false});
    canvas.addEventListener("touchmove", touch, {passive: false});
  }

  // todo #var and #method for private usage
  #character(character, offset_x, offset_y, size = 5) {
    const pixels = CHARACTERS[character];
    this.context.fillStyle = '#fff';

    if(pixels == undefined)
      return 0

    if(character === ' ')
      return pixels.length * size;

    const cols = pixels.length / 7;

    for(let y = 0; y < 7; y++)
      for(let x = 0; x < cols; x++)
        if(pixels[y * cols + x] == '1')
          this.context.fillRect(x * size + offset_x, y * size + offset_y, size, size)

    // width of the letter
    return cols * size
  }

  #text(string, offset_x, offset_y, size = 5, spacing = 5) {
    let offset = 0;

    for(let c in [...string]){
      offset = this.#character([...string][c], offset_x + c * offset, offset_y, size) + spacing
    }
  } 
}

let loop = () => {
  pong.update();
  pong.render(frame_count);

  frame_count = window.requestAnimationFrame(loop);
}

window.addEventListener('domchanged', (e) => {
  const canvas = e.detail.target.querySelector('canvas#simple-game')

  if (!canvas)
    return

  if(!!pong)
    return

  pong = new Pong(canvas)
  frame_count = window.requestAnimationFrame(loop);
})

window.onload = () => {
  const canvas = document.getElementById('simple-game')

  if (!canvas)
    return

  pong = new Pong(canvas)
  frame_count = window.requestAnimationFrame(loop);
};