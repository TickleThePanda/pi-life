window.addEventListener('load', function() {

  class Point {
    constructor(x, y) {
      this.x = x;
      this.y = y;
    }

    get length() {
      return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    normalise() {
      if(this.length != 0) {
        return new Point(
          this.x / this.length,
          this.y / this.length
        );
      } else {
        return new Point(0,0);
      }
    }

    scale(scale) {
      return new Point(
        this.x * scale,
        this.y * scale
      );
    }

    add(point) {
      return new Point(
        this.x + point.x,
        this.y + point.y
      );
    }

    sub(point) {
      return new Point(
        this.x - point.x,
        this.y - point.y
      );
    }
  }

  class CanvasInfo {
    constructor(canvas) {
      this.canvas = canvas;
    }

    get size() {
      return Math.min(this.canvas.width, this.canvas.height);
    }

    get marginH() {
      return (this.canvas.width - this.size) / 2;
    }

    get marginV() {
      return (this.canvas.height - this.size) / 2;
    }
  }

  const pushConfig = document.getElementById('pusher').dataset;
  const PUSHER_KEY = pushConfig.key;

  const food = {
    loc: new Point(0.5, 0.5)
  };

  const bot = {
    ACC_SPEED: 0.0005,
    loc: new Point(0.5, 0.5),
    vel: new Point(0, 0)
  };

  const HISTORY_LENGTH = 500;
  let history = [];

  function step() {
    move();
    draw();
  }

  function move() {
    const direction = bot.loc.sub(food.loc);
    const accel = direction.normalise().scale(bot.ACC_SPEED);

    bot.vel = bot.vel.add(accel);
    bot.vel = bot.vel.scale(0.99);
    bot.loc = bot.loc.sub(bot.vel);

    history.push(bot.loc);
    history = history.slice(Math.max(history.length - HISTORY_LENGTH, 0));
  };

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    draw();
  }

  function draw() {
    clear();
    drawBot();
    drawHistory();
  }

  function clear() {
    context.clearRect(0, 0, canvas.width, canvas.height);
  }

  function drawHistory() {
    for (let i = 1; i < history.length; i++) {
      const prevPoint = history[i - 1];
      const curPoint = history[i];

      context.beginPath();

      let brightness = Math.round(255 - 255 * (i / history.length)).toString(16);
      if(brightness.length == 1) {
        brightness = "0" + brightness;
      }
      context.moveTo(
        prevPoint.x * info.size + info.marginH,
        prevPoint.y * info.size + info.marginV);
      context.lineTo(
        curPoint.x * info.size + info.marginH,
        curPoint.y * info.size + info.marginV);

      context.strokeStyle = '#' + brightness + brightness + brightness;

      context.stroke();
    }
  };

  function drawBot() {
    const radius = 3;
    context.beginPath();
    context.arc(
      bot.loc.x * info.size + info.marginH,
      bot.loc.y * info.size + info.marginV,
      radius,
      0,
      2 * Math.PI,
      false);

    context.fillStyle = '#000000';
    context.fill();
    context.closePath();
  };


  const pusher = new Pusher(PUSHER_KEY, {
    cluster: 'eu',
    encrypted: true
  });
  const channel = pusher.subscribe('pi-life');

  const canvas = document.getElementById("world");
  const info = new CanvasInfo(canvas);
  const context = canvas.getContext("2d");

  channel.bind('food', function(data) {
    food.loc = new Point(data.x, data.y);
  });

  window.addEventListener('resize', resizeCanvas, false);
  window.setInterval(step, 41);

  resizeCanvas();
});

