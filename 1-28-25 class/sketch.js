let x = 200;
let y = 200;
let dragging = false;

function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(220);

  if (dragging){fill("violet");}
  else{fill("white");}

  square(x,y,100);
  
}

function mousePressed(){
  if (mouseX >= x && mouseX <= x + 100
    && mouseY >= y && mouseY <= y + 100){
   dragging = true;
 }
}

function mouseDragged(){
  x += mouseX - pmouseX;
  y += mouseY - pmouseY;
}

function mouseReleased(){
  dragging = false;
}