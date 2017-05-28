import PGGateway from './pgGateway.js'

/**
 * pg-gateway singleton
 */
export default new PGGateway()

/**
 * Supported gateways
 */
export { BraintreeGateway } from './gateways/braintree/payment'
export { RestPaypalGateway } from './gateways/restPaypal/payment'