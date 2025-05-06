//import { Vector } from "../../../../../.vscode/extensions/samplavigne.p5-vscode-1.2.16/p5types/index";

let _DEBUG = false; //enables debug features (like showing hit boxes)

let port;
let connectButton;
let buttonStatus = "";

let documentation = "https://youtu.be/xvFZjo5PgG0"; // Link to PDF documentation that is hosted on the github pages
let docButton;

let timeouts = [];

let song1Data,song2Data;
let synths;
let synth1, synth2, synth3, noise, filter, gain;

/* Sprites used in game and their data
  Sprites are, PLAYER, ENEMY, ROCK, pLASER, eLASER, EXPLODE
  img - image of the sprite
  maxFrames - frames in sprite animation
  framesHeld - how many frames are held for animating
*/
let sprites = {
  "PLAYER":{
    "img":null,
    "maxFrames":4,
    "framesHeld":6
  },
  "ENEMY":{
    "img":null,
    "maxFrames":4,
    "framesHeld":6
  },
  "ROCK":{
    "img":null,
    "maxFrames":4,
    "framesHeld":2
  },
  "pLASER":{
    "img":null,
    "maxFrames":4,
    "framesHeld":0
  },
  "eLASER":{
    "img":null,
    "maxFrames":4,
    "framesHeld":0
  },
  "EXPLODE":{
    "img":null,
    "maxFrames":7,
    "framesHeld":2
  },
};

let spriteSize = 64

let GameStates = Object.freeze({ 
  START: "start",
  PLAY: "play",
  END: "end"
});
let gameState = GameStates.START;

let pX = 0; // player X cord
let pY = 0; // player Y cord
let pFrame = 0; // player anim frame
let pHeld = 6; // frames held left

let pAlive = false; //is player alive
let gameOver = false; // When the game should move to the next gamestate
let pSpeed = 4; //player Speed
let pFlip = false; //player rotation, determines if the player is facing up or down
let pFire = false; //can the player fire
let max_pFire = 4; //How many total lasers the player can fire

let timer = false;
let minute =0;
let second = 0;
let count = 0;
let time = "";
let score = 0; //player score

let HighScore = 1000;

let canSpawnWave = false; // Spawns a wave of enemies, turns ture when the number of enemies reaches 0
let diff = 0; //Difficulty modifies, increases for each wave of enemies and number of rocks
let MAXROCKS = 12; //TOTAL maximum number of rocks that can be shown in game
let maxRocks = 3; // maximum number of rocks
let MAX_COOLDOWN = 3000; //how many frames before the next rock is spawned
let rockCooldown = false;
let addedTime = 1000; //Time that can be randomly added between rock cooldowns

let message = "New High Score!";
let spacing = 20;
let startColor;
let endColor;

let ctrlX = 0;
let ctrlY = 0;
let sw = 0;
let btn1 = 0;
let btn1Prev = 0;
let btn2 = 0;
let btn2Prev = 0;

/* enemy_data | data stored for every enemy spawned
free - is this free to be replaced
x - x location
y - y location
frame - current sprite frame
held - frames held left
canFire - can the enemy fire
fireCooldown - time between each enemy laser fired
speed - enemy speed | speeds up the longer the player survives
flipped -  facing up or down | determined when the enemy spawns

enemies can only fire one laser at a time
*/
let enemies = {

};
let numEnemies = 0;

/* rock_data | data stored for every rock spawned
free - is this free to be replaced
x - x location
y - y location
frame - current sprite frame
held - frames held left
speed - how fast the rocks move | they get faster the longer you survive
dir - is the rock moving up or down
*/
let rocks = {

};
let numRocks = 0;

/* pLaser_data | data stored for every player laser fired
free - is this free to be replaced
x - x location
y - y location
speed - laser speed
frame - current sprite frame
held - frames held left
flipped - determines if facing up or down | also used to determine direction
*/
let pLaser = {

}
let numPLaser = 0;

/* eLaser_data | data stored for every player laser fired
free - is this free to be replaced
x - x location
y - y location
speed - laser speed
fromEnemy - the enemy that fired the laser
frame - current sprite frame
held - frames held left
flipped - determines if facing up or down | also used to determine direction
*/
let eLaser = {

};
let numELaser = 0;


/* explosion_data | data stored for every explosion on screen
free - is this free to be replaced
x - x location
y - y location
frame - current sprite frame
held - frames held left
isPlayer - is the explosion from the player, used for the gameOver sequence

Explosions will appear when the player/enemy/rock is hit with a laser.
After an explosion finishes its animation it'll remove itself
*/
let explos = {

}
let numExplos = 0;

let gameWinX = 340;
let gameWinWidth = 550;
let gameWinY = 0;
let gameWinHeight = 650;

function preload() {
  gameFont = loadFont("media/PressStart2P-Regular.ttf");
}

function setup() {
  imageMode(CENTER);
  colorMode(HSB);
  createCanvas(1330, 670);

  startColor = color(255, 255, 255);
  endColor = color(0, 255, 255);

  port = createSerial();
  connectButton = createButton("Connect to Arduino");
  connectButton.mousePressed(() => {connectToSerial();});
  connectButton.position(0,25);

  // zeroButton = createButton('Zero Joystick');
  // zeroButton.mousePressed(() => {zero();});
  // zeroButton.position(0,50);

  docButton = createButton("Documentation");
  docButton.mousePressed(() => {toDoc();});
  docButton.position(0,0);

  sprites["PLAYER"]["img"] = loadImage("sprites/Ship.png");
  sprites["ROCK"]["img"] = loadImage("sprites/Rock.png");
  sprites["EXPLODE"]["img"] = loadImage("sprites/explode.png")
  sprites["pLASER"]["img"] = loadImage("sprites/playerLazer.png")

  fetch('music/music.json')
  .then(response => response.json())
  .then(data => {
    song1Data = data;
  });
  fetch('music/music2.json')
  .then(response => response.json())
  .then(data => {
    song2Data = data;
  });

  synth1 = new Tone.PolySynth(Tone.Synth, {
    envelope: {
      attack: 0.02,
      decay: 0.1,
      sustain: 0.3,
      release: 1,
    },
    oscillator:{
      type: 'sawtooth'
    },
  }).toDestination();

  synth2 = new Tone.PolySynth(Tone.Synth, {
    envelope: {
      attack: 0.02,
      decay: 0.1,
      sustain: 0.3,
      release: 1,
    },
    oscillator: {
      type: 'square'
    },
  }).toDestination();

  synth3 = new Tone.PolySynth(Tone.Synth, {
    envelope: {
      attack: 0.02,
      decay: 0.1,
      sustain: 0.3,
      release: 1,
    },
    oscillator: {
      type: 'sine'
    },
  }).toDestination();

  filter = new Tone.Filter({
    type: "bandpass",
    frequency: 2000, // Center frequency
    Q: 1,            // Bandwidth (lower Q = wider band)
  }).toDestination();

  gain = new Tone.Gain(3).connect(filter)

  noise = new Tone.NoiseSynth({
    noise: {
      type: 'brown',
    },
    envelope: {
      attack: 0.01,
      decay: 1.5,
      sustain: 0,
      release: 2
    },
  }).connect(gain);

  synths = [synth1, synth2, synth3];
}

function draw() {
  background(220);
  strokeWeight(0)
  fill("GREY")
  rect(gameWinX,gameWinY,gameWinWidth,gameWinHeight); // Game Window, sprites should be bound in this box

  decodeAudInput();
  plr_input();

  let up = false;
  let down = false;

  switch (gameState){

    case GameStates.START:
      draw_sprite(gameWinX + (gameWinWidth/2.5), gameWinY + (gameWinHeight/2), sprites["PLAYER"]["img"], false, 0);
    
      fill("BLACK")
      textAlign(CENTER, CENTER);
      textSize(42);
      textStyle(BOLD);
      text("Tunnel Ship!", gameWinX + (gameWinWidth/2), gameWinY + (gameWinHeight/4));
      
      textSize(24);
      text("-Press FIRE to Start-",615,650/3);

      text("HighScore: " + HighScore, gameWinX + (gameWinWidth/2), gameWinHeight/1.5);

      break;

    case GameStates.PLAY:

      textSize(42);
      fill("BLACK")
      textAlign(LEFT,CENTER);
      text("Score: " + score, gameWinX + gameWinWidth + 10, gameWinHeight/3);
      text("Time: " + time, gameWinX + gameWinWidth + 10, gameWinHeight/2)

      if (!gameOver){
        //Handle Rocks
        for (_rock in rocks){
          let rock = rocks[_rock];
          if (!rock["free"]){
            move_rock(rock);

            if (rock["dir"] == 1) {up = true;}
            else if (rock["dir"] == -1) {down = true;}
          
            draw_hitbox(rock["x"], rock["y"]);
            let flip = false;
            if (rock["dir"] == -1){flip = true;}
            draw_sprite(rock["x"], rock["y"], sprites["ROCK"]["img"], flip, rock["frame"]);

            if (rock["held"] == 0){
              rock["frame"] += 1;
              if (rock["frame"] >= sprites["ROCK"]["maxFrames"]){rock["frame"] = 0;}
              rock["held"] = sprites["ROCK"]["framesHeld"]
            }
            else (rock["held"] -= 1)

            //Rock_Player Colision
            if (pAlive && col(rock["x"],rock["y"],pX,pY)){
              //print("collide player");
              p_hit()
            }

            //Rock_Rock Colision
            for (i in rocks){
              if (pAlive && i != _rock && col(rock["x"],rock["y"],rocks[i]["x"],rocks[i]["y"])){
                rocks[i]["free"] = true;
                rock["free"] = true;

                createExplosion(rocks[i]["x"],rocks[i]["y"]);
                numRocks-=1;
                createExplosion(rock["x"],rock["y"]);
                numRocks-=1;
                triggerExplosion(numExplos);
              }
            }
            

            if ((rock["y"] - spriteSize) >= gameWinWidth || (rock["y"] + spriteSize) <= 0){
              rock["free"] = true;
              numRocks -= 1;
            }

          }
        }

        //Handle pLaser
        for (_laser in pLaser){
          let laser =  pLaser[_laser]
          if (!laser["free"]){
            move_pLaser(laser);

            if (_DEBUG){draw_hitbox(laser["x"],laser["y"]);}
            draw_sprite(laser["x"], laser["y"], sprites["pLASER"]["img"], laser["flipped"], 0);

            //Laser_Rock Colision
            for (i in rocks){
              if (pAlive && !rocks[i]["free"] && col(laser["x"], laser["y"], rocks[i]["x"],rocks[i]["y"])){
                rocks[i]["free"] = true;
                laser["free"] = true;

                numPLaser -= 1;
                numRocks -= 1;

                createExplosion(rocks[i]["x"],rocks[i]["y"]);
                triggerExplosion(numExplos);

                score += 100;

                if ((floor(score/1000) - diff) > 0) {
                  diff += 1;
                  maxRocks = (maxRocks + 1) % MAXROCKS;
                  spawn_rocks()
                  spawn_rocks()
                  addedTime += 500;
                  if (addedTime >= 1000) {addedTime = 1500;}
                }   
              }
            }

            if ((laser["y"] - spriteSize) >= gameWinWidth || (laser["y"] + spriteSize) <= 0){
              laser["free"] = true;
              numPLaser -= 1;
            }
            
          }
        }


        //Handle Player
        if (pAlive){
          if (_DEBUG){draw_hitbox(pX,pY)}
          draw_sprite(pX, pY, sprites["PLAYER"]["img"], pFlip, pFrame);
          if (pHeld == 0){
            pFrame += 1;
            if (pFrame >= sprites["PLAYER"]["maxFrames"]){pFrame = 0;}
            pHeld = sprites["PLAYER"]["framesHeld"]
          }
          else {pHeld -= 1;}
        }

        //Handle Explosions
        for (_explo in explos){
          let explo = explos[_explo]
          if (!explo["free"]){
            draw_sprite(explo["x"], explo["y"], sprites["EXPLODE"]["img"], false, explo["frame"]);
            if (explo["held"] == 0){
              explo["frame"] += 1;
              if (explo["frame"] >= sprites["EXPLODE"]["maxFrames"]){
                if (explo["isPlayer"]){gameOver = true}
                explo["free"] = true;
                numExplos -= 1
              }
              else {
                explo["held"] = sprites["EXPLODE"]["framesHeld"]
              }
            }
            else {explo["held"] -= 1;}
          }
        }
        
      }
      else { //Handling GameOver
        switchSTate(GameStates.END);
      }

      break;

    case GameStates.END:
      fill("BLACK")
      textAlign(CENTER, CENTER);
      textSize(42);
      textStyle(BOLD);
      text("Game Over!", gameWinX + (gameWinWidth/2), gameWinY + (gameWinHeight/4));
      
      textSize(24);

      text("Final Score: " + score, gameWinX + (gameWinWidth/2), gameWinHeight/2.5)

      if (score >= HighScore){
        HighScore = score;

        for (let i = 0; i < message.length; i++) {
          let x = gameWinX + (gameWinWidth/4) + i * spacing;
          let y = gameWinHeight/1.5;
          let t = i / (message.length - 1);
          let currentColor = lerpColor(startColor, endColor, t);
          
          startColor.v1 += 25;
          endColor.v1 += 25;

          fill(currentColor);
          text(message.charAt(i), x, y);
        }
        
      }

      text("-Press FIRE to Start Again-",gameWinX + (gameWinWidth/2), gameWinHeight/1.2);
      break;
   }

   if (up){
    sendAudMsg("UP");
   }
   if (down){
    sendAudMsg("DOWN");
   }

   btn1Prev = btn1;
   btn2Prev = btn2;
}

/* Draws a sprite at the given Spot

x - x cordinate
y - y cordinate
sprite - what sprite is being used (see variable Sprites)
rot - will the sprite be facing the top or bottom of the screen
frame - current frame in animation
*/
function draw_sprite(x,y,sprite,rot,frame) { 
  let cur_sprite;
  push();

  translate(x + spriteSize/2, y + spriteSize/2);
  if (rot){
    rotate(PI);
  }

  cur_sprite = sprite.get((spriteSize * frame),0,spriteSize,spriteSize);
  image(cur_sprite,0,0);

  pop();
}

function draw_hitbox(x,y){
  fill("RED");
  circle(x+spriteSize/2,y+spriteSize/2,spriteSize/2);
}

/*Checks the collision of two shapes
All hitboxes are circles of the same size for easy calculation
returns true if the two given shapes are overlaping*/
function col(shape1X, shape1Y, shape2X, shape2Y){
  let v1 = createVector(shape1X+spriteSize/2, shape1Y+spriteSize/2);
  let v2 = createVector(shape2X+spriteSize/2, shape2Y+spriteSize/2);
  let dist = v1.dist(v2);
  if (dist >= spriteSize/2) {
    return false;
  }
  return true;
}

/* handles Auduino player input based on current gamestate
Buttons:
Fire - FireButton | Z
Move - anolog Left/Right | button Left/Right | LeftArrow/RightArrow
Flip - FlipButton | X

- START - 
Fire - Switches Gamestate to Play
---------

- PLAY - 
Fire - fires a player laser
Move - Moves player left and right
Flip - flips player's facing direction. fire direction is based on which way the player is flipped
---------

- END - 
Fire - Switches Gamestate to Start
---------
*/
function plr_input() {
  keyHeld();
  switch (gameState){

    case GameStates.START:
      if ( btn1 != btn1Prev && btn1 == 1){switchSTate(GameStates.PLAY);}
      return;

    case GameStates.PLAY:
      if (pAlive){
        if (btn1 != btn1Prev && btn1 == 1){fire();}
        if (btn2 != btn2Prev && btn2 == 1){flip();}
      }
      return;

    case GameStates.END:
      if (btn1 != btn1Prev && btn1 == 1){switchSTate(GameStates.START);}
      return;
   }
}

function keyHeld(){
  let yDir = 0
  if (pAlive && keyIsPressed && key === 'ArrowDown') {
    yDir = 1
  }
  if (pAlive && keyIsPressed && key === 'ArrowUp') {
    yDir = -1
  }
  if (pAlive && keyIsPressed && key === 'ArrowRight') { // Press RightArrow - Move Right
    move(1, yDir);
  }
  else if (pAlive && keyIsPressed && key === 'ArrowLeft') { // Press LeftArrow - Move Left
    move(-1,yDir);
  }
  else if (yDir != 0){move(0,yDir);}
  
  
}

// Also handles player input, used for when no auduino is connected, or the player uses keyboard controls
function keyPressed() {
  switch(gameState) {
    case GameStates.START:
      if (key === 'z') { // Press Z - Fire Button
        switchSTate(GameStates.PLAY);
      }
      break;
    case GameStates.PLAY:
      if (pAlive && key === 'z') { // Press Z - Fire Button
        fire();
      }
      if (pAlive && key === 'x') { // Press x - Flip Button
        flip();
      }
      if (_DEBUG && pAlive && key === '1') { // give 1000 points
        score += 1000;

        if ((floor(score/1000) - diff) > 0) {
          diff += 1;
          maxRocks = (maxRocks + 1) % MAXROCKS;
          spawn_rocks()
          spawn_rocks()
          addedTime += 500;
          if (addedTime >= 1000) {addedTime = 1500;}
        }   
      } 
      break;
    case GameStates.END:
      if (key === 'z') { // Press Z - Fire Button
        switchSTate(GameStates.START);
      }
      break;
  }
}

//Player Fires a laser
function fire(){
 if (numPLaser <= max_pFire){
  numPLaser += 1;
  let dir = -1
  if (pFlip) {dir = 1;}
  for (i in pLaser){
    if (pLaser[i]["free"]){
      pLaser[i] = {
        "free":false,
        "x":pX,
        "y":pY+(10*dir),
        "speed":(diff * 2) + 4,
        "frame":0,
        "flipped":pFlip,
        "dir":dir,
      };
      return;
    }
  }
  pLaser[numPLaser] = {
    "free":false,
    "x":pX,
    "y":pY+(10*dir),
    "speed":(diff * 2) + 4,
    "frame":0,
    "flipped":pFlip,
    "dir":dir,
  };
 }
}

//Moves Player
function move(dir, dir2 = 0){
  pX += dir * pSpeed;
  pX = map(pX, gameWinX, gameWinX + (gameWinWidth - spriteSize),gameWinX, gameWinX + (gameWinWidth - spriteSize),true);
  pY += dir2 * pSpeed;
  pY = map(pY, gameWinY, gameWinY + (gameWinHeight - spriteSize),gameWinY, gameWinY + (gameWinHeight - spriteSize),true);
}

//flips Player
function flip(){
  pFlip = !pFlip;
}

//player is hit
function p_hit(){
  pAlive = false;
  createExplosion(pX,pY,true)
  triggerExplosion(numExplos);
}

/* Used when gamestate switches what changes is based on current gamestate
START -> PLAY -> END -> START -> PLAY -> ect. */
function switchSTate(newState){
  switch (gameState){

    case GameStates.START:
      score = 0;
      time = "";
      minute =0;
      second = 0;
      count = 0;
      pAlive = true;
      gameOver = false;
      pX = gameWinX + (gameWinWidth/2.5)
      pY = gameWinY + (gameWinHeight/2.5)
      pFrame = 0;
      pHeld = 6;
      pFlip = false;
      pFire = false;
      timer = true;
      stopwatch()

      canSpawnWave = true;
      diff = 0;
      maxRocks = 3;
      rockCooldown = false;
      addedTime = 1000;
      timeouts.push(setTimeout(function(){rock_cooldown_end();}, 3000));

      
      playMidiData(song1Data);

      gameState = newState;
      return;

    case GameStates.PLAY:
      Tone.start();
      
      for (var i=0; i<timeouts.length; i++) {
        clearTimeout(timeouts[i]);
      }

      timer = false;
      for (i in explos){
        explos[i]["free"] = true;
      }
      numExplos -= 0;
      for (i in rocks){
        rocks[i]["free"] = true;
      }
      numRocks = 0;
      for (i in pLaser){
        pLaser[i]["free"]=true;
      }
      numPLaser = 0;

      Tone.Transport.cancel();
      Tone.Transport.stop();
      Tone.Transport.loop = false;

      playMidiData(song2Data);
          
      gameState = newState;
      return;

    case GameStates.END:

      Tone.Transport.cancel();
      Tone.Transport.stop();
      Tone.Transport.loop = false;
    
      gameState = newState;
      return;
   }
}

// Spawns a wave of enemies on both sides | each wave happens after the previous one has been destroyed
function spawn_wave() {

}

// spawns rocks | only [maxRocks] can be used 
function spawn_rocks(){
  if (gameState != GameStates.PLAY){return;}
  numRocks += 1
  let randX = round(random(gameWinX ,gameWinX + (gameWinWidth - spriteSize)));
  let randFrame = round(random(0,sprites["ROCK"]["maxFrames"]-1))
  let bottom = round(random(0,1));
  //print(bottom);
  let dir = 1;
  if (bottom == 1){dir = -1};

  for (_rock in rocks){
    if (rocks[_rock]["free"]){
      rocks[_rock] = {
        "free":false,
        "x": randX,
        "y": ((gameWinHeight - spriteSize) * bottom),
        "frame": randFrame,
        "held":0,
        "speed":(diff * 1) + 3,
        "dir":dir
      }
      let newTime = setRockCooldown()
      timeouts.push(setTimeout(function(){rock_cooldown_end();}, newTime));
      return;
    }
  }

  rocks[numRocks] = {
    "free":false,
    "x": randX,
    "y": ((gameWinHeight - spriteSize) * bottom),
    "frame": randFrame,
    "held":0,
    "speed":(diff * 1) + 3,
    "dir":dir
  };
  let newTime = setRockCooldown()
  timeouts.push(setTimeout(function(){rock_cooldown_end();}, newTime));
}

function setRockCooldown(){
  let new_cooldown = MAX_COOLDOWN - round(random(0,addedTime));
  //print(new_cooldown);
  return new_cooldown;
}


function rock_cooldown_end(){
  if (numRocks < maxRocks) {spawn_rocks();}
}

/* enemy behavior. enemies just move left and right and fire 
after a cooldown and when their laser has disapeared */
function move_enemy(enemy){

}

// Rock behavior. rocks just move up or down depending on direction spawned
function move_rock(rock){
  rock["y"] += rock["dir"] * rock["speed"]

}

/* player Laser Behavior, if a laser is on screen, move in given direction (up/down)
if laser hits a rock or enemy, the hit enemy is destroyed along with the laser
the enemy or rock is then replaced with an explosion
if the laser hits a boundary the laser just disapears*/
function move_pLaser(laser){
  laser["y"] += laser["dir"] * laser["speed"]
}

/* player Laser Behavior, if a laser is on screen, move in given direction (up/down)
if laser hits a rock or the player, the hit enemy is destroyed along with the laser
the enemy or rock is then replaced with an explosion
if the player is destroyed wait for the explosion to end then change state to END.
if the laser hits a boundary the laser just disapears*/
function move_eLaser(laser){

}

function triggerExplosion(delay = 0) {
  const now = Tone.now();
  noise.triggerAttackRelease("2n", now);
  filter.frequency.setValueAtTime(12000, now);
  filter.frequency.exponentialRampToValueAtTime(300, now + 2);

}


function createExplosion(x,y,isPlayer = false){
  numExplos += 1;
  for (_explo in explos){
    if (explos[_explo]["free"]){
      explos[_explo] = {
        "free":false,
        "x":x,
        "y":y,
        "isPlayer":isPlayer,
        "frame":0,
        "held":sprites["EXPLODE"]["framesHeld"],
      }
      return;
    }
  }
  explos[numExplos] = {
    "free":false,
    "x":x,
    "y":y,
    "isPlayer":isPlayer,
    "frame":0,
    "held":sprites["EXPLODE"]["framesHeld"],
  }
}

function stopwatch(){
  if (timer){
    count++
    if (count == 100) {
      second++;
      count = 0;
    }
  
    if (second == 60) {
        minute++;
        second = 0;
    }
  
    let minString = minute;
    let secString = second;
    let countString = count;
  
    if (minute < 10) {
      minString = "0" + minString;
    }
  
    if (second < 10) {
        secString = "0" + secString;
    }
  
    if (count < 10) {
        countString = "0" + countString;
    }
    time = minString + "." + secString + "." +countString;
    setTimeout(stopwatch, 10);
  }
}

function playMidiData(data) {
  if (!data || !data.tracks) {
    console.error("Invalid data format");
    return;
  }

  const tracksWithNotes = data.tracks
    .map((track, index) => ({ track, index }))
    .filter(obj => obj.track.notes && obj.track.notes.length > 0);

  if (tracksWithNotes.length === 0) {
    console.error("No note data found in any track.");
    return;
  }

  tracksWithNotes.forEach((obj, i) => {
    const track = obj.track;

    const sortedEvents = obj.track.notes
      .map(note => ({
        time: Tone.Time(note.time).toSeconds(),
        note: note.name,
        duration: note.duration,
        velocity: note.velocity || 1
      }))
      .sort((a, b) => a.time - b.time);

    for (let j = 1; j < sortedEvents.length; j++) {
      if (sortedEvents[j].time <= sortedEvents[j - 1].time) {
        sortedEvents[j].time = sortedEvents[j - 1].time + 0.0001;
      }
    }

    const part = new Tone.Part((time, value) => {
      synths[i].triggerAttackRelease(value.note, value.duration, time, value.velocity);
    }, sortedEvents.map(e => ({ time: e.time, ...e })));
    
    part.start(0);
    
    if (obj.track.pitchBends && obj.track.pitchBends.length > 0) {
      obj.track.pitchBends.forEach(bend => {
        const bendTime = Tone.Time(bend.time).toSeconds();
        const detuneValue = bend.value * 200;
        
        Tone.Transport.schedule((time) => {
          synths[i].set({ detune: detuneValue });
        }, bendTime);
      });
    }

    const allNoteEndTimes = tracksWithNotes.flatMap(obj =>
      obj.track.notes.map(note => Tone.Time(note.time).toSeconds() + Tone.Time(note.duration).toSeconds())
    );
    const loopEnd = Math.max(...allNoteEndTimes);
    
    part.loop = true;
    part.loopStart = 0;
    part.loopEnd = loopEnd;
    
  });

  synths.forEach(synth => {
    synth.set({ volume: -10 });
    if (synth == noise){synth.triggerRelease()}
    else {synth.releaseAll();}
  });

  Tone.Transport.start();
}

/* Given the Aud Input, it takes its string and decodes it

third number - flag for if the fire button is being pressed
fourth number - flag for if the flip button is being pressed
*/
function decodeAudInput(){

  let str = port.readUntil('\n');
  //print("\n" + str)
  if (str !== "") {
    if (str.includes("FIRE")){btn1 = 1;}
    else {btn1 = 0;}
    if (str.includes("FLIP")){btn2 = 1;}
    else {btn2 = 0;}

    //print(ctrlX + "," + ctrlY + "," + sw + "," + btn1 + "," + btn2);
  }
}

/*Sends message to aud serial
*/
function sendAudMsg(msg){
  if (port.opened()) {
    port.write(msg + '\n');
  }
}

function lerp(start, end, amount) {
  return start + (end - start) * amount;
}

function clamp(num, min, max) {
  return Math.min(Math.max(num, min), max);
}



function connectToSerial() {
  port.open('Arduino', 9600);
}

function zero() {
  if (port.opened()) {
    port.write('zero\n');
  }
}

function toDoc(){
  window.location.href = documentation;
}

