'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validateConfigParams = validateConfigParams;

var _joi = require('joi');

var _joi2 = _interopRequireDefault(_joi);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Validate paypal Config Params
 * 
 * @export
 * @param {object} params - the input params pass to PaypalGateway.init()
 * @returns {object}
 */
function validateConfigParams(params) {
  var envVarsSchema = _joi2.default.object().keys({
    isSandbox: _joi2.default.boolean().default(true),
    paypalClientId: _joi2.default.string().required(),
    paypalSecret: _joi2.default.string().required(),
    returnUrl: _joi2.default.string().required(),
    cancelUrl: _joi2.default.string().required(),
    onPaymentCreated: _joi2.default.func().required(),
    onPaymentExecuted: _joi2.default.func().required()
  }).unknown();

  return _joi2.default.validate(params, envVarsSchema, { stripUnknown: true });
}