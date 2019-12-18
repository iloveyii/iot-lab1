"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var admin = require("firebase-admin");

var serviceAccount = require("./iot-sensors-data-firebase-adminsdk-cd18k-1647ee11b2");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://iot-sensors-data.firebaseio.com"
});
var db = admin.database();
var ref = db.ref("mydb");

var insertIntoFirebase = function insertIntoFirebase(data) {
  var usersRef = ref.push();
  usersRef.set(data);
};

var _default = insertIntoFirebase;
exports["default"] = _default;
//# sourceMappingURL=firebase.js.map