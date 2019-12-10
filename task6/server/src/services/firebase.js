const admin = require("firebase-admin");

const serviceAccount = require("./iot-sensors-data-firebase-adminsdk-cd18k-1647ee11b2");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://iot-sensors-data.firebaseio.com"
});

const db = admin.database();
var ref = db.ref("mydb");

const insertIntoFirebase = (data) => {
    const usersRef = ref.push();
    usersRef.set(data);
};



export default insertIntoFirebase;
