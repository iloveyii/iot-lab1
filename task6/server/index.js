// Import required packages
const path = require('path');
const MyThingy = require('./src/iot');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');

const mongoDb = require('./src/services/mongo');
const camera = require('./src/services/camera');
const CAMERA_ENABLED = 1;

app.use(
    express.static(__dirname + '/public'),
    bodyParser.urlencoded({extended: true}),
    bodyParser.json(),
    cors()
);
const http = require('http').Server(app);
let mt;

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
    res.sendFile(path.join(__dirname, 'public/index.html'));
});



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

camera.start(http);

http.listen(5555, () => console.log('Server started on port ' + 5555));




