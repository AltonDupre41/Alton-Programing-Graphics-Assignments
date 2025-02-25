let startContext, samples, sampler, buton1, button2;

function preload() {
  // sampler = new Tone.Player("media/cat.mp3").toDestination()
  samples = new Tone.Players({
    cat: "media/cat.mp3",
    seagull: "media/seagulls.mp3"
  }).toDestination()
}

function setup() {
  createCanvas(400, 400);
  startContext = createButton("Start Audio Context");
  startContext.position(0,0);
  startContext.mousePressed(startAudioContext)
  button1 = createButton("Play Cat Sample");
  button1.position(10, 30);
  button2 = createButton("Play Seagull Sample");
  button2.position(200, 30);
  button1.mousePressed(() => {samples.player("cat").start()})
  button2.mousePressed(() => {samples.player("seagull").start()})
  // button1.mousePressed(() => {sampler.start()})
}

function draw() {
  background(220);
}

// function playSample() {
//   sampler.start()
// }

function startAudioContext() {
  if (Tone.context.state != 'running') {
    Tone.start();
    console.log("Audio Context Started")
  } else {
    console.log("Audio Context is already running")
  }
}