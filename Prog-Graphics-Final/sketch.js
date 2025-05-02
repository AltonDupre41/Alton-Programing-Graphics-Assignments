/* Sprites used in game and their data
  Sprites are, PLAYER, ENEMY, ROCK, pLASER, eLASER, EXPLODE
  size - size of the sprite
  maxFrames - frames in sprite animation
  framesHeld - how many frames are held for animating
*/
let sprites = {
  PLAYER:{
    size:[32,32],
    maxFrames:4,
    framesHeld:5
  },
  ENEMY:{
    size:[32,32],
    maxFrames:4,
    framesHeld:5
  },
  ROCK:{
    size:[32,32],
    maxFrames:4,
    framesHeld:1
  },
  pLASER:{
    size:[32,32],
    maxFrames:4,
    framesHeld:0
  },
  eLASER:{
    size:[32,32],
    maxFrames:4,
    framesHeld:0
  },
  EXPLODE:{
    size:[32,32],
    maxFrames:7,
    framesHeld:1
  },
};

let GameStates = Object.freeze({ 
  START: "start",
  PLAY: "play",
  END: "end"
});
let gameState = GameStates.START;

let pX = 0; // player X cord
let pY = 0; // player Y cord
let pFrame = 0; // player anim frame

let pSpeed = 10; //player Speed
let pRot = false; //player rotation, determines if the player is facing up or down
let pFire = false; //can the player fire

let time = 0; //how long has the game has gone on | resets when player starts game and ends once game ends
let score = 0; //player score

let canSpawnWave = false; // Spawns a wave of enemies, turns ture when the number of enemies reaches 0
let diff = 0; //Difficulty modifies, increases for each wave of enemies and number of rocks
let MAXROCKS = 12; //TOTAL maximum number of rocks that can be shown in game
let maxRocks = 3; // maximum number of rocks
let MAX_COOLDOWN = 15; //how many frames before the next rock is spawned
let rockCooldown = 0;

let max_pFire = 0;

/* enemy_data | data stored for every enemy spawned
x - x location
y - y location
frame - current sprite frame
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
x - x location
y - y location
frame - current sprite frame
speed - how fast the rocks move | they get faster the longer you survive
dir - is the rock moving up or down
*/
let rocks = {

};
let numRocks = 0;

/* pLaser_data | data stored for every player laser fired
x - x location
y - y location
speed - laser speed
frame - current sprite frame
flipped - determines if facing up or down | also used to determine direction
*/
let pLaser = {

}
let numPLaser = 0;

/* eLaser_data | data stored for every player laser fired
x - x location
y - y location
speed - laser speed
fromEnemy - the enemy that fired the laser
frame - current sprite frame
flipped - determines if facing up or down | also used to determine direction
*/
let eLaser = {

};
let numELaser = 0;


/* explosion_data | data stored for every explosion on screen
x - x location
y - y location
frame - current sprite frame

Explosions will appear when the player/enemy/rock is hit with a laser.
After an explosion finishes its animation it'll remove itself
*/
let explos = {

}

function setup() {
  colorMode(RGB)
  createCanvas(1330, 680);
}

function draw() {
  background(220);
  strokeWeight(0)
  fill("GREY")
  rect(340,0,550,650); // Game Window, sprites should be bound in this box


  switch (gameState){

    case GameStates.START:
    
      break;

    case GameStates.PLAY:
    
      break;

    case GameStates.END:
    
      break;
   }
}

/* Draws a sprite at the given Spot

x - x cordinate
y - y cordinate
sprite - what sprite is being used (see variable Sprites)
rot - will the sprite be facing the top or bottom of the screen
*/
function draw_sprite(x,y,sprite,rot) { 

}

/* handles player input based on current gamestate
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
Fire - Set High Score Name (if given enough time) | Switches Gamestate to Start
Move - Changes High Score Letter (if given enough time)
---------
*/
function plr_input() {
  switch (gameState){

    case GameStates.START:
    
      return;

    case GameStates.PLAY:
    
      return;

    case GameStates.END:
    
      return;
   }
}

/* Used when gamestate switches what changes is based on current gamestate
START -> PLAY -> END -> START -> PLAY -> ect. */
function switchSTate(newState){
  switch (gameState){

    case GameStates.START:

      gameState = newState;
      return;

    case GameStates.PLAY:

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

}

/* enemy behavior. enemies just move left and right and fire 
after a cooldown and when their laser has disapeared */
function move_enemy(enemy){

}

// Rock behavior. rocks just move up or down depending on direction spawned
function move_rock(rock){

}

/* player Laser Behavior, if a laser is on screen, move in given direction (up/down)
if laser hits a rock or enemy, the hit enemy is destroyed along with the laser
the enemy or rock is then replaced with an explosion
if the laser hits a boundary the laser just disapears*/
function move_pLaser(laser){

}

/* player Laser Behavior, if a laser is on screen, move in given direction (up/down)
if laser hits a rock or the player, the hit enemy is destroyed along with the laser
the enemy or rock is then replaced with an explosion
if the player is destroyed wait for the explosion to end then change state to END.
if the laser hits a boundary the laser just disapears*/
function move_eLaser(laser){

}
