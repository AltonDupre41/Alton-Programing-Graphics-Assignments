let animations = {
  'idle':0, //frames (maybe add speed later)
  'walk':6,
  'crouch':0,
}

let curAnim = 'idle';
let curFrame = 0;
let spriteFrames = 0;
let facing_left = false

let sprite1;
let sprite2;
let spriteX = 80;
let spriteY = 80;

let isMoving = false;

let sprites = {
  0:{
    "img":sprite1,
    "x":1,
    "y":200,
    "anim":"idle",
    "frame":0,
    "sprFrames":0,
    "left":false
  },
  1:{
    "img":sprite2,
    "x":100,
    "y":100,
    "anim":"idle",
    "frame":0,
    "sprFrames":0,
    "left":false
  }
}

let frameCount = 0;

function setup() {
  createCanvas(400, 400);
  sprites[0]["img"] = loadImage("spelunky_sprite.png");
  sprites[1]["img"] = loadImage("robot_sprite.png");
  changeAnim(curAnim,0);
  changeAnim(curAnim,1);
}

function draw() {
  background(220);

  if (isMoving){
    switch(key){
      case 'ArrowLeft':
        spriteMove(-5, 0)
        spriteMove(-5, 1)
        break;
      case 'ArrowRight':
        spriteMove(5, 0);
        spriteMove(5, 1);
        break;
    }
  }


  spriteAnim(0);
  spriteAnim(1);
  frameCount++;
}

function keyPressed(){
  switch(key){
    case 'ArrowLeft':
      changeAnim('walk', 0);
      changeAnim('walk', 1);
      sprites[0]["left"] = true;
      sprites[1]["left"] = true;
      isMoving = true;
      break;
    
    case 'ArrowRight':
      changeAnim('walk', 0);
      changeAnim('walk', 1);
      sprites[0]["left"] = false;
      sprites[1]["left"] = false;
      isMoving = true;
      break;
  }
}

function keyReleased(){
  changeAnim('idle',0);
  changeAnim('idle',1);
  isMoving = false;
}

function spriteMove(dir, sprite){
  if (sprites[sprite]["x"] + dir >= 0 && (sprites[sprite]["x"] + dir + spriteX) < 400){
    sprites[sprite]["x"] = sprites[sprite]["x"] + dir;
  }
}

function changeAnim(anim, sprite) {
  sprites[sprite]["anim"] = anim;
  sprites[sprite]["sprFrames"] = animations[anim];
  sprites[sprite]["frame"] = 0;
}

function spriteAnim(sprite) {
let cur_sprite;
let flip = sprites[sprite]["x"];
push();
if (sprites[sprite]["left"] == true){
  scale(-1,1)
  flip = -(flip + spriteX)
}
else{
  scale(1,1)
}
switch(sprites[sprite]["anim"]) {
  case 'idle':
    cur_sprite = sprites[sprite]["img"].get((80 * sprites[sprite]["frame"]),0,spriteX,spriteY);
    image(cur_sprite,flip,sprites[sprite]["y"]);
    break;
  
  case 'walk':
    cur_sprite = sprites[sprite]["img"].get((80 * sprites[sprite]["frame"]),32,spriteX,spriteY);
    image(cur_sprite,flip,sprites[sprite]["y"]);
    break;
}
pop();

if (frameCount % 4 == 0){
  sprites[sprite]["frame"] = (sprites[sprite]["frame"] == sprites[sprite]["sprFrames"] ? 0 : sprites[sprite]["frame"] + 1 );
  }
}