var globalSoundValueForMe = 0;
var startButton;
var stopButton;
var cam;
var myVideo;

// let har = false;
let leftCat;
let rightDog;
let catCursor;
let dogCursor;
let harmony;
let harmonySound;
let all = {};
let p5l;
let groundTexture;
let inconsolata;
let frameCounter = 0;

var instantMeter;
var instantValueDisplay;
// let inTextBox = false;

function preload() {
  leftCat = loadImage("./PusheenNdonut.jpeg");
  rightDog = loadImage("./puppyNdonut.jpg");
  groundTexture = loadImage("./CatAndDog2.png");
  harmonySound = loadSound("./MajorChord.ogg")
  harmony = loadImage("./catAndDog.png");
  goodDog = loadFont("./gooddog_cool.otf");
}

// run this every second
setInterval(() => {
  if (frameCount) {
    sendStats();
  }
}, 1000 / 60);

let cnv;
function setup() {
  cnv = createCanvas(windowWidth, windowHeight, WEBGL);
  textFont(goodDog);
  // Create and set up our camera
  cam = createCamera();

  // Tell p5 to use this camera
  setCamera(cam);
  cam.perspective(PI / 3.0, width / height, 0.1, 50000);

  // position in 3d space
  cam.setPosition(0, -1, 0);
  strokeWeight(0.2);

  catCursor = loadImage("catPaw.png");
  dogCursor = loadImage("puppyClaw.png");

  myVideo = createCapture(constraints, function (stream) {
    p5l = new p5LiveMedia(this, "CAPTURE", stream, "Shout Cube");
    p5l.on("stream", gotStream);
    // p5l.on("disconnect", gotDisconnect);
    p5l.on("data", gotData);
  });

  myVideo.elt.muted = true;
  myVideo.hide();

  startButton = document.getElementById("startButton");
  stopButton = document.getElementById("stopButton");
  startButton.onclick = start;
  stopButton.onclick = stop;

  instantMeter = document.querySelector("#instant meter");
  instantValueDisplay = document.querySelector("#instant .value");

  textField = createInput("Type Here");
  textField.elt.id = "myId";
  textField.position(windowWidth/2-80, 700);

  cnv.hide();
  textField.hide();
}

function draw() {
  background(220, 230, 250);
  lights();
  addGround();
  cameraControls();

  //  Everybody else (gotStream / gotData)
  for (const id in all) {
    all[id].draw();
    
  // if (catCursor) {
  //   let lovesDogs = textField.value().toLowerCase().indexOf("love dog") > -1;
  //   let lovesCats = textField.value().toLowerCase().indexOf("love cat") > -1;
  //    let lovesBoth = textField.value().toLowerCase().indexOf("love both") > -1;
  //   push();
  //   translate(0, -50.1, 0)
  //   if (lovesDogs) {
  //     ambientLight(100); 
  //     ambientMaterial(255, 102, 94);
  //     texture(leftCat);
  //     box(100, 100, 100);
  //   } else if (lovesCats) {
  //     ambientLight(100); 
  //     ambientMaterial(255, 102, 94);
  //     texture(rightDog);
  //     box(100, 100, 100);
  //   } else if (lovesBoth){
  //     ambientLight(100); 
  //     ambientMaterial(255, 102, 94);
  //     texture(harmony);
  //     // har = true;
  //     box(100, 100, 100);
  //     textSize(15);
  //     text("Meow! Thank you for your kindness! Woof!",0,0 );
  //     // harmonySound.play();
  //   }
  //   pop();
  // }
  }

  if (catCursor) {
    let lovesDogs = textField.value().toLowerCase().indexOf("love dog") > -1;
    let lovesCats = textField.value().toLowerCase().indexOf("love cat") > -1;
     let lovesBoth = textField.value().toLowerCase().indexOf("love both") > -1;
    push();
    translate(0, -50.1, 0)
    if (lovesDogs) {
      ambientLight(100); 
      ambientMaterial(255, 102, 94);
      texture(leftCat);
      box(100, 100, 100);
    } else if (lovesCats) {
      ambientLight(100); 
      ambientMaterial(255, 102, 94);
      texture(rightDog);
      box(100, 100, 100);
    } else if (lovesBoth){
      ambientLight(100); 
      ambientMaterial(255, 102, 94);
      texture(harmony);
      // har = true;
      box(100, 100, 100);
      textSize(15);
      text("Meow! Thank you for your kindness! Woof!",0,0 );
      // harmonySound.play();
    }
    pop();
  }
}

const constraints = (window.constraints = {
  audio: true,
  video: true,
});

let meterRefresh = null;

function handleSuccess(stream) {
  // Put variables in global scope to make them available to the
  // browser console.
  window.stream = stream;
  const soundMeter = (window.soundMeter = new SoundMeter(window.audioContext));
  soundMeter.connectToSource(stream, function (e) {
    if (e) {
      alert(e);
      return;
    }
    meterRefresh = setInterval(() => {
      let soundValue = soundMeter.instant;
      globalSoundValueForMe = lerp(globalSoundValueForMe, soundValue, 0.25);

      instantMeter.value = globalSoundValueForMe;
      // instantValueDisplay.innerText = globalSoundValueForMe.toFixed(3);
    }, 200);
  });
}

function handleError(error) {
  console.log(
    "navigator.MediaDevices.getUserMedia error: ",
    error.message,
    error.name
  );
}

function start() {
  console.log("Requesting local stream");
  startButton.disabled = true;
  stopButton.disabled = false;

  try {
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    window.audioContext = new AudioContext();
  } catch (e) {
    alert("Web Audio API not supported.");
  }

  navigator.mediaDevices
    .getUserMedia(constraints)
    .then(handleSuccess)
    .catch(handleError);
}

function stop() {
  console.log("Stopping local stream");
  startButton.disabled = false;
  stopButton.disabled = true;

  window.stream.getTracks().forEach((track) => track.stop());
  window.soundMeter.stop();
  window.audioContext.close();
  clearInterval(meterRefresh);
  instantMeter.value = instantValueDisplay.innerText = "";
}
/*
 * This function adds a ground plane to the scene with a repeating texture on it!
 */
function addGround() {
  // have to push and pop
  push();
  // box has height of 1 so 1/2 of that
  rotateX(Math.PI / 2);
  scale(50, 50, 50);
  textureWrap(CLAMP);
  texture(groundTexture);
  let u = 2048,
    v = 2048;
  beginShape(TRIANGLES);
  vertex(-1, -1, 0, 0, 0);
  vertex(1, -1, 0, u, 0);
  vertex(1, 1, 0, u, v);

  vertex(1, 1, 0, u, v);
  vertex(-1, 1, 0, 0, v);
  vertex(-1, -1, 0, 0, 0);
  endShape();
  pop();
}

/*
 * This function controls the movement of the camera in the space according to keypresses
 */
function cameraControls() {
  if (document.activeElement === textField.elt) {
    return;
  }

  // out controls
  let leftRightMove = 0,
    upDownMove = 0,
    forwardBackwardMove = 0;
  if (keyIsDown(87)) {
    forwardBackwardMove = -0.1;
  }
  if (keyIsDown(83)) {
    forwardBackwardMove = 0.1;
  }
  if (keyIsDown(65)) {
    leftRightMove = -0.1;
  }
  if (keyIsDown(68)) {
    leftRightMove = 0.1;
  }

  // move the camera along its local axes
  cam.move(leftRightMove, 0, forwardBackwardMove);
  cam.eyeY = -1.5;
  // cam.pan(leftRightMove);
}

// function mousePressed() {
//   // if (mouseX<400 && mouseY<400){
//   //   noCursor();
//   //   image(catCursor, mouseX-15, mouseY-15, 30, 30);
//   // }else if (mouseX>400 && mouseY<400){
//   //   noCursor();
//   //   image(dogCursor, mouseX-15, mouseY-15, 30, 30);
//   // }else{
//   //   cursor('grab');
//   // }
// }

function sendStats() {
  let cameraPosition = {
    x: cam.eyeX, // There is no x, y, z
    y: cam.eyeY,
    z: cam.eyeZ,
  };
  let cameraLookAtPoint = {
    x: cam.centerX,
    y: cam.centerY,
    z: cam.centerZ,
  };
  let stats = {
    position: cameraPosition,
    lookAt: cameraLookAtPoint,
    message: textField.value(),
  };
  if (p5l) {
    p5l.send(JSON.stringify(stats));
  }
}

// We got a new stream!
function gotStream(stream, id) {
  stream.hide();
  all[id] = new Avatar(stream, 0, 0, 0);
}

/*
 * This function controls the rotation of the camera in the space when dragging the mouse
 */
function mouseDragged() {
  let scaleFactor = 0.01;
  let deltaX = pmouseX - mouseX;
  let deltaY = pmouseY - mouseY;

  cam.pan(deltaX * scaleFactor);
  cam.tilt(-deltaY * scaleFactor);
}

/*
 * This function deals with incoming position and rotation from other players
 */
// function gotData(data, id) {
//   let stats = JSON.parse(data);
//   let position = stats.position;
//   let lookAt = stats.lookAt;
//   let message = stats.message;
//   all[id].updatePos(position.x, position.y, position.z);
//   all[id].lookAt(lookAt.x,lookAt.y,lookAt.z);
//   all[id].updateMessage(message)
// }

function gotData(data, id) {
  if (all[id] !== undefined) {
    // Check to make sure the user exists in the array before doing something with it
    let stats = JSON.parse(data);
    let position = stats.position;
    let lookAt = stats.lookAt;
    let message = stats.message;
    all[id].updatePos(position.x, position.y, position.z);
    all[id].lookAt(lookAt.x, lookAt.y, lookAt.z);
    all[id].updateMessage(message);
  }
}

function gotDisconnect(id) {
  delete all[id];
}

/*
 * This class sets up an 'avatar' representation of another player in space
 */
class Avatar {
  constructor(vid, x, y, z, message) {
    // new Avatar(0,0,0,0,0);
    this.updatePos(x, y, z);
    this.vid = vid;
    this.heading = 0;
    this.message = message;
  }

  updatePos(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  updateMessage(message) {
    this.message = message;
  }

  // see example here: https://p5js.org/reference/#/p5.Vector/sub
  lookAt(x, y, z) {
    let lookAt = createVector(x, z);
    let position = createVector(this.x, this.z);
    let differenceVec = p5.Vector.sub(lookAt, position);
    this.heading = -1 * differenceVec.heading();
  }

  draw() {
    push();
    translate(this.x, this.y, this.z);

    // needs a rotate - something we have to send through
    // adding Math.PI/2 (90 degrees) is a hack to ensure that we see
    //       // the face rotated right-side up
    //       // (seems the UVs of the box are not always right-side up)
    rotateY(this.heading + Math.PI / 2);

    // box(1, 1, 1)

    push();
    rotateY(frameCounter / 60 + Math.PI / 2);
    frameCounter++;
    fill(255, 190, 166);
    textFont(goodDog);
    textSize(0.15);
    text(this.message, 0, -0.75, 0);
    // box(1, 1, 1)
    pop();

    // textSize(200)
    // text(this.message,100,200,100);
    texture(this.vid);
    let s = map(globalSoundValueForMe, 0, 0.25, 0.5, 4);
    s = lerp(globalSoundValueForMe, s, 0.25);
    box(s, s, s);
    // color(255, 204, 0);
    // translate(s,s,s)
    // cone(0.01, 0.01);
    pop();
    // text(this.message, this.x, this.y - 20, this.z + 200);
    // console.log(this.message)
    // console.log(s)
  }
}

let othercnv;

const s = (p) => {
  let x = 100;
  let y = 100;

  p.setup = function () {
    othercnv = p.createCanvas(800, 600);
  };

  p.draw = function () {
    p.background(255, 190, 166);
    p.fill("white");
    p.textSize(25);
    p.textFont(goodDog);
    p.text("Welcome to DonutChat, a cat-dog-friendly chat, please pick your preference", windowWidth/2-300, 50);
     p.textSize(15);
     p.text("Sorry, other pet-lovers, or ones who love both", windowWidth/2-100, 550);
    p.image(leftCat, 0,100,windowWidth/2,400);
    p.image(rightDog, windowWidth/2,100,windowWidth/2,400);

    if (p.mouseX < 400 && p.mouseY < 400) {
      p.noCursor();
      if (catCursor !== undefined) {
        p.image(catCursor, p.mouseX - 15, p.mouseY - 15, 30, 30);
      }
    } else if (p.mouseX > 400 && p.mouseY < 400) {
      p.noCursor();
      if (dogCursor !== undefined) {
        p.image(dogCursor, p.mouseX - 15, p.mouseY - 15, 30, 30);
      }
    } else {
      p.cursor("grab");
    }
    
  
  };

  p.mousePressed = function () {
    othercnv.hide();
    cnv.show();
    textField.show();
  };
};

new p5(s); // invoke p5
