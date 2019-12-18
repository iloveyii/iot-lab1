"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var mongoClient = require('mongodb').MongoClient;

var mongo = {
  dbname: 'sensor_data',
  url: 'mongodb://localhost:27017',
  mongoOptions: {
    useNewUrlParser: true
  }
};
var db = null;

function connectMongo() {
  return new Promise(function (resolve, reject) {
    if (db) {
      return resolve(db);
    }

    console.log(mongo);
    mongoClient.connect(mongo.url, mongo.mongoOptions, function (err, client) {
      if (err) {
        reject(err);
      } else {
        console.log('Mongodb connected to : ' + mongo.dbname);
        db = client.db(mongo.dbname);
        resolve(db);
      }
    });
  });
}

function insertIntoMongo(d) {
  return new Promise(function (resolve, reject) {
    d._id && delete d['_id'];
    db.collection('nt52').insertOne(d, function (err, result) {
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
  connectMongo().then(function () {
    return insertIntoMongo(d).then(function () {
      return d = {};
    });
  });
}

var _default = insert;
exports["default"] = _default;
//# sourceMappingURL=mongo.js.map