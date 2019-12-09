// Import required packages
const MyThingy = require('./src/iot');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');

app.use(
    express.static(__dirname + '/public'),
    bodyParser.urlencoded({extended: true}),
    bodyParser.json(),
    cors()
);
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


function f(d) {
    connectMongo()
        .then(() => readData()
            .then((data) => d = {}));
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
    if(mt === null) return res.json({state: 0});

    switch (name) {
        case 'hs100':
            result = await mt.switchHs100(state);
            return res.json({state: result});
            break;
        case 'radio':
            result = await mt.switchRadio(state);
            return res.json({state: result});
            break;
        case 'light':
            console.log('Inside switch light', state)
            result = await mt.switchLight(state);
            return res.json({state: result});
            break;

    }
});


function startServices(thingy) {
    return new Promise((resolve, reject) => {
        let counter = 0;
        mt.startSensors().then(()=>resolve(mt.uuid));
    });
}

function connectThingy() {
    return new Promise((resolve, reject) => {
        console.log('Connecting to thingy');
        mt  = new MyThingy();
        mt.connect().then((thingy)=>resolve(thingy))
    });
}

function showThingyStatus(status) {
    console.log('ThingyStatus : ' + status)
}

connectThingy().then((thingy)=>startServices(thingy).then((t)=>showThingyStatus(t)));
//startServices().then(()=>connectThingy().then((status)=>showThingyStatus(status)));

app.listen(5555, () => console.log('Server started on port ' + 5555));




