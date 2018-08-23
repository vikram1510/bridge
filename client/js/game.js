
function setup() {
createCanvas(600, 300);
background(200);

console.log("Hello");

var socket = io.connect();

socket.on('signInResponse',function(dataPack) {
  if (dataPack.connected) {
    console.log(dataPack.myCards);
    console.log("waiting for more players");
  } else {
    console.log("Cannot connect")
  }
});

socket.on('readyToPlay', function(data) {
  if (data.ready) {
    console.log('ready to play!')
  }
});

}




function draw() {




}
