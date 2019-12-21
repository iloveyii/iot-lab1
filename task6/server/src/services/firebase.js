const path = require('path');
require('dotenv').config(
    {path: path.resolve(process.cwd(), './.env')}
);
const admin = require("firebase-admin");

if (process.env.ENABLE_FIREBASE === 1) {
    // const serviceAccount = require("./iot-sensors-data-firebase-adminsdk-cd18k-1647ee11b2"); // ALI
    const serviceAccount = require("./hkr-iot-lab1-firebase-adminsdk-qky64-8835af6442"); // REACT

    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        // databaseURL: "https://iot-sensors-data.firebaseio.com" // ALI
        databaseURL: "https://hkr-iot-lab1.firebaseio.com"
    });

    const db = admin.database();
    var ref = db.ref("mydb");
}

const insertIntoFirebase = (data) => {
    if (process.env.ENABLE_FIREBASE === 1) {
        const usersRef = ref.push();
        usersRef.set(data);
        console.log('FireBase data inserted.');
    } else {
        console.log('FireBase is disabled in .env file.');
    }
};


export default insertIntoFirebase;
