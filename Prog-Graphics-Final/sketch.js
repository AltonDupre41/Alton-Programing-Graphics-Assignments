//import { Vector } from "../../../../../.vscode/extensions/samplavigne.p5-vscode-1.2.16/p5types/index";

let _DEBUG = true; //enables debug features (like showing hit boxes)

let port;
let connectButton;
let buttonStatus = "";

let documentation = "https://youtu.be/xvFZjo5PgG0"; // Link to PDF documentation that is hosted on the github pages
let docButton;

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
  createCanvas(1330, 680);

  startColor = color(255, 255, 255);
  endColor = color(0, 255, 255);

  port = createSerial();
  connectButton = createButton("Connect to Arduino");
  connectButton.mousePressed(connectToSerial);
  connectButton.position(20,20);

  docButton = createButton("Documentation");
  docButton.mousePressed(() => {toDoc();});
  docButton.position(0,0);

  sprites["PLAYER"]["img"] = loadImage("sprites/Ship.png");
  sprites["ROCK"]["img"] = loadImage("sprites/Rock.png");
  sprites["EXPLODE"]["img"] = loadImage("sprites/explode.png")
  sprites["pLASER"]["img"] = loadImage("sprites/playerLazer.png")
}

function draw() {
  background(220);
  strokeWeight(0)
  fill("GREY")
  rect(gameWinX,gameWinY,gameWinWidth,gameWinHeight); // Game Window, sprites should be bound in this box

  plr_input();

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
              print("collide player");
              p_hit()
            }

            //Rock_Rock Colision
            for (i in rocks){
              if (pAlive && i != _rock && col(rock["x"],rock["y"],rocks[i]["x"],rocks[i]["y"])){
                rocks[i]["free"] = true;
                rock["free"] = true;
                numRocks -= 2;

                createExplosion(rocks[i]["x"],rocks[i]["y"]);
                createExplosion(rock["x"],rock["y"]);
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
  if (!port.opened()){keyHeld();}
  switch (gameState){

    case GameStates.START:
    
      return;

    case GameStates.PLAY:
      if (pAlive){
        
      }
      return;

    case GameStates.END:
    
      return;
   }
}

function keyHeld(){
  if (pAlive && keyIsPressed && key === 'ArrowRight') { // Press RightArrow - Move Right
    move(1);
  }
  if (pAlive && keyIsPressed && key === 'ArrowLeft') { // Press LeftArrow - Move Left
    move(-1);
  }
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
      setTimeout(function(){
        rock_cooldown_end();
      }, 3000);

      gameState = newState;
      return;

    case GameStates.PLAY:
      timer = false;
      for (i in explos){
        explos[i]["free"] = true;
        numExplos -= 1;
      }
      for (i in rocks){
        rocks[i]["free"] = true;
        numRocks -= 1;
      }
      for (i in pLaser){
        pLaser[i]["free"]=true;
        numPLaser -= 1;
      }
      
      gameState = newState;
      return;

    case GameStates.END:
    
      gameState = newState;
      return;
   }
}

// Spawns a wave of enemies on both sides | each wave happens after the previous one has been destroyed
function spawn_wave() {

}

// spawns rocks | only [maxRocks] can be used 
function spawn_rocks(){
  numRocks += 1
  let randX = round(random(gameWinX ,gameWinX + (gameWinWidth - spriteSize)));
  let randFrame = round(random(0,sprites["ROCK"]["maxFrames"]-1))
  let bottom = round(random(0,1));
  print(bottom);
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
      setTimeout(function(){
        rock_cooldown_end();
      }, newTime);
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
  setTimeout(function(){
    rock_cooldown_end();
  }, newTime);
}

function setRockCooldown(){
  let new_cooldown = MAX_COOLDOWN - round(random(0,addedTime));
  print(new_cooldown);
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

function connectToSerial() {
  port.open('Arduino', 9600);
}

function toDoc(){
  window.location.href = documentation;
}