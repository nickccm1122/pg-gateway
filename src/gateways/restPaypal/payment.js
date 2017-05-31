import BaseGateway from '../base'
import paypal from 'paypal-rest-sdk'
import { validateConfigParams } from './paramsChecking'
import logger from '../../logger'

/**
 * @class RestPaypalGateway - Provide middleware to handle payments
 * @extends BaseGateway
 */
export class RestPaypalGateway extends BaseGateway {
  constructor(params) {
    super(params)

    this._RETURN_URL = params.returnUrl
    this._CANCEL_URL = params.cancelUrl
    this._onPaymentCreated = params.onPaymentCreated
    this._onPaymentExecuted = params.onPaymentExecuted

    /**
     * Middlewares supported by this gateway
     */
    this.members = {
      create: this.createPayment.bind(this),
      execute: this.executePayment.bind(this),
      checkPayment: this.checkPayment.bind(this)
    }
  }

  /**
   * Single entry to create a well-configured braintree gateway
   * 
   * @param {object} options Options
   * @param {boolean} options.isSandbox 
   * @param {string} options.paypalClientId 
   * @param {string} options.paypalSecret 
   * @param {string} options.returnUrl
   * @param {string} options.cancelUrl 
   *
   * @return {object} new RestPaypalGateway
   * @static 
   * @method RestPaypalGateway#init
   * 
   * @example 
   * 
   * import PGGateway from 'pg-gateway'
   * import { RestPaypalGateway } from '..path'
   * 
   * PGGateway.use(RestPaypalGateway.init({
   *    isSandbox: true,
   *    paypalClientId: 'AbVGZ5Tc_2HKOYaIpiXPm_JHXbMECy7J7WnTyP2y4n3LsHfjwHvNE9XPHVPVHuF2qv8fVKm5qJ9U3txS',
   *    paypalSecret: 'EOBxs78isIeg7myFaReh0rw-eTC_y47TETI5vT5-AfMB6i1FtmwopA-OY_RV6bJTlU3yMU34IbzbI9Xv',
   *    returnUrl: 'http://localhost:3000/paypal/execute',
   *    cancelUrl: 'http://localhost:3000/',
   *    onPaymentCreated: (id, order) => { //cache the order }
   *    onPaymentExecuted: (key) => { //retrive the cached order}
   * }))
   */
  static init(options) {
    const { error, value: config } = validateConfigParams(options)
    if (error) {
      throw new Error(`Config validation error: ${error.message}`)
    }

    paypal.configure({
      'mode': config.isSandbox ? 'sandbox' : 'live', //sandbox or live
      'client_id': config.paypalClientId,
      'client_secret': config.paypalSecret,
      'headers': {
        'custom': 'header'
      }
    })

    const newGateway = new RestPaypalGateway({
      instance: paypal,
      name: 'REST_PAYPAL',
      returnUrl: config.returnUrl,
      cancelUrl: config.cancelUrl,
      onPaymentCreated: config.onPaymentCreated,
      onPaymentExecuted: config.onPaymentExecuted,
    })

    return newGateway
  }

  /**
   * Middleware to create paypal payment
   * 
   * @param {any} ctx 
   * @param {any} next 
   * @return {promise} 
   * @method RestPaypalGateway#createPayment
   */
  async createPayment(ctx, next) {
    if (!ctx.pgGateway) {
      throw new Error('You have no pgGateway initialized.')
    }

    logger('Incoming request body: ' + JSON.stringify(ctx.request.body))

    const { order } = ctx.request.body

    if (!order && order.price) {
      ctx.throw(400, 'You have no amount values')
    }

    const createPaymentJson = {
      'intent': 'sale',
      'payer': {
        'payment_method': 'paypal'
      },
      'redirect_urls': {
        'return_url': this._RETURN_URL,
        'cancel_url': this._CANCEL_URL
      },
      'transactions': [{
        'amount': {
          'total':order.price,
          'currency': order.currency
        }
      }]
    }


    try {
      const response = await new Promise((resolve, reject) => {
        this._instance.payment.create(createPaymentJson, (error, payment) => {
          if (error) {
            reject(error)
          } else {
            resolve(payment)
          }
        })
      })

      /**
       * cache the order
       */
      logger(this._onPaymentCreated)
      this._onPaymentCreated(response.id, order)

      // redirect the user to paypal payment auth
      const redirectUrl = response.links.find(link => {
        return link.rel === 'approval_url'
      }).href

      // Paypal auth redirect
      // ctx.redirect(redirectLink)
      ctx.body = {
        redirectUrl: redirectUrl
      }

    } catch (error) {
      ctx.throw(500, 'Cannot initialize payment with paypal.')
    }
  }


  /**
   * Middleware to execute paypal payment
   * 
   * @param {any} ctx 
   * @return {promise} 
   * @method RestPaypalGateway#executePayment
   */
  async executePayment(ctx) {
    if (!ctx.pgGateway) {
      throw new Error('You have no pgGateway initialized.')
    }

    // ?paymentId=PAY-xxxxxxx&
    // token=EC-xxxxxxxx&
    // PayerID=xxxxxxx
    const { paymentId, PayerID } = ctx.query
    let paymentObj, approvedPayment

    // 1. execute
    if (!paymentObj) {
      approvedPayment = await new Promise((resolve, reject) => {
        paypal.payment.execute(paymentId, {payer_id: PayerID}, function (error, payment) {
          if (error) {
            reject(error)
          } else {
            resolve(payment)
          }
        })
      })
    }

    // 2. retrive order cache
    const order = await this._onPaymentExecuted(approvedPayment.id) 

    // 3. save cache
    if (approvedPayment && approvedPayment.state === 'approved') {
      logger(approvedPayment)
      const result = await this.saveToDB(ctx, approvedPayment, order)
      
      ctx.body = result ? { refCode: result, message: 'Please use the refCode and username to check your payment, Go to http://localhost:3000/check-payment'} : {
        success: true
      }
    }

  }

  /**
   * Save approved payment into cache
   * 
   * @param {object} ctx 
   * @param {object} resFromBraintree 
   * @param {object} order order from cache
   * @returns {object} object containing refId, username
   * 
   * @member RestPaypalGateway#saveToDB
   * @private
   */
  async saveToDB(ctx, approvedPayment, order) {
    let result

    if (ctx.pgGateway && ctx.pgGateway.onPaymentApproved) {
      result = await ctx.pgGateway.onPaymentApproved(this._name, {
        ...order
      }, approvedPayment)
    }

    logger(result)

    return result
  }

  /**
   * Middleware to check paypal payment
   * 
   * @param {any} ctx 
   * @return {promise} 
   * @method RestPaypalGateway#checkPayment
   */
  async checkPayment(ctx, next) {
    await next()
  }
}