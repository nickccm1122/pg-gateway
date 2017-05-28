import BaseGateway from '../base'
import braintree from 'braintree'
import { validateConfigParams } from './paramsChecking'
import logger from '../../logger'

export class BraintreeGateway extends BaseGateway {
  constructor(params) {
    super(params)

    this.members = {
      createToken: this.createToken.bind(this),
      execute: this.executePayment.bind(this),
    }
  }

  /**
   * single entry to create a well-configured braintree gateway
   * 
   * @static
   * 
   * @memberof BraintreeGateway
   */
  static init(params) {
    const { error, value: config } = validateConfigParams(params)
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
   * middleware to create braintree client token
   * 
   * @memberof BraintreeGateway
   */
  async createToken() {
    // logger(this._instance.clientToken)
    return await this._instance.clientToken.generate({})
  }

  /**
   * middleware to execute payment after receiving payment nonce from client
   * 
   * @param {Object} ctx 
   * @param {Function} next 
   * 
   * @memberof BraintreeGateway
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
        await ctx.pgGateway._onPaymentApproved(this._name, {
          amount: amount
        }, response.transaction)
    }
    ctx.body = response.success
  }
}