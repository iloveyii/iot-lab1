// Import required packages
var Thingy = require('thingy52');
var Hs100Api = require('hs100-api');

var HS100_IP = '192.168.230.204';
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
var enabled;
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

function switchHs100(state) {
    return new Promise(function (resolve, reject) {
        resolve(state);
        return true;
        const client = new Hs100Api.Client();
        const lightplug = client.getPlug({host: HS100_IP});
        lightplug.getInfo().then(console.log);
        lightplug.setPowerState(status);
    })
}

function switchRadio(state) {
    return new Promise(function (resolve, reject) {
        resolve(state)
    })
}

function switchLight(state) {
    return new Promise(function (resolve, reject) {
        var led = {
            r : 255,
            g : 10,
            b : 10
        };

        if(state=='true') {
            led.r = 0;
            led.g = 128;
        } else {
            led.r = 255;
            led.g = 0;
        }

        thingy52.led_set(led, function() {
            console.log( state=='true' ? 'enabled' : 'disabled');
            resolve(state);
        });

    })
}

app.get('/api/v1/service/:name/:state', async (req, res) => {
    const {name, state} = req.params;
    console.log(req.params, name, state);
    let result;
    switch (name) {
        case 'hs100':
            result = await switchHs100(state);
            return res.json({state: result});
            break;
        case 'radio':
            result = await switchRadio(state);
            return res.json({state: result});
            break;
        case 'light':
            console.log('Inside switch light', state)
            result = await switchLight(state);
            return res.json({state: result});
            break;

    }
});

function onButtonChange(state) {
    console.log('Button change to ' + state);
}

function onDiscover(thingy) {
    console.log('Discovered thingy');
    thingy.on('disconnect', function () {
        console.log('Disconnected!');
    });
    thingy52 = thingy;

    thingy.connectAndSetUp(function (error) {
        console.log('Connected! ' + error);
        thingy.on('buttonNotif', onButtonChange);
        thingy.button_enable(function(error) {
            // console.log('Button enabled! ' + error);
        });
        enabled = true;
    });
}


Thingy.discover(onDiscover);

app.listen(5555, () => console.log('Server started on port ' + 5555));




