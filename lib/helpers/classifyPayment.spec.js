'use strict';

var _classifyPayment = require('./classifyPayment');

describe('Default rule classifyPayment', function () {

  describe('Special case: If currency is not USD and the credit card is AMEX', function () {
    it('should be invalid and return with a reason', function () {
      var currencyNotValidWithAmex = ['HKD', 'JPY', 'CNY', 'AUD', 'EUR'];

      currencyNotValidWithAmex.map(function (currency) {
        expect((0, _classifyPayment.classifyPayment)({
          currency: currency,
          cardType: 'AMERICAN_EXPRESS'
        }).isValid).to.be.false;

        expect((0, _classifyPayment.classifyPayment)({
          currency: currency,
          cardType: 'AMERICAN_EXPRESS'
        }).reason).to.equal('AMEX_IS_ONLY_FOR_USD');
      });
    });
  });

  describe('If credit card is AMEX', function () {
    it('should be valid and selectedPayment is PAYPAL', function () {
      var result = (0, _classifyPayment.classifyPayment)({
        currency: 'USD',
        cardType: 'AMERICAN_EXPRESS'
      });
      expect(result.isValid).to.be.true;
      expect(result.selectedPayment).to.equal('PAYPAL');
    });
  });

  describe('If currency is USD, EUR, or AUD', function () {
    it('should be valid and selectedPayment is PAYPAL', function () {

      ['USD', 'EUR', 'AUD'].map(function (currency) {
        var result = (0, _classifyPayment.classifyPayment)({
          currency: currency,
          cardType: 'VISA'
        });
        expect(result.isValid).to.be.true;
        expect(result.selectedPayment).to.equal('PAYPAL');
      });
    });
  });

  describe('If currency is HKD, JPY, CNY', function () {
    it('should be valid and selectedPayment is BRAINTREE', function () {

      ['HKD', 'JPY', 'CNY'].map(function (currency) {
        var result = (0, _classifyPayment.classifyPayment)({
          currency: currency,
          cardType: 'VISA'
        });
        expect(result.isValid).to.be.true;
        expect(result.selectedPayment).to.equal('BRAINTREE');
      });
    });
  });
});