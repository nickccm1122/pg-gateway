'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _constants = require('./constants');

Object.keys(_constants).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _constants[key];
    }
  });
});
exports.classifyPayment = classifyPayment;
exports.validateInput = validateInput;


/** @module lib/PaymentGatewayClassifier */
/**
 * classifyPayment's input argument
 * @typedef {Object} ClassifyPaymentInput
 * @property {string} currency 
 * @property {string}  cardType 
 */
/**
 * classifyPayment's return object
 * @typedef {Object} ClassifiedPayment
 * @property {null|string} selectedPayment null or [PAYPAL|BRAINTREE]
 * @property {boolean} isValid A flag to indicate the payment should be processed.
 * @property {null|string} reason null or [AMEX_IS_ONLY_FOR_USD]
 * 
 */
/**
 * Check user payment request and return validation object
 * 
 * @export
 * @param {ClassifyPaymentInput} request An Object includes key-values of currency and cardType
 * @returns {ClassifiedPayment}
 * 
 */
function classifyPayment(request) {

  var isRequestValid = validateInput(request);
  if (!isRequestValid) throw new Error('INVALID_REQUEST_PAYLOAD');

  var currency = request.currency,
      cardType = request.cardType;

  var result = {
    selectedPayment: null,
    isValid: false,
    reason: null
  };

  /**
   * If currency is not USD and the credit card is AMEX, return error message 
   */
  if (currency !== 'USD' && cardType === 'AMERICAN_EXPRESS') {
    return _extends({}, result, {
      isValid: false,
      reason: 'AMEX_IS_ONLY_FOR_USD'
    });
  }

  /**
   * If credit card is AMEX, then use PayPal;
   */
  if (cardType === 'AMEX') {
    return _extends({}, result, {
      isValid: true,
      selectedPayment: 'PAYPAL'
    });
  }

  /**
   * If currency is USD, EUR, or AUD, then use PayPal
   */
  if (['USD', 'EUR', 'AUD'].indexOf(currency) !== -1) {
    return _extends({}, result, {
      isValid: true,
      selectedPayment: 'PAYPAL'
    });
  }
  /**
   * Otherwise use Braintree;
   */
  else {
      return _extends({}, result, {
        isValid: true,
        selectedPayment: 'BRAINTREE'
      });
    }
}

function validateInput(request) {
  var currency = request.currency,
      cardType = request.cardType;

  if (_constants.ACCEPTED_CURRENCIES.indexOf(currency) < 0) return false;
  if (_constants.ACCEPTED_CARDTYPES.indexOf(cardType) < 0) return false;
  return true;
}