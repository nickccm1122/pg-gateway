import BaseGateway from '../base'
import braintree from 'braintree'
import { validateConfigParams } from './paramsChecking'

export const name = 'BRAINTREE'

export default class BraintreeGateway extends BaseGateway {
  constructor(params) {
    super(params)
  }

  /**
   * single entry to create a well-configured braintree gateway
   * 
   * @static
   * 
   * @memberof BraintreeGateway
   */
  static async init(params) {
    const { error, value: config } = validateConfigParams(params)
    if (error) {
      throw new Error(`Config validation error: ${error.message}`)
    }

    this._instance = await this.connect(config)
  }

  async connect(config) {
    this._instance = await braintree.connect({
      environment: config.isSandbox ? braintree.Environment.Sandbox : braintree.Environment.Production,
      merchantId: config.BRAINTREE_MERCHANT_ID,
      publicKey: config.BRAINTREE_PUBLIC_KEY,
      privateKey: config.BRAINTREE_PRIVATE_KEY
    })
  }
}