import {
  ACCEPTED_CURRENCIES,
  ACCEPTED_CARDTYPES
} from './constants'
export * from './constants'

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
export function classifyPayment(request) {

  const isRequestValid = validateInput(request)
  if (!isRequestValid) throw new Error('INVALID_REQUEST_PAYLOAD')

  const { currency, cardType } = request
  const result = {
    selectedPayment: null,
    isValid: false,
    reason: null
  }

  /**
   * If currency is not USD and the credit card is AMEX, return error message 
   */
  if (currency !== 'USD' && cardType === 'AMERICAN_EXPRESS') {
    return {
      ...result,
      isValid: false,
      reason: 'AMEX_IS_ONLY_FOR_USD'
    }
  }

  /**
   * If credit card is AMEX, then use PayPal;
   */
  if (cardType === 'AMEX') {
    return {
      ...result,
      isValid: true,
      selectedPayment: 'PAYPAL'
    }
  }

  /**
   * If currency is USD, EUR, or AUD, then use PayPal
   */
  if (['USD', 'EUR', 'AUD'].indexOf(currency) !== -1) {
    return {
      ...result,
      isValid: true,
      selectedPayment: 'PAYPAL'
    }
  }
  /**
   * Otherwise use Braintree;
   */
  else {
    return {
      ...result,
      isValid: true,
      selectedPayment: 'BRAINTREE'
    }
  }

}

export function validateInput(request) {
  const { currency, cardType } = request
  if (ACCEPTED_CURRENCIES.indexOf(currency) < 0) return false
  if (ACCEPTED_CARDTYPES.indexOf(cardType) < 0) return false
  return true
}