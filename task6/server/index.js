// Import required packages
const path = require('path');
const MyThingy = require('./src/iot');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const socket = require('socket.io');
const cv = require('opencv4nodejs');
const CAMERA_ENABLED = 1;

app.use(
    express.static(__dirname + '/public'),
    bodyParser.urlencoded({extended: true}),
    bodyParser.json(),
    cors()
);
const http = require('http').Server(app);



let mt;


const mongoClient = require('mongodb').MongoClient;

const mongo = {
    dbname: 'sensor_data',
    url: 'mongodb://localhost:27017',
    mongoOptions: {useNewUrlParser: true},
};
let db = null;

function connectMongo() {
    return new Promise(function (resolve, reject) {
        if (db) {
            return resolve(db);
        }
        console.log(mongo);
        mongoClient.connect(mongo.url, mongo.mongoOptions, (err, client) => {
            if (err) {
                reject(err)
            } else {
                console.log('Mongodb connected to : ' + mongo.dbname);
                db = client.db(mongo.dbname);
                resolve(db);
            }
        });
    })
}

function readData() {
    return new Promise(function (resolve, reject) {
        db.collection('nt52').find({}).toArray((err, data) => {
            if (err) {
                console.log(err);
                reject(err);
            } else {
                console.log('data: ', Array.isArray(data), data.length);
                resolve(data);
            }
        });
    });
}

app.get('/api/v1/data', async (req, res) => {
    await connectMongo()
        .then(() => readData()
            .then((data) => res.json(data)));
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


var cameraStatus = 0;
var cameraHandle = 0;
let io, wCap, myIo = null;

io = socket(http);
wCap = new cv.VideoCapture(0);
wCap.set(cv.CAP_PROP_FRAME_HEIGHT, 100);
wCap.set(cv.CAP_PROP_FRAME_WIDTH, 100);

function startCamera() {
    myIo = io;
}

function stopCamera() {
    myIo = { emit : () => null};
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

// simulate
setInterval(() => {
    console.log('inside set interval')
    getDataUpdates(!cameraStatus);
}, 4000);



connectThingy().then((thingy) => startServices(thingy).then((status) => console.log('ThingyStatus : ' + status)));
http.listen(5555, () => console.log('Server started on port ' + 5555));




