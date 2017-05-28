/**
 * Configure pg-gateway
 */
import PGGateway, { BraintreeGateway, RestPaypalGateway } from '../../src';


export default function configurePgGateway() {

  /**
   * braintree configs
   */
  const braintree = BraintreeGateway.init({
    isSandbox: true,
    BRAINTREE_MERCHANT_ID: 'cx48wn2djqx2m4db',
    BRAINTREE_PUBLIC_KEY: '3zw4pzcmg46jbt77',
    BRAINTREE_PRIVATE_KEY: '01418a6cb6f2ab403dd8e61620934c96'
  })


  /**
   * rest paypal configs
   */
  const restPaypal = RestPaypalGateway.init({
    isSandbox: true,
    paypalClientId: 'AbVGZ5Tc_2HKOYaIpiXPm_JHXbMECy7J7WnTyP2y4n3LsHfjwHvNE9XPHVPVHuF2qv8fVKm5qJ9U3txS',
    paypalSecret: 'EOBxs78isIeg7myFaReh0rw-eTC_y47TETI5vT5-AfMB6i1FtmwopA-OY_RV6bJTlU3yMU34IbzbI9Xv',
    returnUrl: 'http://localhost:3000/paypal/execute',
    cancelUrl: 'http://localhost:3000/'
  })

  PGGateway.use(braintree)
  PGGateway.use(restPaypal)

  return PGGateway
}