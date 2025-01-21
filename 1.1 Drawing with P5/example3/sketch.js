function setup() {
  createCanvas(400, 200);
  angleMode(DEGREES);
  background('black');

  

  //Pacman
  fill("yellow");
  arc(100,100,150,150,210,150);

  //Ghost (Binky)
  stroke('red')
  fill('red');
  arc(290,100,150,150,180,360);
  rect(215,100,150,75);

  fill('white');
  stroke('white');
  circle(255,80,50);
  circle(325,80,50);

  fill('blue');
  circle(255,80,25)
  circle(325,80,25)

}

function draw() {
}
