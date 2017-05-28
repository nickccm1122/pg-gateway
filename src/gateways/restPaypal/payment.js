import BaseGateway from '../base'
import paypal from 'paypal-rest-sdk'
import { validateConfigParams } from './paramsChecking'
import logger from '../../logger'

export class RestPaypalGateway extends BaseGateway {
  constructor(params) {
    super(params)

    this._RETURN_URL = params.returnUrl
    this._CANCEL_URL = params.cancelUrl

    /**
     * Middlewares supported by this gateway
     */
    this.members = {
      create: this.createPayment.bind(this),
      execute: this.executePayment.bind(this),
      checkPayment: this.checkPayment.bind(this)
    }
  }

  static init(params) {
    const { error, value: config } = validateConfigParams(params)
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
      cancelUrl: config.cancelUrl
    })

    return newGateway
  }

  async createPayment(ctx, next) {
    if (!ctx.pgGateway) {
      throw new Error('You have no pgGateway initialized.')
    }

    logger('Incoming request body: ' + JSON.stringify(ctx.request.body))

    const { amount } = ctx.request.body

    if (!amount) {
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
        'amount': amount
      }]
    }

    try {
      const payment = await new Promise((resolve, reject) => {
        this._instance.payment.create(createPaymentJson, (error, payment) => {
          if (error) {
            reject(error)
          } else {
            resolve(payment)
          }
        })
      })

      // redirect the user to paypal payment auth
      const redirectUrl = payment.links.find(link => {
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

  async executePayment(ctx) {
    if (!ctx.pgGateway) {
      throw new Error('You have no pgGateway initialized.')
    }

    // ?paymentId=PAY-xxxxxxx&
    // token=EC-xxxxxxxx&
    // PayerID=xxxxxxx
    const { paymentId, PayerID } = ctx.query
    let paymentObj, approvedPayment

    // 2. execute
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

    // 3. save cache
    if (approvedPayment && approvedPayment.state === 'approved') {
      if(ctx.pgGateway && ctx.pgGateway._onPaymentApproved)
        ctx.pgGateway._onPaymentApproved(this._name, {
          amount: 10
        }, paymentObj)
    }

    // 4. return 200 to client
    ctx.body = approvedPayment


  }

  async checkPayment(ctx, next) {
    await next()
  }
}