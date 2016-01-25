'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

var _os = require('os');

var _os2 = _interopRequireDefault(_os);

var _microphoneCore = require('microphone-core');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DEFAULT_PORT = 8500;
var DEFAULT_HOST = 'http://localhost';

var ConsulRestClient = function () {
    function ConsulRestClient(address, port) {
        _classCallCheck(this, ConsulRestClient);

        this._address = address || DEFAULT_HOST;
        this._port = port || DEFAULT_PORT;
    }

    _createClass(ConsulRestClient, [{
        key: 'registerServiceAsync',
        value: function registerServiceAsync(serviceName, serviceId, address) {
            var payload, options;
            return regeneratorRuntime.async(function registerServiceAsync$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            payload = {
                                ID: serviceId,
                                Name: serviceName,
                                Tags: ['urlprefix-/' + serviceName],
                                Address: _os2.default.hostname(),
                                Port: address.Port,
                                Check: {
                                    HTTP: address + 'status',
                                    Interval: "1s"
                                }
                            };
                            options = {
                                uri: this._address + ':' + this._port + '/v1/agent/service/register',
                                type: 'POST',
                                json: payload
                            };
                            _context.next = 4;
                            return regeneratorRuntime.awrap(this.__request(options, "Could not register service"));

                        case 4:
                        case 'end':
                            return _context.stop();
                    }
                }
            }, null, this);
        }
    }, {
        key: 'findServiceAsync',
        value: function findServiceAsync(serviceName) {
            var options, serviceArray;
            return regeneratorRuntime.async(function findServiceAsync$(_context2) {
                while (1) {
                    switch (_context2.prev = _context2.next) {
                        case 0:
                            options = {
                                uri: this._address + ':' + this._port + '/v1/health/service/' + serviceName,
                                type: 'GET'
                            };
                            _context2.t0 = JSON;
                            _context2.next = 4;
                            return regeneratorRuntime.awrap(this.__request(options, "Could not find services"));

                        case 4:
                            _context2.t1 = _context2.sent;
                            serviceArray = _context2.t0.parse.call(_context2.t0, _context2.t1);
                            return _context2.abrupt('return', serviceArray.map(function (svcItem) {
                                return new _microphoneCore.ServiceInformation(svcItem["Service"]["Address"], svcItem["Service"]["Port"]);
                            }));

                        case 7:
                        case 'end':
                            return _context2.stop();
                    }
                }
            }, null, this);
        }
    }, {
        key: 'getCriticalServicesAsync',
        value: function getCriticalServicesAsync() {
            var options, serviceArray;
            return regeneratorRuntime.async(function getCriticalServicesAsync$(_context3) {
                while (1) {
                    switch (_context3.prev = _context3.next) {
                        case 0:
                            options = {
                                uri: this._address + ':' + this._port + '/v1/health/state/critical',
                                type: 'GET'
                            };
                            _context3.t0 = JSON;
                            _context3.next = 4;
                            return regeneratorRuntime.awrap(this.__request(options, "Could not get service health"));

                        case 4:
                            _context3.t1 = _context3.sent;
                            serviceArray = _context3.t0.parse.call(_context3.t0, _context3.t1);
                            return _context3.abrupt('return', serviceArray.map(function (svcItem) {
                                return svcItem["ServiceID"];
                            }));

                        case 7:
                        case 'end':
                            return _context3.stop();
                    }
                }
            }, null, this);
        }
    }, {
        key: 'unRegisterServiceAsync',
        value: function unRegisterServiceAsync(serviceId) {
            var options;
            return regeneratorRuntime.async(function unRegisterServiceAsync$(_context4) {
                while (1) {
                    switch (_context4.prev = _context4.next) {
                        case 0:
                            options = {
                                uri: this._address + ':' + this._port + '/v1/agent/service/deregister/' + serviceId,
                                type: 'GET'
                            };
                            _context4.next = 3;
                            return regeneratorRuntime.awrap(this.__request(options, "Could not de register service"));

                        case 3:
                        case 'end':
                            return _context4.stop();
                    }
                }
            }, null, this);
        }
    }, {
        key: 'setPort',
        value: function setPort(port) {
            this._port = port || DEFAULT_PORT;
        }
    }, {
        key: '__request',
        value: function __request(options, message) {
            return new Promise(function (resolve, reject) {
                (0, _request2.default)(options, function (error, response, body) {
                    if (error) return reject(new Error(message));

                    resolve(body);
                });
            });
        }
    }]);

    return ConsulRestClient;
}();

exports.default = ConsulRestClient;