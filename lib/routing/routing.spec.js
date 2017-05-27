'use strict';

var _index = require('./index');

var _constants = require('./constants');

describe('Routing Library', function () {

  describe('Constants', function () {

    it('should have ACCEPTED_CURRENCIES defined', function () {
      expect(_constants.ACCEPTED_CURRENCIES).to.not.be.undefined;
    });

    it('should have ACCEPTED_CARDTYPES defined', function () {
      expect(_constants.ACCEPTED_CARDTYPES).to.not.be.undefined;
    });
  });

  describe('function validateInput', function () {
    it('should return false for invalid payment arg', function () {
      var result = (0, _index.validateInput)({
        currency: 'Whatever',
        cardType: 'MASTERCARD'
      });

      expect(result).to.be.false;
    });

    it('should return true for valid payment arg', function () {
      _constants.ACCEPTED_CURRENCIES.map(function (validCurrency) {
        expect((0, _index.validateInput)({
          currency: validCurrency,
          cardType: _constants.ACCEPTED_CARDTYPES[0]
        })).to.be.true;
      });

      _constants.ACCEPTED_CARDTYPES.map(function (validCardType) {
        expect((0, _index.validateInput)({
          currency: _constants.ACCEPTED_CURRENCIES[0],
          cardType: validCardType
        })).to.be.true;
      });
    });
  });

  describe('classifyPayment', function () {

    describe('Special case: If currency is not USD and the credit card is AMEX', function () {
      it('should be invalid and return with a reason', function () {
        var currencyNotValidWithAmex = ['HKD', 'JPY', 'CNY', 'AUD', 'EUR'];

        currencyNotValidWithAmex.map(function (currency) {
          expect((0, _index.classifyPayment)({
            currency: currency,
            cardType: 'AMERICAN_EXPRESS'
          }).isValid).to.be.false;

          expect((0, _index.classifyPayment)({
            currency: currency,
            cardType: 'AMERICAN_EXPRESS'
          }).reason).to.equal('AMEX_IS_ONLY_FOR_USD');
        });
      });
    });

    describe('If credit card is AMEX', function () {
      it('should be valid and selectedPayment is PAYPAL', function () {
        var result = (0, _index.classifyPayment)({
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
          var result = (0, _index.classifyPayment)({
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
          var result = (0, _index.classifyPayment)({
            currency: currency,
            cardType: 'VISA'
          });
          expect(result.isValid).to.be.true;
          expect(result.selectedPayment).to.equal('BRAINTREE');
        });
      });
    });
  });
});