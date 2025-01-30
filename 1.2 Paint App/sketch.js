// Brush Location and Settings
let x = 0
let y = 0
let b_color = 'black'
let b_size = 1

// Canvas Boundaries
let canvas_x = 75
let canvas_y = 75
let inCanvas = false


// Buttons
let button_size = 50
let buttons = {
  'b_size_S':[10,5], //x,y
  'b_size_M':[70,5],
  'b_size_L':[130,5],

  'black':[10,100],
  'white':[10,160],
  'red':[10,220],
  'green':[10,280],
  'blue':[10,340],
  'orange':[10,400],
  'yellow':[10, 460],
  'violet':[10, 520]
}

let brush_sizes = {
  'S':1,
  'M':5,
  'L':15,
}

function setup() {
  colorMode(RGB);
  createCanvas(1200,960);
  background('white');
  textSize(32);
  
  for (i in buttons){
    stroke('black');
    if (i.includes("b_size")){
      square(buttons[i][0],buttons[i][1],button_size);
      text(i.substr(i.length-1),
      buttons[i][0], buttons[i][1],
      button_size, button_size)
    }
    else{
      fill(i);
      square(buttons[i][0],buttons[i][1],button_size);
      
    }
  }
  strokeWeight(5)
  stroke('black');
  line(canvas_x,canvas_y,1200,canvas_y)
  line(canvas_x,canvas_y,canvas_x,960)
  strokeWeight(2)
  stroke(b_color);
  fill(b_color);
}

function draw() {
  if (inCanvas){
    let pX = ((pmouseX >= canvas_x) ? pmouseX : canvas_x )
    let pY = ((pmouseY >= canvas_y) ? pmouseY : canvas_y )
    line(pX,pY,mouseX,mouseY)
  }
}

function mousePressed(){
  if (mouseX >= canvas_x && mouseX <= 1200
    && mouseY >= canvas_y && mouseY <= 960){
      inCanvas = true
      x = mouseX
      y = mouseY
    }
    else{
      checkButton()
      inCanvas = false
    }
}

function mouseReleased(){
  inCanvas = false
}

function mouseDragged(){
  if (mouseX >= canvas_x && mouseX <= 1200
    && mouseY >= canvas_y && mouseY <= 960){
      inCanvas = true
    }
  else{inCanvas = false}
  if (inCanvas){
    x = mouseX;
    y = mouseY;
  }
  
}

function checkButton(){
  for (i in buttons){
    if (mouseX >= buttons[i][0] &&
       mouseX <= buttons[i][0] + button_size
      && mouseY >= buttons[i][1] &&
       mouseY <= buttons[i][1] + button_size){

        if (i.includes("b_size"))
          {
            b_size = brush_sizes[i.substr(i.length-1)]
            strokeWeight(b_size)
          }
        else{
          fill(i)
          stroke(i)
        }
       }
  }
}