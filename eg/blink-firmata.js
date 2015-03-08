var Firmata = require("firmata").Board;
var EtherPort = require("../");
var board = new Firmata(new EtherPort(3030));

board.on("ready", function() {
  console.log("READY!");
  console.log(
    board.firmware.name + "-" +
    board.firmware.version.major + "." +
    board.firmware.version.minor
  );

  var state = 1;

  this.pinMode(8, this.MODES.OUTPUT);

  setInterval(function() {
    this.digitalWrite(8, (state ^= 1));
  }.bind(this), 500);
});
