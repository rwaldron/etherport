/**
 * Global Environment Dependencies
 */
/* jshint -W079 */
if (!Object.assign || !Map) {
  require("es6-shim");
}

var IS_TEST_ENV = global.IS_TEST_ENV || false;
var net = require("net");
var Emitter = require("events").EventEmitter;
var priv = new Map();

function EtherPort(opts) {
  Emitter.call(this);

  if (typeof opts === "undefined") {
    throw new Error("Expected port number or port object");
  }
  if (typeof opts === "number") {
    opts = {
      port: opts
    };
  }

  // Alias used in state.flushTo
  var etherport = this;

  this.path = "Listening on port: " + opts.port;
  this.name = "EtherPort";

  var state = {
    queue: [],
    socket: null,
    flushTo: function(socket) {
      if (this.socket === null) {
        this.socket = socket;
        etherport.emit("open");
      }
      if (this.queue.length) {
        this.queue.forEach(function(buffer) {
          this.socket.write(buffer);
        }, this);

        this.queue.length = 0;
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

    socket.on("close", function() {
      state.socket = null;
    })
  }.bind(this));

  tcp.listen(opts.port);

  priv.set(this, state);
}

EtherPort.prototype = Object.create(Emitter.prototype, {
  constructor: {
    value: EtherPort
  }
});

EtherPort.prototype.write = function(buffer, callback) {
  var state = priv.get(this);

  if (state.socket === null) {
    state.queue.push(buffer);
  } else {
    state.socket.write(buffer);
  }

  if (typeof callback === "function") {
    process.nextTick(callback);
  }
};


if (IS_TEST_ENV) {
  EtherPort.__mock = function(mockNet) {
    if (!EtherPort.__mock.net) {
      EtherPort.__mock.net = net;
      net = mockNet;
    }
  };

  EtherPort.__leak = function() {
    return priv;
  };

  EtherPort.__reset = function() {
    net = EtherPort.__mock.net;
    EtherPort.__mock.net = null;
  };
}

module.exports = EtherPort;
