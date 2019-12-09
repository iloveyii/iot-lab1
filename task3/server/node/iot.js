// Import required packages
const Thingy = require('thingy52');
const Hs100Api = require('hs100-api');
const {startRadio, stopRadio} = require('./radio');

const HS100_IP = '192.168.230.204';


class MyThingy {
    constructor() {
        this.onDiscover = this.onDiscover.bind(this);
        this.switchLight = this.switchLight.bind(this);
        Thingy.discover(this.onDiscover);
        this.thingy = null;
    }
    onDiscover (thingy) {
        console.log('Discovered thingy in the class');
        this.thingy = thingy;
        thingy.connectAndSetUp(function (error) {
            console.log('Connected! ' + error);
            thingy.button_enable(function (error) {
                console.log('Button enabled! ' + error);
            });
            thingy.on('buttonNotif', () => console.log('btn'))
        });
    }

    isSetThingy() {
        if(this.thingy) return true;
        console.log('Discovering thing, please wait ...');
        Thingy.discover(this.onDiscover);
    }

    async switchLight(state) {
        const self = this;
        return new Promise(function (resolve, reject) {
            if(! self.isSetThingy()) return resolve(false);
            const led = {
                r: 255,
                g: 10,
                b: 10
            };

            if (Number(state) == 1) {
                led.r = 0;
                led.g = 128;
            } else {
                led.r = 255;
                led.g = 0;
            }

            self.thingy.led_set(led, function () {
                console.log(Number(state) === 1 ? 'Lights On' : 'Lights Off');
                resolve(state);
            });
        })
    }

    async switchRadio(state) {
        const self = this;
        return new Promise(function (resolve, reject) {
            if(! self.isSetThingy()) return resolve(false);
            Number(state) === 1 ? startRadio(self.thingy) : stopRadio(self.thingy);
            resolve(state);
        });
    }

    async switchHs100(state) {
        const self = this;
        return new Promise(function (resolve, reject) {
            // @TODO hsNotConnected
            console.log('HS100 ', state);
            if(! self.isSetThingy()) return resolve(state);
            return resolve(state);

            const client = new Hs100Api.Client();
            const lightplug = client.getPlug({host: HS100_IP});
            lightplug.getInfo().then(console.log);
            lightplug.setPowerState(status);
            resolve(true);
        })
    }


}

module.exports = MyThingy;
