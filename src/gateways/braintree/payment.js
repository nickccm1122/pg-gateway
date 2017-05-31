import BaseGateway from '../base'
import braintree from 'braintree'
import { validateConfigParams } from './paramsChecking'
import logger from '../../logger'

/**
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

    const { nonce, amount } = ctx.request.body

    logger(nonce)
    logger(amount)
    const response = await this._instance.transaction.sale({
      amount: amount,
      paymentMethodNonce: nonce,
      options: {
        submitForSettlement: true
      }
    })

    // logger(response)
    if (response && response.success) {
      // console.log(ctx.pgGateway._onPaymentApproved)
      if (ctx.pgGateway && ctx.pgGateway._onPaymentApproved)
        await ctx.pgGateway.onPaymentApproved(this._name, {
          amount: amount
        }, response.transaction)
    }
    ctx.body = response.success
  }
}