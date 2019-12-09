// Import required packages
var myThingy = require('./iot');
var thingyServices = require('./services');
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
var thingy52;

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

    switch (name) {
        case 'hs100':
            result = await myThingy.switchHs100(state);
            return res.json({state: result});
            break;
        case 'radio':
            result = await myThingy.switchRadio(state);
            return res.json({state: result});
            break;
        case 'light':
            console.log('Inside switch light', state)
            result = await myThingy.switchLight(state);
            return res.json({state: result});
            break;

    }
});


function startServices() {
    return new Promise((resolve, reject) => {
        let counter = 0;
        setInterval(() => {
            console.log('Running service in the background : ' + counter++);
            // thingyServices.start(myThingy.thingy52);
            resolve(true);
        }, 5000);

    })
}

function connectThingy() {
    return new Promise((resolve, reject) => {
        console.log('Connecting to thingy');
        myThingy.discover((thingy) => {
            thingy52 = thingy;
            console.log('Call back thingy set', thingy52);
        });
        setTimeout(function () {
            console.log('mythingy', myThingy.thingy52());
        }, 100);
        resolve(true);
    })
}

function showThingyStatus(status) {
    console.log('ThingyStatus : ' + status)
}

startServices().then(()=>connectThingy().then((status)=>showThingyStatus(status)));

app.listen(5555, () => console.log('Server started on port ' + 5555));




