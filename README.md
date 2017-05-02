# EtherPort

[![Build Status](https://travis-ci.org/rwaldron/etherport.svg?branch=master)](https://travis-ci.org/rwaldron/etherport)


EtherPort is a transport layer that works in conjunction with [Firmata.js]() to enable communcation with an Ethernet capable Arduino or similar device. 



## Setup

EtherPort can be used to communicate with an Arduino (or similar) board running either: 

- [StandardFirmataEthernet](https://github.com/firmata/arduino) (preferred)
- [ConfigurableFirmata](https://github.com/firmata/arduino/tree/configurable)



1. Update your Arduino IDE's version of Firmata to the latest release following [these directions](https://github.com/firmata/arduino/blob/master/readme.md#updating-firmata-in-the-arduino-ide). For StandardFirmataEthernet, be sure to download a Firmata release and not a ConfigurableFirmata pre-release.
2. If using an Ethernet shield, plug the shield into the board.
3. Connect the board to the computer via USB (for flashing StandardFirmataEthernet.ino)
4. Connect the board to the computer via Ethernet 
5. Open Arduino IDE, then: File -> Examples -> Ethernet -> DhcpAddressPrinter and then press the upload button.
6. Open the serial terminal and copy the IP address
7. Obtain your ethernet port IP address (many ways to do this)
8. In the Arduino IDE, open File -> Examples -> Firmata -> StandardFirmataEthernet
9. If you are using an Arduino Yun, comment out the SPI.h and Ethernet.h includes and uncomment the Bridge.h and YunClient.h includes [See Options A and B in the Network Configuration notes](https://github.com/firmata/arduino/blob/master/examples/StandardFirmataEthernet/StandardFirmataEthernet.ino#L74-L99).
10. Update these lines with your computer and board IP addresses: 
  - This is the computer's address 
  ```
  #define remote_ip IPAddress(10, 0, 0, 3)
  ```
  - This is the arduino's address

  ```
  #define local_ip IPAddress(10, 0, 0, 15)
  ```

Everything on the board side should be ready now, all you need to do is install the latest Johnny-Five and EtherPort: 

```js
npm install johnny-five etherport
```

To test: 

```js
var five = require("johnny-five");
var EtherPort = require("etherport");
var board = new five.Board({ 
  port: new EtherPort(3030) 
});

board.on("ready", function() {
  var led = new five.Led(8);
  led.blink(500);
});
```



## License
See LICENSE-MIT file.
