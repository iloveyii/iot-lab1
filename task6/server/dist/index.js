"use strict";

// Import required packages
var path = require('path');

var MyThingy = require('./iot');

var express = require('express');

var app = express();

var bodyParser = require('body-parser');

var cors = require('cors');

var socket = require('socket.io');

var cv = require('opencv4nodejs');

var CAMERA_ENABLED = 1;
app.use(express["static"](__dirname + '/public'), bodyParser.urlencoded({
  extended: true
}), bodyParser.json(), cors());

var http = require('http').Server(app);

var mt;

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

function readData() {
  return new Promise(function (resolve, reject) {
    db.collection('nt52').find({}).toArray(function (err, data) {
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

app.get('/api/v1/data', function _callee(req, res) {
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(connectMongo().then(function () {
            return readData().then(function (data) {
              return res.json(data);
            });
          }));

        case 2:
        case "end":
          return _context.stop();
      }
    }
  });
});
app.get('/api/v1/service/:name/:state', function _callee2(req, res) {
  var _req$params, name, state, result;

  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _req$params = req.params, name = _req$params.name, state = _req$params.state;
          console.log(req.params, name, state);

          if (!(mt === null)) {
            _context2.next = 4;
            break;
          }

          return _context2.abrupt("return", res.json({
            state: 0
          }));

        case 4:
          _context2.t0 = name;
          _context2.next = _context2.t0 === 'hs100' ? 7 : _context2.t0 === 'radio' ? 11 : _context2.t0 === 'light' ? 15 : 20;
          break;

        case 7:
          _context2.next = 9;
          return regeneratorRuntime.awrap(mt.switchHs100(state));

        case 9:
          result = _context2.sent;
          return _context2.abrupt("return", res.json({
            state: result
          }));

        case 11:
          _context2.next = 13;
          return regeneratorRuntime.awrap(mt.switchRadio(state));

        case 13:
          result = _context2.sent;
          return _context2.abrupt("return", res.json({
            state: result
          }));

        case 15:
          console.log('Inside switch light', state);
          _context2.next = 18;
          return regeneratorRuntime.awrap(mt.switchLight(state));

        case 18:
          result = _context2.sent;
          return _context2.abrupt("return", res.json({
            state: result
          }));

        case 20:
        case "end":
          return _context2.stop();
      }
    }
  });
});
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});
var cameraStatus = 0;
var cameraHandle = 0;
var io,
    wCap,
    myIo = null;
io = socket(http);
wCap = new cv.VideoCapture(0);
wCap.set(cv.CAP_PROP_FRAME_HEIGHT, 100);
wCap.set(cv.CAP_PROP_FRAME_WIDTH, 100);

function startCamera() {
  myIo = io;
}

function stopCamera() {
  myIo = {
    emit: function emit() {
      return null;
    }
  };
}

var FPS = 20;
startCamera();
cameraHandle = setInterval(function () {
  var frame = wCap.read();
  var image = cv.imencode('.jpg', frame).toString('base64');
  myIo.emit('image', image);
}, 1000 / FPS);
console.log('Started camera');

var getDataUpdates = function getDataUpdates(data) {
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
  return new Promise(function (resolve, reject) {
    mt.startSensors(getDataUpdates).then(function () {
      return resolve(mt.uuid);
    });
  });
}

function connectThingy() {
  console.log('Connecting to thingy22');
  return new Promise(function (resolve, reject) {
    mt = new MyThingy();
    mt.connect().then(function (thingy) {
      return resolve(thingy);
    });
  });
} // simulate


setInterval(function () {
  console.log('inside set interval');
  getDataUpdates(!cameraStatus);
}, 4000);
connectThingy().then(function (thingy) {
  return startServices(thingy).then(function (status) {
    return console.log('ThingyStatus : ' + status);
  });
});
http.listen(5555, function () {
  return console.log('Server started on port ' + 5555);
});
//# sourceMappingURL=index.js.map