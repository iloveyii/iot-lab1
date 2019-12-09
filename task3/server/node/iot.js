// Import required packages
var Thingy = require('thingy52');
var Hs100Api = require('hs100-api');
var {startRadio, stopRadio} = require('./radio');

var HS100_IP = '192.168.230.204';
var thingyDiscovered = false;
var thingy52;
var enabled;


function isThingyNotConnected() {
    if (thingyDiscovered) {
        return false;
    }
    console.log('Discovering thingy. please wait ...');
    myThingy.discover();
    return true;
}

function switchHs100(state) {
    if (isThingyNotConnected()) return showThingyNotConnected();

    return new Promise(function (resolve, reject) {
        // @TODO hsNotConnected
        if (isThingyNotConnected()) return resolve(false);
        return true;
        const client = new Hs100Api.Client();
        const lightplug = client.getPlug({host: HS100_IP});
        lightplug.getInfo().then(console.log);
        lightplug.setPowerState(status);
    })
}

function switchRadio(state) {
    return new Promise(function (resolve, reject) {
        if (isThingyNotConnected()) return resolve(false);
        state == 'true' ? startRadio(thingy52) : stopRadio(thingy52);
        resolve(state);
    });
}

function switchLight(state) {
    return new Promise(function (resolve, reject) {
        if (isThingyNotConnected()) return resolve(false);
        var led = {
            r: 255,
            g: 10,
            b: 10
        };

        if (state == 'true') {
            led.r = 0;
            led.g = 128;
        } else {
            led.r = 255;
            led.g = 0;
        }

        thingy52.led_set(led, function () {
            console.log(state == 'true' ? 'enabled' : 'disabled');
            resolve(state);
        });

    })
}

function startSensors() {

}

function onDiscover(thingy, cb) {
    console.log('Discovered thingy');
    thingyDiscovered = true;
    thingy.on('disconnect', function () {
        console.log('Disconnected!');
    });
    thingy52 = thingy;
    cb(thingy);

    thingy52.connectAndSetUp(function (error) {
        console.log('Connected! ' + error);
        thingy.button_enable(function (error) {
            // console.log('Button enabled! ' + error);
        });
        enabled = true;
    });
}

const myThingy = {
    discover: function (cb) {
        onDiscover.bind(Thingy)
        Thingy.discover((thingy)=>onDiscover(thingy, cb));
    },
    switchHs100: switchHs100,
    switchRadio: switchRadio,
    switchLight: switchLight,
    thingy52 : function () {
        return thingy52;
    }
};

module.exports = myThingy;
