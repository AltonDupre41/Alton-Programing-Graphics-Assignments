let synth1, filt, rev, polySynth, pluckSynth, noise1, noise2, ampEnv1, ampEnv2, filt1;

let button1, button2, slider1, slider2;

let activeKeys = ['dummy'];

let currentSynth = "synth 1";
let synthSelection = ["synth 1","sawtooth poly","pluck synth"]

let keyNotes = {
  'a': 'C3',
  's': 'D3',
  'd': 'E3',
  'f': 'F3',
  'g': 'G3',
  'h': 'A3',
  'j': 'B3',
  'k': 'C4',
  'l': 'D4',
  'w': 'C#3',
  'e': 'D#3',
  't': 'F#3',
  'y': 'G#3',
  'u': 'A#3',
  'o': 'C#4',
}

function setup() {
  createCanvas(1000, 500);
  //filt = new Tone.Filter(1500, "lowpass").toDestination();
  rev = new Tone.Reverb(2).connect(filt);
  synth1 =  new Tone.Synth({
    envelope: {
      attack: 0.1,
      decay: 0.2,
      sustain: 0.9,
      release: 0.3
    }
  }).connect(rev)
  synth1.portamento.value = 0.5;
  polySynth = new Tone.PolySynth(Tone.Synth).connect(rev);
  polySynth.set({
    envelope: {
      attack: 0.1,
      decay: 0.1,
      sustain: 1,
      release: 0.1
    },
    oscillator: {
      type: 'sawtooth'
    }
  })
  polySynth.volume.value = -6;
  ampEnv1 = new Tone.AmplitudeEnvelope({
    attack: 0.1,
    decay: 0.5,
    sustain: 0,
    release: 0.1
  }).toDestination();
  filt1 = new Tone.Filter(1500, "highpass").connect(ampEnv1);
  noise1 = new Tone.Noise('pink').start().connect(filt1);

  pluckSynth = new  Tone.PluckSynth(Tone.Synth).connect(rev);
  // metalsynth.volume.value = -6;
}

function draw() {
  background(220);
  displayKeyboard();
  fill('black')
  text("key q swaps the synth,\n \nkey z is the noise.", 20, 20);
  text("Current Synth:" + currentSynth, 150, 20);
}

function keyPressed() {
  let _synth = getSynth(currentSynth)
  let pitch = keyNotes[key];
  if (pitch && !activeKeys.includes(key)) {
    // synth1.triggerRelease();
    activeKeys.push(key);
    _synth.triggerAttack(pitch);
  } else if (currentSynth !== "synth 1" && pitch) {
    _synth.triggerAttack(pitch);
  } else if (key === "z") {
    ampEnv1.triggerAttackRelease(0.1);
  }
  else if (key === "q"){
    let num = (synthSelection.indexOf(currentSynth) + 1);
    currentSynth = synthSelection[num % synthSelection.length];
  }
}

function keyReleased() {
  let _synth = getSynth(currentSynth)
  let pitch = keyNotes[key];
  if (activeKeys.includes(key)) {
    if (currentSynth !== "synth 1" && pitch) {
      _synth.triggerRelease(pitch);
      activeKeys.splice(activeKeys.includes(key));
      if (activeKeys.length == 1){
        _synth.releaseAll();
      }
    }
    else {
      _synth.triggerRelease();
      activeKeys.splice(activeKeys.includes(key));
    }
    
  }
}

function getSynth(synthInput){
  switch (synthInput){
    case ("synth 1"):
      return synth1;
    case ("sawtooth poly"):
      return polySynth;
    case ("pluck synth"):
      return pluckSynth;
  }
}

function displayKeyboard(){
  let num = 0;
  let yVar = 300;
  let xVar = 50
  for (i in keyNotes){
    fill('white')
    if (keyNotes[i] === "C#3"){
      num = 0;
      yVar = 260;
      xVar = 75
    }
    
    if (keyNotes[i] === "F#3"){
      num = 3;
    }

    if (keyNotes[i] === "C#4"){
      num = 7;
    }

    if (keyNotes[i].includes("#")){
      fill('black');
      if(activeKeys.includes(i)){fill('red');}
    }
    else if(activeKeys.includes(i)){fill('green');}
    square(xVar+(num * 60),yVar,50)

    fill('black');
    if (keyNotes[i].includes("#")){fill('white');}
    text(i,xVar+(50/2)+(num * 60),yVar+(50/2));

    num++
  }
}