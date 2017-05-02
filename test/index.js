global.IS_TEST_ENV = true;

var EtherPort = require("../");
var Emitter = require("events").EventEmitter;
var sinon = require("sinon");

function restore(target) {
  for (var prop in target) {

    if (target[prop] != null && typeof target[prop].restore === "function") {
      target[prop].restore();
    }
    if (typeof target[prop] === "object") {
      restore(target[prop]);
    }
  }
}

var sendSocket = true;
var tcp = new Emitter();
var socket = new Emitter();


tcp.listen = function() {};
sinon.spy(tcp, "listen");
sinon.spy(tcp, "on");

socket.write = function() {};
sinon.spy(socket, "write");
sinon.spy(socket, "on");
sinon.spy(socket, "emit");

var net = {
  createServer: function(callback) {
    tcp.listen.reset();
    tcp.on.reset();
    socket.write.reset();

    tcp.removeAllListeners();
    socket.removeAllListeners();

    setImmediate(function() {
      callback(sendSocket ? socket : null);
    });

    return tcp;
  }
};

exports["Connection"] = {
  setUp: function(done) {
    this.sandbox = sinon.sandbox.create();
    this.createServer = this.sandbox.spy(net, "createServer");
    EtherPort.__mock(net);
    done();
  },

  tearDown: function(done) {
    EtherPort.__reset();
    this.sandbox.restore();
    sendSocket = true;
    done();
  },

  error: function(test) {
    test.expect(1);

    test.throws(function() {
      new EtherPort();
    });

    test.done();
  },

  initialize: function(test) {
    test.expect(2);
    var etherport = new EtherPort(1337);
    test.equal(this.createServer.callCount, 1);
    test.equal(tcp.listen.callCount, 1);
    test.done();
  },

  etherportEmitsSocketOpen: function(test) {
    test.expect(1);

    var etherport = new EtherPort(1337);

    etherport.on("open", function() {
      test.ok(true);
      test.done();
    });

    tcp.emit("connection", socket);
  },

  etherportEmitsSocketData: function(test) {
    test.expect(1);

    var etherport = new EtherPort(1337);

    etherport.on("data", function() {
      test.ok(true);
      test.done();
    });

    tcp.emit("connection", socket);
    socket.emit("data");
  },

  etherportWriteThroughToSocket: function(test) {
    test.expect(5);

    var etherport = new EtherPort(1337);
    var buffer = new Buffer([1, 1, 1, 1]);

    etherport.on("open", function() {
      etherport.write(buffer);

      test.equal(socket.write.callCount, 1);

      var written = socket.write.getCall(0).args[0];


      for (var i = 0; i < buffer.length; i++) {
        test.equal(buffer.readUInt8(i), written.readUInt8(i));
      }

      test.done();
    });
  },

  etherportWriteQueue: function(test) {
    test.expect(8);

    sendSocket = false;

    var etherport = new EtherPort(1337);
    var leakedPriv = EtherPort.__leak();
    var state = leakedPriv.get(etherport);
    var buffer = new Buffer([1, 1, 1, 1]);

    test.equal(state.queue.length, 0);

    etherport.write(buffer);

    test.equal(state.queue.length, 1);
    test.equal(socket.write.callCount, 0);

    for (var i = 0; i < buffer.length; i++) {
      test.equal(buffer.readUInt8(i), state.queue[0].readUInt8(i));
    }

    state.socket = socket;

    etherport.write(buffer);

    test.equal(socket.write.callCount, 1);

    test.done();
  },

  etherportWriteCallback: function(test) {
    test.expect(2);

    sendSocket = false;

    var etherport = new EtherPort(1337);
    var leakedPriv = EtherPort.__leak();
    var state = leakedPriv.get(etherport);
    var buffer = new Buffer([1, 1, 1, 1]);
    var spy = sinon.spy(function() {
      test.equal(spy.called, true);
      test.equal(spy.callCount, 1);
      test.done();
    });

    etherport.write(buffer, spy);
  },

  etherportFlush: function(test) {
    test.expect(4);

    sendSocket = false;

    var etherport = new EtherPort(1337);
    var leakedPriv = EtherPort.__leak();
    var state = leakedPriv.get(etherport);
    var buffer = new Buffer([1, 1, 1, 1]);

    test.equal(state.queue.length, 0);

    etherport.write(buffer);

    test.equal(state.queue.length, 1);

    state.flushTo(socket);

    test.equal(state.queue.length, 0);
    test.equal(socket.write.callCount, 1);

    test.done();
  }
};
