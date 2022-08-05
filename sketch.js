// Cria interfaces
let power = new Nexus.Toggle("#power");
let gain = new Nexus.Slider("#gain");
let select = new Nexus.Select("#select", {
  size: [100, 30],
  options: ["default", "options"]
});
let sequencer = new Nexus.Sequencer("#sequencer", {
  size: [400, 100],
  mode: "toggle",
  rows: 4,
  columns: 8,
  paddingRow: 5,
  paddingColumn: 5
});
//primeiro abrir "websocket-server-help.pd alterado com [noteout]"
//var ws = new WebSocket("ws://localhost:9001/");

//inicializa matrix
sequencer.matrix.set.row(0, [0, 1, 0, 1, 0, 1, 0, 1]);
sequencer.matrix.set.row(1, [1, 0, 0, 0, 1, 0, 0, 0]);

let notas = [67, 64, 62, 60];
let nota = notas[0];
let beat = 0;
let clock_global = 0;

// Cria instrumento e controle volume
let volume = new Tone.Volume(-Infinity).toDestination();
let synth = new Tone.FMSynth(Tone.Midi(nota)).connect(volume);

// Funções dos eventos dos botões (on/off e volume)
power.on("change", function (v) {
  v
    ? Tone.Transport.start() && loop.start()
    : Tone.Transport.stop() && loop.stop();
});

gain.on("change", function (v) {
  volume.volume.rampTo(v, 0.1);
});
gain.min = -100;
gain.max = 0;
gain.value = 0; //valor de inicialização

select.on("change", function (v) {
  console.log(v);
  if (select.value == "default") {
    sequencer.matrix.set.row(0, [0, 1, 0, 1, 0, 1, 0, 1]);
    sequencer.matrix.set.row(1, [1, 0, 0, 0, 1, 0, 0, 0]);
  }
  if (select.value == "options") {
    sequencer.matrix.set.row(1, [0, 1, 0, 1, 0, 1, 0, 1]);
    sequencer.matrix.set.row(0, [1, 0, 0, 0, 1, 0, 0, 0]);
  }
});
//sequencer.matrix.set.all([[0,1,0,1,0,1,0,1], [1,0,1,0,1,0,1,0], [0,1,1,1,0,0,1,0], [0,1,1,0,1,1,0,1]]);

//leitura do sequenciador
const loop = new Tone.Loop((time) => {
  sequencer.next(); //só pra desenhar!!
  //ws.send(1);
  clock_global = Tone.Transport.position;
  // console.log(clock_global);
  for (let i = 0; i < 4; i++) {
    let celula = sequencer.matrix.pattern[i][beat];
    if (celula) {
      synth.triggerAttackRelease(Tone.Midi(notas[i]), "8n");
    }
    //console.log(1);
  }
  beat++;
  beat = beat % sequencer.columns;
}, "4n").start(0);

function setup() {
  canvas = createCanvas(windowWidth, 100);
  canvas.position(0, 130);
  //canvas.position(0, 0);
  canvas.style("zdex", "-1");
  colorMode(HSB, 360);
  textAlign(CENTER);
  background("#F2FCF800");
}

function draw() {
  fill(200, 100, 0, 50);
  let rnd = random(50);
  let w = map(beat, 0, 7, 0, windowWidth);
  ellipse(w, rnd, rnd, rnd);
  background("#EFF5F303");

  ///score timeline
  // console.log(clock_global);
  if (clock_global > "0:0:0" && clock_global < "1:0:0") {
    console.log("compasso 1");
  }
  if (clock_global > "1:0:0" && clock_global < "1:1:0") {
    console.log("compasso 2 tempo 1");
  }
  if (clock_global > "1:1:0" && clock_global < "1:2:0") {
    console.log("compasso 2 tempo 2");
  }
  if (clock_global > "1:2:0" && clock_global < "1:3:0") {
    console.log("compasso 2 tempo 3");
  }
  if (clock_global > "1:3:0" && clock_global < "1:4:0") {
    console.log("compasso 2 tempo 4");
  }
}
