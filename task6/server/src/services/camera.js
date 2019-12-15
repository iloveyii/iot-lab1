const socket = require('socket.io');
const cv = require('opencv4nodejs');
var stringSimilarity = require('string-similarity');


var cameraStatus = 0;
var cameraHandle = 0;
var io, wCap, myIo = null;

wCap = new cv.VideoCapture(0);
wCap.set(cv.CAP_PROP_FRAME_HEIGHT, 100);
wCap.set(cv.CAP_PROP_FRAME_WIDTH, 100);
const FPS = 3;
const MOTION_SENSITIVITY = 70;
let motion = false;

function startHardwareOnce(http, cb) {
    myIo = socket(http);
    var previousImage = 'jhkhkhkhkhk';

    setInterval(() => {
        const frame = wCap.read();
        const image = cv.imencode('.jpg', frame).toString('base64');
        if (myIo && myIo.emit) {
            myIo.emit('image', cameraStatus === 1 ? image : 'NA');
        }
        var similarity = stringSimilarity.compareTwoStrings(previousImage, image);
        if ((MOTION_SENSITIVITY - (similarity * 100)) > 10) {
            motion = true;
            if(cb) cb();
        } else {
            motion = false;
        }
        console.log(similarity * 100, motion);
        previousImage = image;
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
