const mongoClient = require('mongodb').MongoClient;

const mongo = {
    dbname: 'sensor_data',
    url: 'mongodb://localhost:27017',
    mongoOptions: {useNewUrlParser: true},
};
let db = null;

function connectMongo() {
    return new Promise(function (resolve, reject) {
        if(db) { return resolve(db);}
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

function insertIntoMongo(d) {
    return new Promise(function (resolve, reject) {
        d._id && delete d['_id'];
        db.collection('nt52').insertOne(d, (err, result) => {
            if (err) {
                reject(err);
                console.log(err);
            } else {
                d = {};
                resolve(d);
            }
        });
    });
}

function insert(d) {
    connectMongo()
        .then(() => insertIntoMongo(d)
            .then(()=> d={}));
}

export default insert;
