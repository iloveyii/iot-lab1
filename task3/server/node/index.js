// Import required packages
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
        resolve(state)
    })
}

function switchRadio(state) {
    return new Promise(function (resolve, reject) {
        resolve(state)
    })
}

function switchLight(state) {
    return new Promise(function (resolve, reject) {
        resolve(state)
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
            result = await switchLight(state);
            return res.json({state: result});
            break;

    }
});

app.listen(5555, () => console.log('Server started on port ' + 5555));




