function setup() {
  createCanvas(400, 400);
  colorMode(HSB);
  angleMode(DEGREES);

  background(220);
  
  //Robot Head
  fill('grey');
  square(100,100,100);
  
  //Robot Eyes
  fill('red');
  circle(125,120,32);
  circle(175,120,32);

  //Robot Mouth
  fill('green');
  arc(150,150, 50, 75, 0, 180);

  //Robot Hair
  fill('purple');
  beginShape();
  vertex(100,100);
  vertex(75,50);
  vertex(135,85);
  vertex(145, 65);
  vertex(200,100);

  
  endShape(CLOSE);
}

function draw() {
  

}
