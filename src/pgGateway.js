import logger from './logger'

/**
 * @export
 * @class PGGateway
 */
export default class PGGateway {
  constructor() {
    this._gateways = {}
    this._isSandbox = true
    this._onPaymentInited = this.onPaymentInited.bind(this)
    this._onPaymentApproved = this.onPaymentApproved.bind(this)
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
      name = gateway._name
    }
    if (!name) throw new Error('Gateway must have a name!')

    this._gateways[name] = gateway
    this[name] = this._gateways[name] // also create a reference as member prop)
    return this
  }

  /**
   * Return a middleware
   * 
   * @memberof PGGateway
   */
  init(params) {
    const {onPaymentInited, onPaymentApproved} = params || {}

    if (onPaymentInited) {
      this._onPaymentInited = onPaymentInited
    }

    if (onPaymentApproved) {
      this._onPaymentApproved = onPaymentApproved
    }

    return async (ctx, next) => {
      ctx.pgGateway = this
      await next()
    }
  }

  /**
   * Default action onPaymentInited
   * 
   * @param {any} params 
   * 
   * @memberof PGGateway
   */
  onPaymentInited(params) {
    logger('PGGateway - onPaymentInited: %s', JSON.stringify(params))
    return false
  }

  /**
   * Default action onPaymentApproved
   * 
   * @param {any} params 
   * 
   * @memberof PGGateway
   */
  onPaymentApproved(params) {
    logger('PGGateway - onPaymentApproved: %s', JSON.stringify(params))
    return false
  }

  loadPaymentCreated() {
    return false
  }

  loadPaymentApproved() {
    return false
  }
}