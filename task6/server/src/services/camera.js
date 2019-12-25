const socket = require('socket.io');
const cv = require('opencv4nodejs');
var stringSimilarity = require('string-similarity');


var cameraStatus = 0;
var cameraHandle = 0;
var io, wCap, myIo = null;

try {
wCap = new cv.VideoCapture(0);
wCap.set(cv.CAP_PROP_FRAME_HEIGHT, 100);
wCap.set(cv.CAP_PROP_FRAME_WIDTH, 100);
} catch(e) {
	console.log('Camera ', e);
}
const FPS = 20;
const MOTION_SENSITIVITY = 75;
let motion = false;

function startHardwareOnce(http, cb) {
    myIo = socket(http);
    let previousImage = '00000000000';
    let counter = 0;
    setInterval(() => {
        counter++;
        const frame = wCap.read();
        const image = cv.imencode('.jpg', frame).toString('base64');
        if (myIo && myIo.emit) {
            myIo.emit('image', cameraStatus === 1 ? image : 'NA');
        }
        if(counter > (FPS)) {
            var similarity = stringSimilarity.compareTwoStrings(previousImage, image);

            if ((MOTION_SENSITIVITY - (similarity * 100)) > 10) {
                motion = true;
                if (cb) cb();
            } else {
                motion = false;
            }
            console.log(similarity * 10000, motion);
            previousImage = image;
            counter = 0;
        }
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
