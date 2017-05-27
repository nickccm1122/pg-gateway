import {
  validateInput,
  classifyPayment,
} from './index'

import {
  ACCEPTED_CURRENCIES,
  ACCEPTED_CARDTYPES
} from './constants'



describe('Routing Library', function () {


  describe('Constants', function () {

    it('should have ACCEPTED_CURRENCIES defined', () => {
      expect(ACCEPTED_CURRENCIES).to.not.be.undefined
    })

    it('should have ACCEPTED_CARDTYPES defined', () => {
      expect(ACCEPTED_CARDTYPES).to.not.be.undefined
    })
  })


  describe('function validateInput', function () {
    it('should return false for invalid payment arg', () => {
      let result = validateInput({
        currency: 'Whatever',
        cardType: 'MASTERCARD'
      })

      expect(result).to.be.false
    })

    it('should return true for valid payment arg', () => {
      ACCEPTED_CURRENCIES.map(validCurrency => {
        expect(validateInput({
          currency: validCurrency,
          cardType: ACCEPTED_CARDTYPES[0]
        })).to.be.true
      })

      ACCEPTED_CARDTYPES.map(validCardType => {
        expect(validateInput({
          currency: ACCEPTED_CURRENCIES[0],
          cardType: validCardType
        })).to.be.true
      })
    })
  })


  describe('classifyPayment', function () {

    describe('Special case: If currency is not USD and the credit card is AMEX', function () {
      it('should be invalid and return with a reason', () => {
        const currencyNotValidWithAmex = [
          'HKD',
          'JPY',
          'CNY',
          'AUD',
          'EUR'
        ]

        currencyNotValidWithAmex.map(currency => {
          expect(classifyPayment({
            currency: currency,
            cardType: 'AMERICAN_EXPRESS'
          }).isValid).to.be.false

          expect(classifyPayment({
            currency: currency,
            cardType: 'AMERICAN_EXPRESS'
          }).reason).to.equal('AMEX_IS_ONLY_FOR_USD')
        })
      })
    })


    describe('If credit card is AMEX', function () {
      it('should be valid and selectedPayment is PAYPAL', () => {
        const result = classifyPayment({
          currency: 'USD',
          cardType: 'AMERICAN_EXPRESS'
        })
        expect(result.isValid).to.be.true
        expect(result.selectedPayment).to.equal('PAYPAL')
      })
    })

    describe('If currency is USD, EUR, or AUD', function () {
      it('should be valid and selectedPayment is PAYPAL', () => {

        ['USD', 'EUR', 'AUD'].map((currency) => {
          const result = classifyPayment({
            currency: currency,
            cardType: 'VISA'
          })
          expect(result.isValid).to.be.true
          expect(result.selectedPayment).to.equal('PAYPAL')
        })
      })
    })

    describe('If currency is HKD, JPY, CNY', function () {
      it('should be valid and selectedPayment is BRAINTREE', () => {

        ['HKD', 'JPY', 'CNY'].map((currency) => {
          const result = classifyPayment({
            currency: currency,
            cardType: 'VISA'
          })
          expect(result.isValid).to.be.true
          expect(result.selectedPayment).to.equal('BRAINTREE')
        })
      })
    })

  })


})