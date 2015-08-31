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

## Compatible Shields & Boards

The following shields are those that have been tested and confirmed to work correctly with Etherport + Firmata.js + Johnny-Five.


### Arduino Ethernet Shield 

- [Arduino Ethernet Shield](https://www.arduino.cc/en/Main/ArduinoEthernetShield)
- [Arduino Ethernet Shield R3](http://www.amazon.com/Arduino-Rev3-Ethernet-Shield-R3/dp/B006UT97FE)

![](https://raw.githubusercontent.com/rwaldron/etherport/5521fe4d9f7dd65f552351b5e85276f1d383c824/shields/arduino-ethernet.jpg)

### Generic Arduino Compatible Ethernet Shield

- [Ethernet Shield W5100](http://www.amazon.com/JBtek-Ethernet-Micro-sd-Arduino-Duemilanove/dp/B00RIKTVOG/)

![](https://raw.githubusercontent.com/rwaldron/etherport/5f610ed0e8cd43cd60315e1265c6baece2270d0d/shields/hanrun-ethernet.jpg)


### DFRobot X-Board V2

- [XBoard V2 -A bridge between home and internet (Arduino Compatible)](http://www.dfrobot.com/index.php?route=product/product&product_id=564#.VeSD5tNViko)

![](https://raw.githubusercontent.com/rwaldron/etherport/5f610ed0e8cd43cd60315e1265c6baece2270d0d/shields/dfrobot-arduino-compatible-xboard.jpg)





## License
See LICENSE-MIT file.

