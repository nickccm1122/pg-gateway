# PGGateway

Payment SDK of payment gateways

## Supported Payment Gateways

- Braintree: 
- Paypal REST API: PayPal Payments

## How to use



```javascript
import PGGateway, { BraintreeGateway, RestPaypalGateway } from 'pg-gateway'

// Create a braintree gateway
// Grad your paypal api tokens and plug it in
PGGateway.use(new BraintreeGateway({
    isSandbox: true,    // Set false if for production
    PAYPAL_CLIENT_ID: 'xxx',  // Your paypal client id
    PAYPAL_SECRET: 'xxx'  // Your paypal secret
}))

// Create a rest paypal gateway
// Grad your braintree tokens and plug it in
PGGateway.use(new BraintreeGateway({
    isSandbox: true,
    BRAINTREE_MERCHANT_ID: 'xxx',   
    BRAINTREE_PUBLIC_KEY: 'xxx',
    BRAINTREE_PRIVATE_KEY: 'xxx'
}))



```