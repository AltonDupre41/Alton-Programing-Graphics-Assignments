let port;
let connectButton;
let buttonStatus = "";
let backgroundColor;

let ledON = false;

function setup() {
  createCanvas(400, 400);
  colorMode(HSB);
  
  port = createSerial();
  connectButton = createButton("Connect to Arduino");
  connectButton.mousePressed(connectToSerial);

  backgroundColor = color(220);
}

function draw() {
  background(220);

  background(backgroundColor);
 
   let str = port.readUntil("\n");
   if (str !== "" && str.includes("Serial Input")) {
     buttonStatus = str;
     let val = Number(str.substr(14));
     if (!isNaN(val)) {
       let hue = map(val, 0, 132, 0, 360);
       backgroundColor = color(hue, 255, 255);
     }
   }
   text(buttonStatus, 20, 20);
}

function keyPressed(){
  if (keyCode === 32){
    ledON = !ledON;
    if (ledON){serial_output("255\n");}
    else {serial_output("0\n");}
  }
}

function serial_output(msg){
  if (port.opened()){
    port.write(msg);
  }
}

function connectToSerial() {
  port.open('Arduino', 9600);
}
