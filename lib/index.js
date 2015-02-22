require("es6-shim");

var net = require("net");
var Emitter = require("events").EventEmitter;
var priv = new Map();

function EtherPort(opts) {
  Emitter.call(this);

  if (typeof opts === "number") {
    opts = {
      port: opts
    };
  }

  var state = {
    queue: [],
    socket: null,
    flushTo: function(socket) {
      if (this.socket === null) {
        this.socket = socket;
      }
      if (this.queue.length) {
        this.queue.forEach(function(buffer) {
          this.socket.write(buffer);
        }, this);
      }
    }
  };

  var tcp = net.createServer(function(socket) {
    state.flushTo(socket);
  });

  tcp.on("connection", function(socket) {
    state.flushTo(socket);

    socket.on("data", function(data) {
      this.emit("data", data);
    }.bind(this));
  }.bind(this));

  tcp.listen(opts.port);

  priv.set(this, state);
}

EtherPort.prototype = Object.create(Emitter.prototype, {
  constructor: {
    value: EtherPort
  }
});

EtherPort.prototype.write = function(buffer) {
  var state = priv.get(this);

  console.log("WRITE: ", buffer);

  if (state.socket === null) {
    state.queue.push(buffer);
  } else {
    state.socket.write(buffer);
  }
};

module.exports = EtherPort;


