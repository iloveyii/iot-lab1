const socket = require('socket.io');
const cv = require('opencv4nodejs');

var cameraStatus = 0;
var cameraHandle = 0;
var io, wCap, myIo = null;

wCap = new cv.VideoCapture(0);
wCap.set(cv.CAP_PROP_FRAME_HEIGHT, 100);
wCap.set(cv.CAP_PROP_FRAME_WIDTH, 100);

function startCamera() {
    myIo = io;
}

function stopCamera() {
    myIo = {emit: () => null};
}

const FPS = 20;

startCamera();
cameraHandle = setInterval(() => {
    const frame = wCap.read();
    const image = cv.imencode('.jpg', frame).toString('base64');
    myIo.emit('image', image);
}, 1000 / FPS);
console.log('Started camera');


const getDataUpdates = (data) => {
    console.log('getDataUpdates');

    if (data && cameraStatus === 0) {
        cameraStatus = 1;
        console.log('Started camera');
        startCamera();

    } else {
        // clearInterval(cameraHandle);
        cameraStatus = 0;
        console.log('Stopped camera');
        stopCamera();
    }
};

function start(http) {
    io = socket(http);
    myIo = io;
    // simulate
    setInterval(() => {
        console.log('inside set interval')
        getDataUpdates(!cameraStatus);
    }, 40000);
}

module.exports = {
    start : start.bind(this)
};
