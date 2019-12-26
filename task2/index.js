const express = require("express");
const bodyParser = require("body-parser");
const app = express();

app.use(bodyParser.json());

// The endpoint for IFTTT trigger - YOUR_IP/api/v1/netio/1 for ON - YOUR_IP/api/v1/netio/1 for OFF
app.get("/api/v1/netio/:status", (req, res) => {
	console.log('Received IFTTTn request');
    res.status(200).send({
        status: req.params.status,
        message: 'Plug switched ' + (req.params.status == 1 ? 'ON' : 'OFF')
    });
});

const listener = app.listen(8080, function() {
    console.log("Your app is listening on port " + listener.address().port);
});
