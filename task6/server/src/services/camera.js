const socket = require('socket.io');
const cv = require('opencv4nodejs');

var cameraStatus = 0;
var cameraHandle = 0;
var io, wCap, myIo = null;

wCap = new cv.VideoCapture(0);
wCap.set(cv.CAP_PROP_FRAME_HEIGHT, 100);
wCap.set(cv.CAP_PROP_FRAME_WIDTH, 100);
const FPS = 5;

function startHardwareOnce(http) {
    myIo = socket(http);
    setInterval(() => {
        const frame = wCap.read();
        const image = cv.imencode('.jpg', frame).toString('base64');
        if (myIo && myIo.emit) {
            myIo.emit('image', cameraStatus === 1 ? image : 'NA');
        }
        console.log('Camera interval', cameraStatus);
    }, 1000 / FPS);
    console.log('Started camera - startHardwareOnce');
}

function stop() {
    cameraStatus = 0;
}

function start() {
    cameraStatus = 1;
}

module.exports = {
    start: start.bind(this),
    stop: stop.bind(this),
    startHardwareOnce: startHardwareOnce.bind(this)
};
