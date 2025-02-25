let startContext, samples, sampler;
let button1, button2, button3, button4;
let volumeSlider, revSlider, delSlider, distSlider, pitchSlider;

let rev = new Tone.Reverb(5).toDestination();
let dist = new Tone.Distortion(0).connect(rev);
let del = new Tone.FeedbackDelay(0, 0).connect(dist);
let vol = new Tone.Volume(-12).connect(del);
let ptch = new Tone.PitchShift(0).connect(vol);
del.wet.value = 0.5;

function preload(){
  samples = new Tone.Players({
    b2b:"media/back_2_back.mp3",
    hey:"media/hey.mp3",
    rif1:"media/Riff1.mp3",
    rif2:"media/Riff2.mp3",
  }).connect(ptch)
}

function setup() {
  createCanvas(600, 600);
  startContext = createButton("Start Audio Context");
  startContext.position(0,0);
  startContext.mousePressed(startContext)

  button1 = createButton("Play Hey!");
  button1.position(10,30);
  button1.mousePressed(() => {samples.player("hey").start()});

  button2 =createButton("Play Back 2 Back");
  button2.position(200,30);
  button2.mousePressed(() => {samples.player("b2b").start()});

  button3 =createButton("Play Riff1");
  button3.position(200,90);
  button3.mousePressed(() => {samples.player("rif1").start()});

  button4 =createButton("Play Riff2");
  button4.position(10,90);
  button4.mousePressed(() => {samples.player("rif2").start()});


  delTimeSlider = createSlider(0, 1, 0, 0.01);
  delTimeSlider.position(10, 200);
  delTimeSlider.input(() => {del.delayTime.value = delTimeSlider.value()});

  feedbackSlider = createSlider(0, 0.99, 0, 0.01);
  feedbackSlider.position(200, 200);
  feedbackSlider.input(() => {del.feedback.value = feedbackSlider.value()});

  distSlider = createSlider(0, 10, 0, 0.01);
  distSlider.position(10, 300);
  distSlider.input(() => {dist.distortion = distSlider.value()});

  wetSlider = createSlider(0, 1, 0, 0.01);
  wetSlider.position(200, 300);
  wetSlider.input(() => {rev.wet.value = wetSlider.value()});
  
  volumeSlider = createSlider(-30, 30, 0, 0.01);
  volumeSlider.position(10, 400);
  volumeSlider.input(() => {vol.volume.value = volumeSlider.value()});

  pitchSlider = createSlider(-12, 12, 0, 0.01);
  pitchSlider.position(200, 400);
  pitchSlider.input(() => {ptch.pitch = pitchSlider.value()});
}

function draw() {
  background(220);
  text("Delay Time: " + delTimeSlider.value(), 15, 190);
  text("Feedback Amount: " + feedbackSlider.value(), 205, 190);
  text("Distortion Amount: " + distSlider.value(), 15, 290);
  text("Reverb Wet Amount: " + wetSlider.value(), 205, 290)
  text("Volume Amount: " + volumeSlider.value(), 15, 390)
  text("Pitch Shift: " + pitchSlider.value(), 205, 390)

}
