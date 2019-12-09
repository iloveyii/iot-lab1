
var admin = require("firebase-admin");

var serviceAccount = require("./iot-sensors-data-firebase-adminsdk-cd18k-1647ee11b2");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://iot-sensors-data.firebaseio.com"
});

var db = admin.database();
var ref = db.ref("mydb");
/* ref.once("value", function(snapshot) {
    console.log(snapshot.val());
}); */
/*
var usersRef = ref.push();
usersRef.set({
        date_of_birth: "June 23, 1912",
        full_name: "Alan Turing"
});*/

module.exports = ref;
