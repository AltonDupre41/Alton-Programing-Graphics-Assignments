let polySynth, noise1, filt, filt1, rev, pitchShift, part1, part2, part3;
let boxgrab, boxplace, spell;
let currentSprite = 0;

let spriteX = 120;
let spriteY = 120;

function setup() {
  createCanvas(400, 400);
  boxgrab = loadImage("assets/guy1.png");
  boxplace = loadImage("assets/guy2.png");
  spell = loadImage("assets/guy3.png");

  filt = new Tone.Filter(1500, "lowpass").toDestination();
  filt1 = new Tone.Filter(1500, "highpass").connect(filt);
  pitchShift = new Tone.PitchShift(0).connect(filt1)

  polySynth = new Tone.PolySynth(Tone.Synth).connect(pitchShift);
  polySynth.volume.value = -6;

  part1 = new Tone.Part(((time, note) => {
    polySynth.set({
      envelope: {
        attack: 0.1,
        decay: 0.1,
        sustain: 1,
        release: 0.1
      },
      oscillator: {
        type: 'square'
      }
    })
    pitchShift.pitch = 0;
    polySynth.triggerAttackRelease(note, "16n", time);
  }), [
    [0, ["D2"]],
    [0.1,["D3"]],
    [0.2,["G3"]],
    [0.25,["C5"]]
  ]);
  Tone.Transport.start();
  part1.loop = false;

  part2 = new Tone.Part(((time, value) => {
    polySynth.set({
      envelope: {
        attack: 0.1,
        decay: 1,
        sustain: 1,
        release: 0.5
      },
      oscillator: {
        type: 'square'
      }
    })
    pitchShift.pitch = 0;
    polySynth.triggerAttackRelease(value.note, value.duration, time);
  }), [
    {time: 0, note: ["G1"], duration: '16n'},
    {time: 0.01, note: ["C0"], duration: '12n'},
  ]);
  part2.loop = false;

  part3 = new Tone.Part(((time, value) => {
    polySynth.set({
      envelope: {
        attack: 0.1,
        decay: 0,
        sustain: 1,
        release: 0.2
      },
      oscillator: {
        type: 'square'
      }
    })
    pitchShift.pitch = value.shift;
    polySynth.triggerAttackRelease(value.note, value.duration, time);
  }), [
    {time: 0, shift: 0, note: ["C4"], duration:["1n"]},
    {time: 0.2, shift:2},
    {time: 0.4, shift:4},
    {time: 0.6, shift:6},
    {time: 0.8, shift:8},
    {time: 0.10, shift:10},
    {time: 0.12, shift:12},
    {time: 0.5, shift:0}
  ]);
  part3.loop = false;

}

function draw() {
  background(220);
  switch(currentSprite){
    case 2:
      image(boxplace,0,100,spriteX,spriteY);
      break;
    case 1:
      image(boxgrab,0,100,spriteX,spriteY);
      break;
    case 0:
      image(spell,0,100,spriteX,spriteY);
      break;
  }
}

function mouseClicked(){
  Tone.start()
  currentSprite = (currentSprite + 1) % 3
  switch (currentSprite){
    case 2:
      part3.stop()
      pitchShift.pitch = 0
      part2.start(Tone.now());
      break;
    case 1:
      part2.stop()
      part1.start(Tone.now());
      break;
    case 0:
      part1.stop()
      part3.start(Tone.now());
      break;
      
  }
}