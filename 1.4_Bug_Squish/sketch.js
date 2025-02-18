let animations = {
  'walk':7,
  'squish':1,
};

let GameStates = Object.freeze({ 
  START: "start",
  PLAY: "play",
  END: "end"
});
let gameState = GameStates.START;
let score = 0;
let highScore = 0;
let time = 30; // 30 Seconds

let newHigh = false;
let textPadding = 15;
let gamefont;

let numBugs = 2;
let bugImg;
let speed = 1; //Speed of bugs, gets faster after each click

let moveSpeed = 60; //amount of frames before each movement tick

let sizeX = 32; //Sprite Size
let sizeY = 32;
let frameCount = 0;

let bugs = {
};

function preload() {
  gameFont = loadFont("media/PressStart2P-Regular.ttf");
}

function setup() {
  //angleMode(DEGREES);
  createCanvas(800, 500);
  bugImg = loadImage("bug.png");
  textFont(gameFont);
  imageMode(CENTER);
}

function draw() {
  background("Green");


  switch (gameState){
    case GameStates.START:
      
      textAlign(CENTER, CENTER);
      textSize(18);
      text("Press ENTER to Start", width/2,height/4);
      
      break;
    
    case GameStates.PLAY:
      textAlign(LEFT, TOP);
      text("Score: " + score, textPadding, textPadding);
      textAlign(RIGHT, TOP);
      text("Time: " + Math.ceil(time), width-textPadding, textPadding);
      for (_bug in bugs){
        let bug = bugs[_bug]
        if (bug['curAnim'] == 'walk'){
          if (frameCount % bug['choiceTime'] == 0){
            bug['prev_Vect'] = [bug['dir'][0],bug['dir'][1]]
            newDir(bug)
            bug['choiceTime'] = 10 * round(random(1,5))
            bug['rot'] = getDir([bug['dir'][0],bug['dir'][1]])
          }
          move(bug);
        }
    
        handleAnim(bug);
        bugs[_bug] = bug
      }
      time -= deltaTime / 1000;
      if (time <= 0) {
        gameState = GameStates.END;
      }
      frameCount++;
      
      break; 
    
    case GameStates.END:
      for (_bug in bugs){
        let bug = bugs[_bug];
        handleAnim(bug);
        bugs[_bug] = bug;
      }
      textAlign(CENTER, CENTER);
      text("Game Over!",width/2,height/2-20);
      text("Score: " + score, width/2, height/2);
      if (score > highScore){
        highScore = score;
        newHigh = true;
      }
      if (newHigh){
        text("WOW! New High score!", width/2, height/2+50);
      }
      text("Press ENTER to try again!", width/2, height/2+70);
      text("High Score: " + highScore, width/2, height/2+20);
      
      break;
    
  }
  
}

function START(){
  clear()
  newHigh = false;
  bugs = {};
  score = 0;
  timer = 0;
  let numBugs = 2;
  speed = 1;
  createBug(0);
  createBug(1);
  createBug(2);
  gameState = GameStates.PLAY;
}

function createBug(num) {
  let randX = round(random(1,399));
  let randY = round(random(1,399));
  bugs[num] = {
    "curAnim":'walk',
    'x':randX,
    'y':randY,
    'frame':0,
    'sprFrames':6,
    'rot':0,
    'choiceTime':100 * round(random(1,5)),
    'dir':[0,0],
    'prev_Vect':[randX % 2,randY % 2],
  };
}

function newDir(bug){
  bug['dir'][0] = round(random(-1,1))
  bug['dir'][1] = round(random(-1,1))
}

function move(bug){
  let dirX = bug['dir'][0] * speed;
  let dirY = bug['dir'][1] * speed;
  if (bug["x"] + dirX >= 0 && (bug["x"] + dirX) < 800 - sizeX){
    bug["x"] = bug["x"] + dirX;
  }
  else if ((bug["x"] + dirX) < 0) {bug['x'] = 1;}
  else {bug['x'] = 799 - sizeX;}

  if (bug["y"] + dirY >= 0 && (bug["y"] + dirY) < 500 - sizeY){
    bug["y"] = bug["y"] + dirY;
  }
  else if ((bug["y"] + dirY) < 0) {bug['y'] = 1;}
  else {bug['y'] = 499 - sizeY;}
}

function handleAnim(bug){
  let cur_sprite;
  push();
  
  translate(bug["x"] + sizeX/2,bug["y"] + sizeY/2);
  rotate(bug['rot']);

  switch (bug['curAnim']){

    case 'walk':
      cur_sprite = bugImg.get((32 * bug["frame"]),0,sizeX,sizeY);
      image(cur_sprite,0,0);
      break;

    case 'squish':
      cur_sprite = bugImg.get((32 * bug["frame"]),32,sizeX,sizeY);
      image(cur_sprite,0,0);
      break;

  }

  pop();

  if (frameCount % 4 == 0){
    bug["frame"] = (bug["frame"] == bug["sprFrames"] ? 0 : bug["frame"] + 1 );
    }
}

function mouseClicked(){
  if (gameState == GameStates.PLAY){
    for (_bug in bugs){
      let bug = bugs[_bug];
      if (bug['curAnim'] == 'walk' 
        && mouseX >= bug['x'] && mouseX <= bug['x'] + sizeX
        && mouseY >= bug['y'] && mouseY <= bug['y'] + sizeY){
          squish(_bug);
        }
    }
  }
}

function keyPressed() {
  switch(gameState) {
    case GameStates.START:
      if (keyCode === ENTER) {
        START()
      }
      break;
    case GameStates.PLAY:
      break;
    case GameStates.END:
      START()
      break;
  }
}

function squish(_bug){
  bugs[_bug]['curAnim'] = 'squish';
  bugs[_bug]['frame'] = 0
  bugs[_bug]['sprFrames'] = 1;
  score++;
  numBugs++
  createBug(numBugs);
  numBugs++
  createBug(numBugs);
  moveSpeed -= 2;
  if (score % 4 == 0){speed++;}
}

function getDir(cur){
  let v1 = createVector(cur[0],cur[1]);
  let dir = v1.heading();
  return dir;
}


