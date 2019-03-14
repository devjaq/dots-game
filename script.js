var myGamePiece;
let greyObject;
let blueObject;
let redObject;
let greyCounter;
let rewardButton;
let upgradeNumber = 2;
let controlArea;

let x, y;

///// CREATE NON-CANVAS DISPLAY ELEMENTS /////

const topDisplay = document.createElement("section");
topDisplay.setAttribute('id', 'top-display');
document.body.appendChild(topDisplay);

let info = document.createElement("p");
info.setAttribute('id', 'info');
info.innerText = "Use the arrow keys or WASD keys to move the rectangle and collect the squares!";
topDisplay.appendChild(info);

controlArea = document.createElement("section");
controlArea.setAttribute('id', 'control-area');
document.body.appendChild(controlArea);

let screenWidth = window.innerWidth;
let screenHeight = window.innerHeight - controlArea.clientHeight;

function randomX() {
  x = Math.floor(Math.random() * (screenWidth - 50));
  return x;
}

function randomY() {
  controlArea = document.getElementById('control-area');
  // console.log(controlArea.clientHeight);
  if (controlArea.clientHeight) {
    y = Math.floor(Math.random() * (screenHeight - controlArea.clientHeight) + controlArea.clientHeight);
  } else {
    y = Math.floor(Math.random() * (screenHeight));
  }
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

///// START COUNTERS /////

let counterBox = document.createElement("section");
counterBox.setAttribute('id', 'counter-box');
topDisplay.appendChild(counterBox);

greyCounter = document.createElement("div");
counterBox.appendChild(greyCounter);
greyCounter.setAttribute('id', 'greyCounter');
greyCounter.classList.add("counter");
greyCounter.innerHTML = `Hi!`;

blueCounter = document.createElement("div");
counterBox.appendChild(blueCounter);
blueCounter.setAttribute('id', 'blueCounter');
blueCounter.classList.add("counter");
blueCounter.innerHTML = `Hi!`;

redCounter = document.createElement("div");
counterBox.appendChild(redCounter);
redCounter.setAttribute('id', 'redCounter');
redCounter.classList.add("counter");
redCounter.innerHTML = `Hi!`;

///// END COUNTERS /////
console.log(myGameArea.canvas.width);
console.log(myGameArea.canvas.hasAttribute("width"));


console.log(myGameArea.canvas.attributes);


function startGame() {
  greyCounter.innerHTML = 0;
  blueCounter.innerHTML = 0;
  redCounter.innerHTML = 0;
  myGamePiece = new component(30, 70, "red", 225, 225);
  greyObject = new component(10, 10, "gray", randomX(), randomY());
  blueObject = new component(10, 10, "$deep-blue", randomX(), randomY());
  redObject = new component(10, 10, "red", randomX(), randomY());
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
    let wallTop = 0;
    let wallRight = screenWidth;
    let wallBottom = screenHeight;
    let wallLeft = 0;
    let contact = true;
    if (
      myBottom < otherTop || 
      myTop > otherBottom ||
      myRight < otherLeft ||
      myLeft > otherRight || myTop < wallTop || myBottom > wallBottom
    ) {
      contact = false;
    }
    return contact;
  };
}

function upgrade(){
  console.log("upgrade!");
  // subtract upgrade number from totals
  greyCounter.innerHTML = Number(greyCounter.innerHTML) - upgradeNumber;
  blueCounter.innerHTML = Number(blueCounter.innerHTML) - upgradeNumber;
  redCounter.innerHTML = Number(redCounter.innerHTML) - upgradeNumber;
  // if any counter is less that upgrade value, disable button
  if (Number(greyCounter.innerHTML) < upgradeNumber || Number(blueCounter.innerHTML) < upgradeNumber || Number(redCounter.innerHTML) < upgradeNumber) {
    rewardButton.setAttribute('disabled', "");
  }
}

function updateGameArea() {
  function fifteen() {
    if (Number(greyCounter.innerHTML) >= upgradeNumber && Number(blueCounter.innerHTML) >= upgradeNumber && Number(redCounter.innerHTML) >= upgradeNumber) {
      // check if button exists, else create
      if (document.getElementById('reward-button')) {
        rewardButton.removeAttribute('disabled');
      } else {
        rewardButton = document.createElement('button');
        rewardButton.setAttribute('id', 'reward-button');
        rewardButton.setAttribute('onclick', 'upgrade()')
        rewardButton.innerText = "Upgrade!";
        controlArea.appendChild(rewardButton);
      }
    }
  }
  if (myGamePiece.contact(greyObject)) {
    greyObject = new component(10, 10, "gray", randomX(), randomY());
    greyCounter.innerHTML = Number(greyCounter.innerHTML) + 1;
    fifteen();
  } else if (myGamePiece.contact(blueObject)) {
    blueObject = new component(10, 10, "blue", randomX(), randomY());
    blueCounter.innerHTML = Number(blueCounter.innerHTML) + 1;
    fifteen();
  } else if (myGamePiece.contact(redObject)) {
    redObject = new component(10, 10, "red", randomX(), randomY());
    redCounter.innerHTML = Number(redCounter.innerHTML) + 1;
    fifteen();
  } else if (myGamePiece.x < 0) {
    myGamePiece.speed = 0;
    myGamePiece.x += 1;
  } else if (myGamePiece.x > myGameArea.canvas.clientWidth) {
    myGamePiece.speed = 0;
    myGamePiece.x -= 1;
  } else if (myGamePiece.y < 0) {
    myGamePiece.speed = 0;
    myGamePiece.y += 1;
  } else if (myGamePiece.y > myGameArea.canvas.clientHeight) {
    myGamePiece.speed = 0;
    myGamePiece.y -= 1;
  } else {
    // console.log(myGamePiece.x, myGamePiece.y);
    // console.log(myGameArea.canvas.clientHeight);
    
    myGameArea.clear();
    myGamePiece.moveAngle = 0;
    myGamePiece.speed = 0;
    ///// START KEYBOARD CONTROLS /////
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
      ///// END KEYBOARD CONTROLS /////
    }
    greyObject.update();
    blueObject.update();
    redObject.update();
    myGamePiece.newPos();
    myGamePiece.update();
  }
}
