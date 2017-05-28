import { name as BRAINTREE } from '../gateways/braintree'
import { name as RESTPAYPAL } from '../gateways/restPaypal'

export function classifyPayment({currency, cardType}) {

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
      selectedPayment: RESTPAYPAL
    }
  }

  /**
   * If currency is USD, EUR, or AUD, then use PayPal
   */
  if (['USD', 'EUR', 'AUD'].indexOf(currency) !== -1) {
    return {
      ...result,
      isValid: true,
      selectedPayment: RESTPAYPAL
    }
  }
  /**
   * Otherwise use Braintree;
   */
  else {
    return {
      ...result,
      isValid: true,
      selectedPayment: BRAINTREE
    }
  }

}