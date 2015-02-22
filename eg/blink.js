var firmata = require("firmata");
var EtherPort = require("../");

var Firmata = firmata.Board;

var etherport = new EtherPort({
  port: 3030,
  // host: "192.168.2.1"
});
var board = new Firmata(etherport);

board.on("ready", function() {
  console.log("READY!");
  console.log(
    board.firmware.name + "-" +
    board.firmware.version.major + "." +
    board.firmware.version.minor
  );

  var state = 1;

  this.pinMode(2, this.MODES.OUTPUT);

  setInterval(function() {
    this.digitalWrite(2, (state ^= 1));
  }.bind(this), 500);
});





// var board = new firmata.Board(eport, function(err) {
//   console.log("READY!");

//   var ledPin = 13;


//   if (err) {
//     console.log(err);
//     return;
//   }


//   console.log("Firmware: " + board.firmware.name + "-" + board.firmware.version.major + "." + board.firmware.version.minor);

//   // var ledOn = true;
//   board.pinMode(ledPin, board.MODES.OUTPUT);

//   // setInterval(function() {
//   //   console.log(ledOn);
//   //   if (ledOn) {
//   //     board.digitalWrite(ledPin, board.HIGH);
//   //   } else {
//   //     board.digitalWrite(ledPin, board.LOW);
//   //   }

//   //   ledOn = !ledOn;

//   // }, 500);

// });
