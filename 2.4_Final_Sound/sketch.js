let polySynth, noise, noiseEnv, filt, filt1, rev, song, startSong, endSong; 
let currentTrack, changeState, playendSong;

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


  filt = new Tone.Filter(1500, "lowpass").toDestination();
  rev = new Tone.Reverb(1).connect(filt);

  polySynth = new Tone.PolySynth(Tone.Synth).connect(rev);
  polySynth.volume.value = 0.6;

  filt1 = new Tone.Filter(1500, "highpass").toDestination();

  noise = new Tone.Noise("pink").connect(filt1).start();
  noise.volume.value = -12;
  noise.mute = true;

  song = new Tone.Part(((time, value) => {
    polySynth.set({
      envelope: {
        attack: 0.1,
        decay: 1,
        sustain: 0.8,
        release: 0.1
      },
      oscillator: {
        type: 'square'
      }
    })
    noise.mute = true;
    polySynth.triggerAttackRelease(value.note, value.duration, time);
  }), [
    {time: 0, note: ["C3"], duration: '12n'},
    {time: 0.2, note: ["G3"], duration: '12n'},
    {time: 0.4, note: ["C4"], duration: '12n'},
    {time: 0.6, note: ["A#3"], duration: '8n'},
    {time: 1, note: ["A3"], duration: '8n'},
    {time: 1.4, note: ["G3"], duration: '2n'},

    {time: 2.4, note: ["C3"], duration: '12n'},
    {time: 2.6, note: ["G3"], duration: '12n'},
    {time: 2.8, note: ["C4"], duration: '12n'},
    {time: 3, note: ["A#3"], duration: '8n'},
    {time: 3.4, note: ["A3"], duration: '8n'},
    {time: 3.8, note: ["G3"], duration: '4n'},
    {time: 4.2, note: ["C4"], duration: '12n'},
    {time: 4.4, note: ["G3"], duration: '4n'},

  ]);
  song.loop = true;
  song.loopEnd = "3m";

  startSong = new Tone.Part(((time, value) => {
    polySynth.set({
      envelope: {
        attack: 0.1,
        decay: 1,
        sustain: 0.8,
        release: 0.1
      },
      oscillator: {
        type: 'sawtooth'
      }
    })
    noise.mute = true;
    polySynth.triggerAttackRelease(value.note, value.duration, time);
  }), [
    {time: 0, note: ["C3"], duration: '16n'},
    {time: 0.1, note: ["G3"], duration: '16n'},
    {time: 0.2, note: ["E3"], duration: '16n'},
    {time: 0.3, note: ["B3"], duration: '16n'},
    {time: 0.4, note: ["C4"], duration: '16n'},
  ]);
  startSong.loop=false;

  endSong = new Tone.Part(((time, value) => {
    polySynth.set({
      envelope: {
        attack: 0.1,
        decay: 1,
        sustain: 0.8,
        release: 0.1
      },
      oscillator: {
        type: 'sine'
      }
    })
    noise.mute = true;
    polySynth.triggerAttackRelease(value.note, value.duration, time);
  }), [
    {time: 0, note: ["F3"], duration: '2n'},
    {time: 0.01, note: ["A3"], duration: '2n'},
    {time: 0.02, note: ["C4"], duration: '2n'},
    {time: 1, note: ["B3"], duration: '4n'},
    {time: 1.5, note: ["A3"], duration: '4n'},
    {time: 2, note: ["D3"], duration: '4n'},
  ]);
  endSong.loop = false;
  
  Tone.Transport.start();
  Tone.Transport.bpm.value = 120;
}

function draw() {
  background("Green");
  handleMusic();

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
        song.stop()
        Tone.Transport.bpm.value = 120;
        changeState = true;
      }
      frameCount++;
      
      break; 
    
    case GameStates.END:
      if(playendSong){
        Tone.Transport.start();
        Tone.Transport.bpm.value = 120;
        endSong.start(Tone.now());
        playendSong = false;
      }
      
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
  changeState = true;
  playendSong = false;
  newHigh = false;
  bugs = {};
  score = 0;
  time = 30;
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

function squishSnd(){
  noise.mute = true;
}

function squish(_bug){
  setTimeout(squishSnd, 100);
  noise.mute = false;
  bugs[_bug]['curAnim'] = 'squish';
  bugs[_bug]['frame'] = 0
  bugs[_bug]['sprFrames'] = 1;
  score++;
  numBugs++
  createBug(numBugs);
  numBugs++
  createBug(numBugs);
  moveSpeed -= 2;
  if (score % 4 == 0){
    speed++;
    Tone.Transport.bpm.value = 120 + (5 * speed);
  }
}

function getDir(cur){
  let v1 = createVector(cur[0],cur[1]);
  let dir = v1.heading();
  return dir;
}

function handleMusic(){
  if (Tone.context.state !== 'running') {
    Tone.context.resume();
  }

  if (changeState){ // if true then stop the current track and play a new track
    switch(gameState) {
      case GameStates.START:
        endSong.stop()
        startSong.start(Tone.now());
        break;
      case GameStates.PLAY:
        endSong.stop()
        startSong.stop();
        song.start(Tone.now());
        break;
      case GameStates.END:
        song.stop();
        playendSong = true;
        Tone.Transport.stop();
        break;
    }
    changeState = false;
  }
}

function mousePressed() {
  if (Tone.context.state !== 'running') {
    Tone.context.resume();
  }
  
  Tone.start();
  changeState = true;
 }