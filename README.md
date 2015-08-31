# EtherPort

EtherPort is a transport layer that works in conjunction with [Firmata.js]() to enable communcation with an Ethernet capable Arduino or similar device. 


## Setup

EtherPort can be used to communicate with an Arduino (or similar) board running either: 

- [StandardFirmataEthernet](https://github.com/firmata/arduino/tree/ethernet)
- [ConfigurableFirmata](https://github.com/firmata/arduino/tree/configurable)



1. Click the "Download ZIP" on this page: https://github.com/firmata/arduino/tree/ethernet
2. Once downloaded, unzip the file and rename the directory "Firmata"
3. To update your Arduino IDE's version of Firmata, follow [these directions](https://github.com/firmata/arduino/tree/ethernet#updating-firmata-in-the-arduino-ide)
4. If using an Ethernet shield, plug the shield into the board.
5. Connect the board to the computer via USB (for flashing StandardFirmataEthernet.ino)
6. Connect the board to the computer via Ethernet 
7. Open Arduino IDE, then: File -> Examples -> Ethernet -> DhcpAddressPrinter and then press the upload button.
8. Open the serial terminal and copy the IP address
9. Obtain your ethernet port IP address (many ways to do this)
10. In the Arduino IDE, open File -> Examples -> Firmata -> StandardFirmataEthernet
11. Update these lines with your computer and board IP addresses: 
  - This is the computer's address 
  ```
  #define remote_ip IPAddress(10, 0, 0, 3)
  ```
  - This is the Arduino's address:

  ```
  #define local_ip IPAddress(10, 0, 0, 3)
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

