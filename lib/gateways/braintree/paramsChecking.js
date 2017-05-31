'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validateConfigParams = validateConfigParams;

var _joi = require('joi');

var _joi2 = _interopRequireDefault(_joi);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Validate Braintree Config Params
 * 
 * @export
 * @param {object} params - the input params pass to BraintreeGateway.init()
 * @returns {object}
 */
function validateConfigParams(params) {
  var envVarsSchema = _joi2.default.object().keys({
    isSandbox: _joi2.default.boolean().default(true),
    BRAINTREE_MERCHANT_ID: _joi2.default.string().required(),
    BRAINTREE_PUBLIC_KEY: _joi2.default.string().token().required(),
    BRAINTREE_PRIVATE_KEY: _joi2.default.string().token().required()
  }).unknown();

  return _joi2.default.validate(params, envVarsSchema, { stripUnknown: true });
}