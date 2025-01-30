function setup() {
  createCanvas(400, 400);
  colorMode(RGB);
  background("darkblue");

  stroke('white');
  strokeWeight(5)
  fill("green");
  circle(200,200,200)

  //star
  fill('red');
  beginShape();

  vertex(100,175);
  vertex(175,175);

  vertex(200,100);

  vertex(225,175);
  vertex(300,175);

  vertex(240,225);
  
  vertex(250,295);
  vertex(200,250);
  vertex(150,295);

  vertex(160,225);
  

  endShape(CLOSE);
}

function draw() {
}
