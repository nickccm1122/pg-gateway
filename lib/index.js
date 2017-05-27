'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _pgGateway = require('./pgGateway.js');

var _pgGateway2 = _interopRequireDefault(_pgGateway);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * pg-gateway singleton
 */
exports.default = new PGgateway();