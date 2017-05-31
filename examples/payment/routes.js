import Router from 'koa-router'
import fs from 'fs'
import configurePgGateway from './configurePgGateway'
import { Payment } from './db/payment'
const PgGateway = configurePgGateway()

/**
 * End Points
 * 
 * - payment order form -> /
 * - checking payment form -> /check-payment
 */
const router = new Router({})

/**
 * payment form
 */
router.get('/', async(ctx) => {
  const paymentFormHTML = fs.readFileSync(__dirname + '/paymentForm/payment-form.html', 'utf8')

  const response = await PgGateway.BRAINTREE.members.createToken()

  ctx.body = paymentFormHTML.replace('CLIENT_AUTHORIZATION_TOKEN', response.clientToken)
})

/**
 * payment checking form
 */
router.get('/check-payment', (ctx) => {
  const paymentCheckingHTML = fs.readFileSync(__dirname + '/paymentChecking/payment-checking.html', 'utf8')
  ctx.body = paymentCheckingHTML
})

router.post('/check-payment', async(ctx) => {
  const { form } = ctx.request.body
  if (!form.username || !form.refCode) {
    ctx.throw(400, 'invalid form values')
    return
  }

  const cache = await Payment.getByRefId(form.refCode)

  if (!cache ||cache.order.username !== form.username) {
    ctx.body = {
      success: false,
      message: 'Record No Found'
    }
    return
  } else {
    console.log(cache.order)
    ctx.body = {
      success: true,
      message: 'successfully found',
      order: cache.order
    }
  }
})


/**
 * Payments routes
 * 
 * /paypal POST
 * /paypal/execute GET
 * 
 * /braintree/execute POST
 * 
 */

// Inject pgGateway into ctx
router.use(PgGateway.init({
    onPaymentApproved: (gateway, order, response) => {
      return Payment.save(gateway, order, response)
    },
  }))
  // REST Paypal
router.post('/paypal', PgGateway.REST_PAYPAL.members.create)
router.get('/paypal/execute', PgGateway.REST_PAYPAL.members.execute)
  // Braintree
router.post('/braintree/execute', PgGateway.BRAINTREE.members.execute)

export default router