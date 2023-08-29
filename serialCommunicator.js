var SerialPort = require("serialport");

var serialPort = new SerialPort("/dev/ttyACM0", {
  baudRate: 9600
})

function set(argument) {
    if(argument == "ALL") {
        serialPort.write('a')
    }
    if(argument == "UP") {
        serialPort.write('u')
    }
    if(argument == "DOWN") {
        serialPort.write('d')
    }
}

module.exports.set = set