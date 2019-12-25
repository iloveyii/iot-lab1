// Import required packages
const path = require('path');
const MyThingy = require('./services/MyThingy');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');

const mongoDb = require('./services/mongo');
const camera = require('./services/camera');
console.log(__dirname + '/../public');
app.use(
    express.static(__dirname + '/../public'),
    bodyParser.urlencoded({extended: true}),
    bodyParser.json(),
    cors()
);
const http = require('http').Server(app);

let mt;
const TEMPERATURE_THRESHOLD = 38;
const RECORD_TIME = 15000;

app.get('/api/v1/data', async (req, res) => {
    await mongoDb.read().then(data => res.json(data));
});

app.get('/api/v1/service/:name/:state', async (req, res) => {
    const {name, state} = req.params;
    console.log(req.params, name, state);
    let result;
    if (mt === null) return res.json({state: 0});

    switch (name) {
        case 'hs100':
            result = await mt.switchHs100(state);
            return res.json({state: result});
        case 'radio':
            result = await mt.switchRadio(state);
            return res.json({state: result});
        case 'light':
            console.log('Inside switch light', state)
            result = await mt.switchLight(state);
            return res.json({state: result});
    }
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});
let cameraStarted = 0;
camera.startHardwareOnce(http, () => console.log('There was some motion'));

function getDataUpdates(data) {
    // console.log(data.temperature);
    if ((data.temperature < TEMPERATURE_THRESHOLD) && (cameraStarted === 0)) {
        camera.start();
        cameraStarted = 1;
        setTimeout(() => {
            console.log('Stopped camera - bcz of record time out ', RECORD_TIME);
            camera.stop();
            cameraStarted = 0;
        }, RECORD_TIME)
    }
}

function startServices() {
    return new Promise((resolve, reject) => {
        mt.startSensors(getDataUpdates).then(() => resolve(mt.uuid));
    });
}

function connectThingy() {
    console.log('Connecting to thingy22');

    return new Promise((resolve, reject) => {

        mt = new MyThingy();
        mt.connect().then((thingy) => resolve(thingy))
    });
}

connectThingy().then((thingy) => startServices(thingy).then((status) => console.log('ThingyStatus : ' + status)));


http.listen(5555, () => console.log('Server started on port ' + 5555));
