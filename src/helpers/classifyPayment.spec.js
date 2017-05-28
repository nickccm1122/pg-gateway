import {
  classifyPayment
} from './classifyPayment'

describe('Default rule classifyPayment', function () {

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