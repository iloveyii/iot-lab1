// init project
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const app = express();

app.use(bodyParser.json());

// The test/setup endpoint
app.get("/api/v1/netio/:status", (req, res) => {
	console.log('Received IFTT request');
    res.status(200).send({
        status: req.params.status,
        message: 'Plug switched ' + (req.params.status == 1 ? 'ON' : 'OFF')
    });
});

const listener = app.listen(80, function() {
    console.log("Your app is listening on port " + listener.address().port);
});
