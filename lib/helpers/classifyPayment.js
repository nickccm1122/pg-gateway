'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.classifyPayment = classifyPayment;

var _braintree = require('../gateways/braintree');

var _restPaypal = require('../gateways/restPaypal');

function classifyPayment(_ref) {
  var currency = _ref.currency,
      cardType = _ref.cardType;


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
      selectedPayment: _restPaypal.name
    });
  }

  /**
   * If currency is USD, EUR, or AUD, then use PayPal
   */
  if (['USD', 'EUR', 'AUD'].indexOf(currency) !== -1) {
    return _extends({}, result, {
      isValid: true,
      selectedPayment: _restPaypal.name
    });
  }
  /**
   * Otherwise use Braintree;
   */
  else {
      return _extends({}, result, {
        isValid: true,
        selectedPayment: _braintree.name
      });
    }
}