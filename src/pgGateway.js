import logger from './logger'

/**
 * @class PGGateway
 */
export default class PGGateway {
  constructor() {
    this._gateways = {}
    this._isSandbox = true

    /**
     * Default action onPaymentInited, can be overrided using PGGateway.init method. This is also can be access thru ctx.pgGateway.onPaymentInited
     * @param {object} order Order
     * @param {object} response Response from 3th party gateway
     * @return {object|false}
     * @member PGGateway#onPaymentInited()
     */
    this.onPaymentInited = this._onPaymentInited.bind(this)
      /**
       * Default action onPaymentApproved, can be overrided using PGGateway.init method. This is also can be access thru ctx.pgGateway.onPaymentApproved
       * @param {string} gatewayName Gateway name
       * @param {object} order Order object
       * @param {object} response Response from 3th party gateway
       * @return {object|false}
       * @member PGGateway#onPaymentApproved()
       */
    this.onPaymentApproved = this._onPaymentApproved.bind(this)
      /**
       * Default action loadPaymentCreated, can be overrided using PGGateway.init method. This is also can be access thru ctx.pgGateway.loadPaymentCreated
       * @param {string} refId Reference Id
       * @return {object|false}
       * @member PGGateway#loadPaymentCreated()
       */
    this.loadPaymentCreated = this._loadPaymentCreated.bind(this)
      /**
       * Default action loadPaymentApproved, can be overrided using PGGateway.init method. This is also can be access thru ctx.pgGateway.loadPaymentApproved
       * @param {string} refId Reference Id
       * @param {string} username User Name
       * @return {object|false}
       * @member PGGateway#loadPaymentApproved()
       */
    this.loadPaymentApproved = this._loadPaymentApproved.bind(this)
  }

  /**
   * Add new configured payment gateway
   * 
   * @param {string} name Custom name that used to identify the gateway being added
   * @param {BaseGateway} gateway Payment gateway extends class BaseGateway
   * @returns {object} self
   * @member PGGateway#use()
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
   * Return a middleware to inject pgGateway into request's context
   * 
   * @param {object} options Options
   * @param {function} options.onPaymentInited Function that will be performed when payment is inited
   * @param {function} options.onPaymentApproved Function that will be performed when payment is approved( or confirmed by 3th party gateway)
   * @param {function} options.loadPaymentCreated Function to retrive data from database for payment created
   * @param {function} options.loadPaymentApproved Function to retrive data from database for payment approved
   * @member PGGateway#init()
   * @public
   * @return {function} middleware
   * 
   * @example 
   * import PgGateway from 'pg-gateway'
   * 
   * PgGateway.use(new BraintreeGateway({
   *  ...configs
   * }))
   * 
   * // To inject pgGateway into request's context
   * router.use(PgGateway.init({
   *  onPaymentApproved: (params) => {
   *    //...save data into db
   * },
   *  loadPaymentApproved: (refId, userName) => {
   *    //...retrive data from db
   * }
   * }))
   */
  init(options) {
    const {
      onPaymentInited,
      onPaymentApproved,
      loadPaymentCreated,
      loadPaymentApproved
    } = options || {}

    if (onPaymentInited) {
      this.onPaymentInited = onPaymentInited
    }

    if (onPaymentApproved) {
      this.onPaymentApproved = onPaymentApproved
    }

    if (loadPaymentCreated) {
      this.loadPaymentCreated = loadPaymentCreated
    }

    if (loadPaymentApproved) {
      this.loadPaymentApproved = loadPaymentApproved
    }

    return async(ctx, next) => {
      ctx.pgGateway = this
      await next()
    }
  }

  /**
   * Default action onPaymentInited
   * 
   * @param {any} params 
   * 
   * @member PGGateway#onPaymentInited
   * @private 
   * 
   */
  _onPaymentInited(params) {
    logger('PGGateway - onPaymentInited: %s', JSON.stringify(params))
    return false
  }

  /**
   * Default action onPaymentApproved
   * 
   * @param {any} params 
   * 
   * @member PGGateway#onPaymentApproved
   * @private 
   */
  _onPaymentApproved(params) {
    logger('PGGateway - onPaymentApproved: %s', JSON.stringify(params))
    return false
  }

  /**
   * Default action loadPaymentCreated
   * 
   * @returns [object|false]
   * 
   * @member PGGateway#loadPaymentCreated
   * @private
   */
  _loadPaymentCreated(refId, userName) {
    return false
  }

  /**
   * Default action loadPaymentApproved
   * 
   * @returns [object|false]
   * 
   * @member PGGateway#loadPaymentApproved
   * @private
   */
  _loadPaymentApproved() {
    return false
  }
}