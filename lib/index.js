'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RestPaypalGateway = exports.BraintreeGateway = undefined;

var _braintree = require('./gateways/braintree');

Object.defineProperty(exports, 'BraintreeGateway', {
  enumerable: true,
  get: function get() {
    return _braintree.BraintreeGateway;
  }
});

var _restPaypal = require('./gateways/restPaypal');

Object.defineProperty(exports, 'RestPaypalGateway', {
  enumerable: true,
  get: function get() {
    return _restPaypal.RestPaypalGateway;
  }
});

var _pgGateway = require('./pgGateway.js');

var _pgGateway2 = _interopRequireDefault(_pgGateway);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * pg-gateway singleton
 */
exports.default = new _pgGateway2.default();

/**
 * Supported gateways
 */