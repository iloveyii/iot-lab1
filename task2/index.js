// key : Your key is: bzwmwbrULE6H0Qrp7v6ddi
// Service key :  L20gzQJPRHQaEiBwMvl3M2FCQc3S_5uSUUnK2fNulgBSNQt0OgObiivQzHxo1r7-
//                4_72Dm92ZCrLF7F4Ltf5Y_pqGGqmgNF_471cenYlY7gbYPsGJjLYAt5Y-HCu_VJH
//                4_72Dm92ZCrLF7F4Ltf5Y_pqGGqmgNF_471cenYlY7gbYPsGJjLYAt5Y-HCu_VJH
// web hook service id nettio - CONNECTION ID 107754643 -  appletID: dPiYf2y9
const eventUrl = 'https://maker.ifttt.com/trigger/netio4/with/key/bzwmwbrULE6H0Qrp7v6ddi';

// server.js

// init project
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const app = express();

const IFTTT_KEY = process.env.IFTTT_KEY;

app.use(bodyParser.json());

// The status
app.get("/ifttt/v1/status", (req, res) => {
    console.log('Status')
    res.status(200).send({status: 'ok'});
});

// The test/setup endpoint
app.post("/ifttt/v1/test/setup", (req, res) => {
    res.status(200).send({
        data: {
            samples: {
                actionRecordSkipping: {
                    create_new_thing: { invalid: "true" }
                }
            }
        }
    });
});

// Trigger endpoints
app.post("/ifttt/v1/triggers/nettio", (req, res) => {
    console.log('nettion trigger')
    res.status(200).send({
        data: {hi : 1}
    });
});

// Action endpoints
app.post("/ifttt/v1/actions/create_new_thing", (req, res) => {


    res.status(200).send({
        data: [
            {
                id: 'id'
            }
        ]
    });
});

// listen for requests :)

app.get("/", (req, res) => {
    res.render("index.ejs");
});

const listener = app.listen(5555, function() {
    console.log("Your app is listening on port " + listener.address().port);
});
