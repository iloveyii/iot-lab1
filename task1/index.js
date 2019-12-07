var Thingy = require('thingy52');
var Hs100Api = require('hs100-api');

var enabled;
var HS100_IP = '192.168.230.204';

console.log('TASK 01 - started');

function switchOnOfHs100(status) {
    return true;
    const client = new Hs100Api.Client();
    const lightplug = client.getPlug({host: HS100_IP});
    lightplug.getInfo().then(console.log);
    lightplug.setPowerState(status);
}

function onButtonChange(state) {
    if (state == 'Pressed') {
        if (enabled) {
            switchOnOfHs100(enabled);
            enabled = false;
        } else {
            switchOnOfHs100(enabled);
            enabled = true;
        }

        var led = {
            r : 255,
            g : 10,
            b : 10
        };

        if(enabled) {
            led.r = 0;
            led.g = 255;
        } else {
            led.r = 255;
            led.g = 0;
        }

        this.led_set(led, function() {
            console.log( enabled ? 'enabled' : 'disabled');
        });
    }
}

function onDiscover(thingy) {
    console.log('Discovered thingy');
    thingy.on('disconnect', function () {
        console.log('Disconnected!');
    });

    thingy.connectAndSetUp(function (error) {
        console.log('Connected! ' + error);
        thingy.on('buttonNotif', onButtonChange);
        thingy.button_enable(function(error) {
            // console.log('Button enabled! ' + error);
        });
        enabled = true;
    });
}


Thingy.discover(onDiscover);


