let basicSynth, synthButton, metalSynth, fmSynth, lowPassFilter;

function setup() {
  createCanvas(400, 400);
  lowPassFilter = new Tone.Filter(800, "lowpass", -96).toDestination()
  basicSynth = new Tone.Synth({
    envelope: {
      attack: 0.9,
      decay: 1,
      sustain: 0.5,
      release: 1
    },
    oscillator: {
      type: 'sawtooth'
    }
  }).toDestination();
  console.log(basicSynth)
  synthButton = createButton("Play Synth");
  synthButton.position(height/6, width/6);
  synthButton.mousePressed(() => {basicSynth.triggerAttackRelease("A#3", 2)});
  metalSynth = new Tone.MetalSynth({
    envelope: {
      attack: 0.5,
      decay: 5,
      sustain: 1,
      release: 3
    }
  }).toDestination();
  fmSynth = new Tone.FMSynth({
    harmonicity: 1.5,
    modulationIndex: 10
  }).connect(lowPassFilter)
}

function draw() {
  background(220);
}

function keyPressed() {
  if (key === "a") {
    basicSynth.triggerAttack("E5");
  } else if (key === "s") {
    metalSynth.triggerAttackRelease("C5", 4)
  } else if (key === "d") {
    fmSynth.triggerAttack("A4");
  }
}

function keyReleased() {
  if (key === "a") {
    basicSynth.triggerRelease();
  } else if (key === "d") {
    fmSynth.triggerRelease();
  }
}