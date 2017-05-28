import { classifyPayment } from './helpers/classifyPayment';
/**
 * @export
 * @class PGGateway
 */
export default class PGGateway {
  constructor() {
    this._gateways = {}
    this._selectionRule = classifyPayment
    this._isSandbox = true
  }

  /**
   * Add configured payment gateway
   * 
   * @param {string} name - the payment that name will be identified by this Object
   * @param {BaseGateway} gateway - Payment gateway 
   * @returns {object} - The object itself
   * 
   * @memberof PGGateway
   */
  use(name, gateway) {
    if (!gateway) {
      gateway = name
      name = gateway.name
    }
    if (!name) throw new Error('Gateway must have a name!')

    this._gateways[name] = gateway
    return this
  }

  /**
   * Add logic to decide which payment to use.
   * There is a default logic if no input is provided.
   * 
   * The provided method will have an object with currency and cardType as input.
   * 
   * The provided method must return a object with a name of the selected Payment
   * 
   * @example 
   * addDeaddDecisionLogic(({currency, cardType}) => {
   *  ...logic...
   *  return {
   *    selectedPayment: 'BRAINTREE' // your defined name of payment or default.
   *    isValid: true   // To indicate the payment can be keep processing
   *    reason: null    // Optional. set to some value if the payment can't be processed.
   *  }
   * })
   * 
   * @memberof PGGateway
   */
  addDecisionRule(inputMethod) {
    this._selectionRule = inputMethod
  }

  /**
   * high level method to create transaction
   * 
   * @memberof PGGateway
   */
  createTransaction() {
    
  }

}