import BaseGateway from '../base'
import braintree from 'braintree'
import { validateConfigParams } from './paramsChecking'
import logger from '../../logger'

/**
 * 
 * @class BraintreeGateway - Provide middleware to handle payments
 * @extends BaseGateway
 */
export class BraintreeGateway extends BaseGateway {
  constructor(params) {
    super(params)

    this.members = {
      createToken: this.createToken.bind(this),
      execute: this.executePayment.bind(this),
    }
  }

  /**
   * Single entry to create a well-configured braintree gateway
   * 
   * @param {object} options Options
   * @param {boolean} options.isSandbox 
   * @param {string} options.BRAINTREE_MERCHANT_ID 
   * @param {string} options.BRAINTREE_PUBLIC_KEY 
   * @param {string} options.BRAINTREE_PRIVATE_KEY 
   * @method BraintreeGateway#init
   * @static 
   * @return {object} new BraintreeGateway
   * @example 
   * import PGGateway from 'pg-gateway'
   * import { BraintreeGateway } from '..path'
   * 
   * PGGateway.use(BraintreeGateway.init({
   *    isSandbox: true,
   *    BRAINTREE_MERCHANT_ID: 'cx48wn2djqx2m4db',
   *    BRAINTREE_PUBLIC_KEY: '3zw4pzcmg46jbt77',
   *    BRAINTREE_PRIVATE_KEY: '01418a6cb6f2ab403dd8e61620934c96'
   * }))
   * 
   * // this instance will expose 2 function
   * // - createToken: function to create client token
   * // - execute: middleware to process payment
   * //
   * // you may access thru 
   * // - pgGateway.BRAINTREE.member.createToken or 
   * // - pgGateway.BRAINTREE.member.execute
   * 
   */
  static init(options) {
    const { error, value: config } = validateConfigParams(options)
    if (error) {
      throw new Error(`Config validation error: ${error.message}`)
    }

    const braintreeInstance = braintree.connect({
      environment: config.isSandbox ? braintree.Environment.Sandbox : braintree.Environment.Production,
      merchantId: config.BRAINTREE_MERCHANT_ID,
      publicKey: config.BRAINTREE_PUBLIC_KEY,
      privateKey: config.BRAINTREE_PRIVATE_KEY
    })

    const newGateway = new BraintreeGateway({
      instance: braintreeInstance,
      name: 'BRAINTREE'
    })

    return newGateway
  }

  /**
   * Middleware to create braintree client token
   * 
   * @return {object} Response from braintree.clientToken.generate()
   * @method BraintreeGateway#createToken
   */
  async createToken() {
    // logger(this._instance.clientToken)
    return await this._instance.clientToken.generate({})
  }

  /**
   * Middleware to execute payment after receiving payment nonce from client
   * 
   * @param {Object} ctx 
   * @param {Function} next 
   * 
   * @method BraintreeGateway#executePayment
   */
  async executePayment(ctx, next) {

    if (!ctx.pgGateway) {
      throw new Error('You have no pgGateway initialized.')
    }

    const { nonce, order } = ctx.request.body

    logger(nonce)
    logger(order)
    const response = await this._instance.transaction.sale({
      amount: order.price,
      paymentMethodNonce: nonce,
      options: {
        submitForSettlement: true
      }
    })

    if (response && response.success) {
      logger(response)
      const result =  await this.saveToDB(ctx, response)

      ctx.body =  result ? {
        refCode: result, 
        message: 'Please use the refCode and username to check your payment'
      } : {
        success: true
      }
    } 
  }

  /**
   * Save approved payment into cache
   * 
   * @param {object} ctx 
   * @param {object} resFromBraintree 
   * @returns {object} object containing refId, username
   * 
   * @member BraintreeGateway#saveToDB
   * @private
   */
  async saveToDB(ctx, resFromBraintree) {
    const { order } = ctx.request.body
    let result

    if (ctx.pgGateway && ctx.pgGateway.onPaymentApproved) {
      result = await ctx.pgGateway.onPaymentApproved(this._name, {
        ...order
      }, resFromBraintree.transaction)
    }

    logger(result)

    return result
  }
}