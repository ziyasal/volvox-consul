'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _microphoneCore = require('microphone-core');

var _cron = require('cron');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ConsulProvider = function (_ClusterProvider) {
    _inherits(ConsulProvider, _ClusterProvider);

    function ConsulProvider(client, logger) {
        _classCallCheck(this, ConsulProvider);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(ConsulProvider).call(this));

        _this._client = client;
        _this._logger = logger;

        _this._serviceName = "";
        _this._serviceId = "";
        _this._version = "";
        _this._uri = "";
        _this._useEbayFabio = false;
        return _this;
    }

    _createClass(ConsulProvider, [{
        key: 'findServiceInstancesAsync',
        value: function findServiceInstancesAsync(name) {
            return regeneratorRuntime.async(function findServiceInstancesAsync$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            if (!(this._useEbayFabio === true)) {
                                _context.next = 2;
                                break;
                            }

                            return _context.abrupt('return', [new _microphoneCore.ServiceInformation("http://localhost", 9999)]);

                        case 2:
                            return _context.abrupt('return', this._client.findServiceAsync(name));

                        case 3:
                        case 'end':
                            return _context.stop();
                    }
                }
            }, null, this);
        }
    }, {
        key: 'registerServiceAsync',
        value: function registerServiceAsync(serviceName, serviceId, version, uri) {
            return regeneratorRuntime.async(function registerServiceAsync$(_context2) {
                while (1) {
                    switch (_context2.prev = _context2.next) {
                        case 0:
                            this._serviceName = serviceName;
                            this._serviceId = serviceId;
                            this._version = version;
                            this._uri = uri;
                            _context2.next = 6;
                            return regeneratorRuntime.awrap(this._client.registerServiceAsync(serviceName, serviceId, uri));

                        case 6:

                            this.__startReaper();

                        case 7:
                        case 'end':
                            return _context2.stop();
                    }
                }
            }, null, this);
        }
    }, {
        key: 'bootstrapClientAsync',
        value: function bootstrapClientAsync() {
            return regeneratorRuntime.async(function bootstrapClientAsync$(_context3) {
                while (1) {
                    switch (_context3.prev = _context3.next) {
                        case 0:
                            this.__startReaper();

                            //Task.FromResult(0);
                            return _context3.abrupt('return', new Promise(function (resolve, reject) {
                                return resolve({});
                            }));

                        case 2:
                        case 'end':
                            return _context3.stop();
                    }
                }
            }, null, this);
        }
    }, {
        key: '__startReaper',
        value: function __startReaper() {
            function actionCompleteHandler(err, httpResponse, body) {
                //noop
            }

            var lookup = [];

            function onTick() {
                var res, criticalServiceId;
                return regeneratorRuntime.async(function onTick$(_context4) {
                    while (1) {
                        switch (_context4.prev = _context4.next) {
                            case 0:
                                if (this._port > 0) this._client.setPort(this._port);

                                _context4.prev = 1;
                                _context4.next = 4;
                                return regeneratorRuntime.awrap(this._client.getCriticalServicesAsync());

                            case 4:
                                res = _context4.sent;
                                _context4.t0 = regeneratorRuntime.keys(res);

                            case 6:
                                if ((_context4.t1 = _context4.t0()).done) {
                                    _context4.next = 18;
                                    break;
                                }

                                criticalServiceId = _context4.t1.value;

                                if (!(lookup.indexOf(criticalServiceId) !== -1)) {
                                    _context4.next = 14;
                                    break;
                                }

                                _context4.next = 11;
                                return regeneratorRuntime.awrap(c.unRegisterServiceAsync(criticalServiceId));

                            case 11:
                                this._logger.info('Reaper: Removing ' + criticalServiceId);
                                _context4.next = 16;
                                break;

                            case 14:
                                lookup.push(criticalServiceId);
                                this._logger.info('Reaper: Marking ' + criticalServiceId);

                            case 16:
                                _context4.next = 6;
                                break;

                            case 18:

                                //remove entries that are no longer critical
                                lookup.filter(function (serviceId) {
                                    return !(lookup.indexOf(serviceId) !== -1);
                                });

                                _context4.next = 24;
                                break;

                            case 21:
                                _context4.prev = 21;
                                _context4.t2 = _context4['catch'](1);

                                this._logger.error(_context4.t2, "Crashed");

                            case 24:
                            case 'end':
                                return _context4.stop();
                        }
                    }
                }, null, this, [[1, 21]]);
            }

            try {
                var job = new _cron.CronJob({
                    cronTime: "*/5 * * * * *" /*every 5 seconds*/
                    , onTick: onTick.bind(this),
                    start: false
                });

                job.start();
                this._logger.info("Reaper: started..");
            } catch (ex) {
                this._logger.error(ex);
            }
        }
    }]);

    return ConsulProvider;
}(_microphoneCore.ClusterProvider);

exports.default = ConsulProvider;