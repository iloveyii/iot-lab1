"use strict";

var _mongo = _interopRequireDefault(require("./services/mongo"));

var _firebase = _interopRequireDefault(require("./services/firebase"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Thingy = require('thingy52');

var Hs100Api = require('hs100-api');

var _require = require('./radio'),
    startRadio = _require.startRadio,
    stopRadio = _require.stopRadio;

var HS100_IP = '192.168.230.204';
var INTERVAL = 1500;

var MyThingy =
/*#__PURE__*/
function () {
  function MyThingy() {
    _classCallCheck(this, MyThingy);

    this.onDiscover = this.onDiscover.bind(this);
    this.switchLight = this.switchLight.bind(this);
    this._onTemperatureData = this._onTemperatureData.bind(this);
    this._onPressureData = this._onPressureData.bind(this);
    this._onHumidityData = this._onHumidityData.bind(this);
    this._onHumidityData = this._onHumidityData.bind(this);
    this._onHeadingData = this._onHeadingData.bind(this);
    this._onGasData = this._onGasData.bind(this);
    this._onColorData = this._onColorData.bind(this);
    this._onRotationData = this._onRotationData.bind(this);
    this._enableSensors = this._enableSensors.bind(this);
    this._disableSensors = this._disableSensors.bind(this);
    this._onButtonChange = this._onButtonChange.bind(this);
    this.startCameraService = this.startSensors.bind(this);
    this.thingy = null;
    this.startSensorsStatus = false;
    this.data = {};
  }

  _createClass(MyThingy, [{
    key: "connect",
    value: function connect() {
      var _this = this;

      return new Promise(function (resolve, reject) {
        Thingy.discover(function (thingy) {
          return _this.onDiscover(thingy, resolve);
        });
      });
    }
  }, {
    key: "onDiscover",
    value: function onDiscover(thingy, resolve) {
      console.log('Discovered thingy in the class with  uuid : ', thingy.uuid);
      this.thingy = thingy;
      thingy.connectAndSetUp(function (error) {
        console.log('Connected, and error ' + error);
        resolve(thingy);
      });
    }
  }, {
    key: "isSetThingy",
    value: function isSetThingy() {
      if (this.thingy) return true;
      console.log('Discovering thing, please wait ...');
      Thingy.discover(this.onDiscover);
    }
  }, {
    key: "switchLight",
    value: function switchLight(state) {
      var self;
      return regeneratorRuntime.async(function switchLight$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              self = this;
              return _context.abrupt("return", new Promise(function (resolve, reject) {
                if (!self.isSetThingy()) return resolve(false);
                var led = {
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
              }));

            case 2:
            case "end":
              return _context.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: "switchRadio",
    value: function switchRadio(state) {
      var self;
      return regeneratorRuntime.async(function switchRadio$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              self = this;
              return _context2.abrupt("return", new Promise(function (resolve, reject) {
                if (!self.isSetThingy()) return resolve(false);
                Number(state) === 1 ? startRadio(self.thingy) : stopRadio(self.thingy);
                resolve(state);
              }));

            case 2:
            case "end":
              return _context2.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: "switchHs100",
    value: function switchHs100(state) {
      var self;
      return regeneratorRuntime.async(function switchHs100$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              self = this;
              return _context3.abrupt("return", new Promise(function (resolve, reject) {
                try {
                  var client = new Hs100Api.Client();
                  var lightplug = client.getPlug({
                    host: HS100_IP
                  });
                  lightplug.getInfo().then(console.log);
                  lightplug.setPowerState(Number(state) === 1 ? true : false);
                  resolve(state);
                } catch (e) {
                  console.log('Error in connection');
                  resolve(0);
                }
              }));

            case 2:
            case "end":
              return _context3.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: "startSensors",
    value: function startSensors(cb) {
      var self;
      return regeneratorRuntime.async(function startSensors$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              self = this;
              self.cb = cb;
              return _context4.abrupt("return", new Promise(function (resolve, reject) {
                if (!self.isSetThingy()) return resolve(true);
                self.startSensorsStatus = true;

                self._addEventListeners();

                self._addIntervals();

                self._enableSensors();
              }));

            case 3:
            case "end":
              return _context4.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: "_onButtonChange",
    value: function _onButtonChange(state) {
      if (state === 'Pressed') {
        if (this.startSensorsStatus === true) {
          this.cb(true);
          this.startSensorsStatus = false;

          this._disableSensors();

          this.switchLight(0).then(function () {
            return console.log('Disabled sensors data');
          });
        } else {
          this.startSensorsStatus = true;
          this.cb(false);

          this._enableSensors();

          this.switchLight(1).then(function () {
            return console.log('Enabled sensors data');
          });
        }
      }
    }
  }, {
    key: "_onTemperatureData",
    value: function _onTemperatureData(temperature) {
      this.data.temperature = temperature;
      this.data._id && delete this.data['_id']; // console.log(JSON.stringify(this.data));

      (0, _mongo["default"])(this.data);

      if (this.data.eco2) {
        (0, _firebase["default"])(this.data);
      }
    }
  }, {
    key: "_onPressureData",
    value: function _onPressureData(pressure) {
      this.data.pressure = pressure;
    }
  }, {
    key: "_onHumidityData",
    value: function _onHumidityData(humidity) {
      this.data.humidity = humidity;
    }
  }, {
    key: "_onGasData",
    value: function _onGasData(gas) {
      this.data.eco2 = gas.eco2;
      this.data.tvoc = gas.tvoc;
    }
  }, {
    key: "_onColorData",
    value: function _onColorData(color) {
      this.data.color = color;
    }
  }, {
    key: "_onRotationData",
    value: function _onRotationData(rotation) {
      this.data.rotation = rotation;
    }
  }, {
    key: "_onStepCounterData",
    value: function _onStepCounterData(steps) {
      this.data.steps = steps;
      console.log('Steps');
    }
  }, {
    key: "_onHeadingData",
    value: function _onHeadingData(heading) {
      this.data.heading = heading;
    }
  }, {
    key: "_addEventListeners",
    value: function _addEventListeners() {
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
  }, {
    key: "_addIntervals",
    value: function _addIntervals() {
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
  }, {
    key: "_enableSensors",
    value: function _enableSensors() {
      this.thingy.temperature_enable(function (error) {
        console.log('Temperature sensor started! ' + (error ? error : ''));
      });
      this.thingy.pressure_enable(function (error) {
        console.log('Pressure sensor started! ' + (error ? error : ''));
      });
      this.thingy.humidity_enable(function (error) {
        console.log('Humidity sensor started! ' + (error ? error : ''));
      });
      this.thingy.color_enable(function (error) {
        console.log('Color sensor started! ' + (error ? error : ''));
      });
      this.thingy.gas_enable(function (error) {
        console.log('Gas sensor started! ' + (error ? error : ''));
      });
      this.thingy.button_enable(function (error) {
        console.log('Button started! ' + (error ? error : ''));
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
  }, {
    key: "_disableSensors",
    value: function _disableSensors() {
      this.thingy.temperature_disable(function (error) {
        console.log('Temperature sensor disabled! ' + (error ? error : ''));
      });
      this.thingy.pressure_disable(function (error) {
        console.log('Pressure sensor disabled! ' + (error ? error : ''));
      });
      this.thingy.humidity_disable(function (error) {
        console.log('Humidity sensor disabled! ' + (error ? error : ''));
      });
      this.thingy.color_disable(function (error) {
        console.log('Color sensor disabled! ' + (error ? error : ''));
      });
      this.thingy.gas_disable(function (error) {
        console.log('Gas sensor disabled! ' + (error ? error : ''));
      });
      this.thingy.rotation_disable(function (error) {
        console.log('Rotation sensor disabled ' + error ? error : '');
      });
      this.thingy.heading_disable(function (error) {
        console.log('Heading sensor disabled ' + error ? error : '');
      });
      this.thingy.stepCounter_disable(function (error) {
        console.log('Step counter sensor disabled ' + error ? error : '');
      });
    }
  }, {
    key: "startCameraService",
    value: function startCameraService() {
      var self;
      return regeneratorRuntime.async(function startCameraService$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              self = this;
              return _context5.abrupt("return", new Promise(function (resolve, reject) {}));

            case 2:
            case "end":
              return _context5.stop();
          }
        }
      }, null, this);
    }
  }]);

  return MyThingy;
}();

module.exports = MyThingy;
//# sourceMappingURL=iot.js.map