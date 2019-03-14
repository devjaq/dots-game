var myGamePiece;
let object;
let counter;
let screenWidth = window.innerWidth;
let screenHeight = window.innerHeight;

function randomX() {
  let x = Math.floor(Math.random() * (screenWidth - 0));
  return x;
}

function randomY() {
  let y = Math.floor(Math.random() * (screenHeight - 0));
  return y;
}

var myGameArea = {
  canvas: document.createElement("canvas"),
  start: function() {
    this.canvas.width = screenWidth;
    this.canvas.height = screenHeight;
    this.context = this.canvas.getContext("2d");
    // ctx.moveTo(0, 0);
    // ctx.lineTo(200, 100);
    // CSSStyleDeclaration.stroke();
    document.body.insertBefore(this.canvas, document.body.childNodes[0]);
    this.frameNo = 0;
    this.interval = setInterval(updateGameArea, 20);
    window.addEventListener("keydown", function(e) {
      e.preventDefault();
      myGameArea.keys = myGameArea.keys || [];
      myGameArea.keys[e.keyCode] = e.type == "keydown";
    });
    window.addEventListener("keyup", function(e) {
      myGameArea.keys[e.keyCode] = e.type == "keydown";
    });
  },
  stop: function() {
    clearInterval(this.interval);
  },
  clear: function() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
};


counter = document.createElement("div");
document.body.appendChild(counter);
counter.setAttribute('id', 'counter');
counter.innerHTML = `Hi!`;
console.log(counter.outerHTML);


function startGame() {
  console.log(counter);
  counter.innerHTML = 0;
  myGamePiece = new component(30, 70, "red", 225, 225);
  object = new component(10, 10, "gray", randomX(), randomY());
  myGameArea.start();
}

function toRadians(degrees) {
  let radians = (degrees * Math.PI) / 180;
  return radians;
}

function component(width, height, color, x, y, type) {
  this.type = type;
  this.width = width;
  this.height = height;
  this.speed = 0;
  this.angle = 0;
  this.moveAngle = 0;
  this.x = x;
  this.y = y;
  this.update = function() {
    ctx = myGameArea.context;
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);
    ctx.fillStyle = color;
    ctx.fillRect(this.width / -2, this.height / -2, this.width, this.height);
    ctx.restore();
  };
  this.newPos = function() {
    this.angle = (this.angle * Math.PI) / 180;
    this.x += this.speed * Math.sin(this.angle);
    this.y -= this.speed * Math.cos(this.angle);
  };
  this.contact = function(otherThing) {
    let myLeft = this.x;
    let myRight = this.x + this.width;
    let myTop = this.y;
    let myBottom = this.y + this.height;
    let otherLeft = otherThing.x;
    let otherRight = otherThing.x + otherThing.width;
    let otherTop = otherThing.y;
    let otherBottom = otherThing.y + otherThing.height;
    let contact = true;
    if (
      myBottom < otherTop ||
      myTop > otherBottom ||
      myRight < otherLeft ||
      myLeft > otherRight
    ) {
      contact = false;
    }
    return contact;
  };
}

function updateGameArea() {
  if (myGamePiece.contact(object)) {
    object = new component(10, 10, "gray", randomX(), randomY());
    counter.innerHTML = Number(counter.innerHTML) + 1;
    console.log(counter);
    
  } else {
    myGameArea.clear();
    myGamePiece.moveAngle = 0;
    myGamePiece.speed = 0;

    // 37-39 = arrow keys, others are WASD
    // move left
    if (
      (myGameArea.keys && myGameArea.keys[37]) ||
      (myGameArea.keys && myGameArea.keys[65])
    ) {
      (myGamePiece.speed = 10), (myGamePiece.angle = -90);
    }
    //move right
    if (
      (myGameArea.keys && myGameArea.keys[39]) ||
      (myGameArea.keys && myGameArea.keys[68])
    ) {
      (myGamePiece.speed = 10), (myGamePiece.angle = 90);
    }
    //move up
    if (
      (myGameArea.keys && myGameArea.keys[38]) ||
      (myGameArea.keys && myGameArea.keys[87])
    ) {
      (myGamePiece.speed = 10), (myGamePiece.angle = 0);
      //move up + left
      if (
        (myGameArea.keys && myGameArea.keys[37]) ||
        (myGameArea.keys && myGameArea.keys[65])
      ) {
        (myGamePiece.speed = 10), (myGamePiece.angle = -45);
      }
      //move up + right
      if (
        (myGameArea.keys && myGameArea.keys[39]) ||
        (myGameArea.keys && myGameArea.keys[68])
      ) {
        (myGamePiece.speed = 10), (myGamePiece.angle = 45);
      }
    }
    // move down
    if (
      (myGameArea.keys && myGameArea.keys[40]) ||
      (myGameArea.keys && myGameArea.keys[83])
    ) {
      (myGamePiece.speed = 10), (myGamePiece.angle = 180);
      //move down + left
      if (
        (myGameArea.keys && myGameArea.keys[37]) ||
        (myGameArea.keys && myGameArea.keys[65])
      ) {
        (myGamePiece.speed = 10), (myGamePiece.angle = 225);
      }
      //move down + right
      if (
        (myGameArea.keys && myGameArea.keys[39]) ||
        (myGameArea.keys && myGameArea.keys[68])
      ) {
        (myGamePiece.speed = 10), (myGamePiece.angle = 135);
      }
    }
    object.update();
    myGamePiece.newPos();
    myGamePiece.update();
  }
}
