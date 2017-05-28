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

router.get('/', async(ctx) => {
  const paymentFormHTML = fs.readFileSync(__dirname + '/paymentForm/payment-form.html', 'utf8')

  const response = await PgGateway.BRAINTREE.members.createToken()

  ctx.body = paymentFormHTML.replace('CLIENT_AUTHORIZATION_TOKEN', response.clientToken)
})

router.get('/check-payment', (ctx) => {
  const paymentCheckingHTML = fs.readFileSync(__dirname + '/paymentChecking/payment-checking.html', 'utf8')
  ctx.body = paymentCheckingHTML
})

router.post('/check-payment', (ctx) => {
  console.log(ctx.request.body)
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
router.use(PgGateway.init({
  onPaymentApproved: (gateway, order, response) => {
    return Payment.save(gateway, order, response)
  }
}))


// REST Paypal
router.post('/paypal', PgGateway.REST_PAYPAL.members.create)
router.get('/paypal/execute', PgGateway.REST_PAYPAL.members.execute)

router.post('/braintree/execute', PgGateway.BRAINTREE.members.execute)



export default router