// Import required packages
const Thingy = require('thingy52');
const Hs100Api = require('hs100-api');
const {startRadio, stopRadio} = require('./radio');

const HS100_IP = '192.168.230.204';
const INTERVAL = 5000;


class MyThingy {
    constructor() {
        this.onDiscover = this.onDiscover.bind(this);
        this.switchLight = this.switchLight.bind(this);
        this.thingy = null;
        this.startSensorsStatus = false;
        this.data = {};
    }
    connect() {
        return new Promise( (resolve, reject) => {
            Thingy.discover((thingy)=>this.onDiscover(thingy, resolve));
        });
    }
    onDiscover (thingy, resolve) {
        console.log('Discovered thingy in the class', Object.keys(thingy));
        this.thingy = thingy;
        thingy.connectAndSetUp(function (error) {
            console.log('Connected! ' + error);
            resolve(thingy);
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

    async startSensors() {
        const self = this;

        return new Promise( function(resolve, reject) {
            if(! self.isSetThingy()) return resolve(true);

            self._addEventListeners();
            self._addIntervals();
            self._enableSensors();
        });
    }
    _onButtonChange(state) {
        if(state === 'Pressed') {
            if(this.startSensorsStatus === true) {
                this._disableSensors();
                this.startSensorsStatus = false;
            } else {
                this._enableSensors();
                this.startSensorsStatus = true;
            }
        }
    }


    _onTemperatureData(temperature) {
        // console.log('Temperature sensor: ' + temperature);
        this.data.temperature = temperature;
        this.data._id && delete this.data['_id'];
        console.log(JSON.stringify(this.data));
        /*insertIntoMongo(this.data);
        const usersRef = ref.push();
        usersRef.set(this.data);*/
    }

    _onPressureData(pressure) {
        // console.log('Pressure sensor: ' + pressure);
        this.data.pressure = pressure;
    }

    _onHumidityData(humidity) {
        // console.log('Humidity sensor: ' + humidity);
        this.data.humidity = humidity;
    }

    _onGasData(gas) {
        // console.log('Gas sensor: eCO2 ' + gas.eco2 + ' - TVOC ' + gas.tvoc );
        this.data.eco2 = gas.eco2;
        this.data.tvoc = gas.tvoc;
    }

    _onColorData(color) {
        /* console.log('Color sensor: r ' + color.red +
            ' g ' + color.green +
            ' b ' + color.blue +
            ' c ' + color.clear ); */
        this.data.color = color;
    }

    _onRotationData(rotation) {
        this.data.rotation = rotation;
    }

    _onStepCounterData(steps) {
        this.data.steps = steps;
        console.log('Steps')
    }

    _onHeadingData(heading) {
        this.data.heading = heading;
    }

    _addEventListeners() {
        this.thingy.on('temperatureNotif', this._onTemperatureData);
        this.thingy.on('pressureNotif', this._onPressureData);
        this.thingy.on('humidityNotif', this._onHumidityData);
        this.thingy.on('gasNotif', this._onGasData);
        this.thingy.on('colorNotif', this._onColorData);
        this.thingy.on('buttonNotif', this._onButtonChange);
        this.thingy.on('rotationNotif', this._onRotationData);
        this.thingy.on('stepCounterNotif', this._onStepCounterData);
        this.thingy.on('headingNotif', this._onHeadingData);
    }

    _addIntervals() {
        this.thingy.temperature_interval_set(INTERVAL, function (error) {
            if (error) {
                console.log('Temperature sensor configure! ' + error);
            }
        });
        this.thingy.pressure_interval_set(INTERVAL, function (error) {
            if (error) {
                console.log('Pressure sensor configure! ' + error);
            }
        });
        this.thingy.humidity_interval_set(INTERVAL, function (error) {
            if (error) {
                console.log('Humidity sensor configure! ' + error);
            }
        });
        this.thingy.color_interval_set(INTERVAL, function (error) {
            if (error) {
                console.log('Color sensor configure! ' + error);
            }
        });
        this.thingy.gas_mode_set(1, function (error) {
            if (error) {
                console.log('Gas sensor configure! ' + error);
            }
        });
        this.thingy.stepCounter_interval_set(INTERVAL, function (error) {
            if (error) {
                console.log('Step interval sensor configure! ' + error);
            }
        });

        this.thingy.stepCounter_interval_set(INTERVAL, function (error) {
            if (error) {
                console.log('Step interval sensor configure! ' + error);
            }
        });
    }

    _enableSensors() {
        this.thingy.temperature_enable(function (error) {
            console.log('Temperature sensor started! ' + ((error) ? error : ''));
        });
        this.thingy.pressure_enable(function (error) {
            console.log('Pressure sensor started! ' + ((error) ? error : ''));
        });
        this.thingy.humidity_enable(function (error) {
            console.log('Humidity sensor started! ' + ((error) ? error : ''));
        });
        this.thingy.color_enable(function (error) {
            console.log('Color sensor started! ' + ((error) ? error : ''));
        });
        this.thingy.gas_enable(function (error) {
            console.log('Gas sensor started! ' + ((error) ? error : ''));
        });
        this.thingy.button_enable(function (error) {
            console.log('Button started! ' + ((error) ? error : ''));
        });
        this.thingy.rotation_enable(function (error) {
            console.log('Rotation sensor started ' + error ? error : '');
        });
        this.thingy.heading_enable(function (error) {
            console.log('Heading sensor started ' + error ? error : '');
        });

        this.thingy.stepCounter_enable(function (error) {
            console.log('Step counter sensor started ' + error ? error : '');
        });
    }
    _disableSensors() {
        this.thingy.temperature_disable(function (error) {
            console.log('Temperature sensor started! ' + ((error) ? error : ''));
        });
        this.thingy.pressure_disable(function (error) {
            console.log('Pressure sensor started! ' + ((error) ? error : ''));
        });
        this.thingy.humidity_disable(function (error) {
            console.log('Humidity sensor started! ' + ((error) ? error : ''));
        });
        this.thingy.color_disable(function (error) {
            console.log('Color sensor started! ' + ((error) ? error : ''));
        });
        this.thingy.gas_disable(function (error) {
            console.log('Gas sensor started! ' + ((error) ? error : ''));
        });
        this.thingy.button_disable(function (error) {
            console.log('Button started! ' + ((error) ? error : ''));
        });
        this.thingy.rotation_disable(function (error) {
            console.log('Rotation sensor started ' + error ? error : '');
        });
        this.thingy.heading_disable(function (error) {
            console.log('Heading sensor started ' + error ? error : '');
        });

        this.thingy.stepCounter_disable(function (error) {
            console.log('Step counter sensor started ' + error ? error : '');
        });
    }
}

module.exports = MyThingy;