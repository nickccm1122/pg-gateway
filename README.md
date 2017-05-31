# PGGateway

Payment SDK of payment gateways

## Supported Payment Gateways

- Braintree
- Paypal REST API

## Demo

#### Method 1:

node version: > 7.7
1) prepare a redis server up and running, the example will look for 127.0.0.1:6379, go to `examples/payment/db/db.js` to change the host/port when needed
```javascript 
const client = redis.createClient({
    host: process.env.DEMO_REDIS || '127.0.0.1', // demo, change if need
    port: 6379  // demo port, change if need
  })
```
2) run the example server
```
npm run start:example
```

go to `http://localhost:3000` or `http://localhost:3000/check-payment`

#### Method 2:

Using Docker

1) [download docker-compose](https://docs.docker.com/compose/install/)
2) run `docker-compose build`
3) run `docker-compose up`

go to `http://localhost:3000` or `http://localhost:3000/check-payment`

**Test Credit Cards**
https://developers.braintreepayments.com/guides/credit-cards/testing-go-live/php


## How to use

```javascript
import PGGateway, { BraintreeGateway, RestPaypalGateway } from 'pg-gateway'

/**
 * 1. init gateways to be used
 * 2. add gateways into library, init library to add centralized db writing
 * 3. add routes
 */

// 1. init gateways to be used
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
  cancelUrl: 'http://localhost:3000/',
  onPaymentCreated: Order.save,       // callback to save the pending order
  onPaymentExecuted: Order.getById    // callback to save the approved payment
})

// 2. add gateways into library
PGGateway.use(braintree)
PGGateway.use(restPaypal)

// 3. add routes
router.use(PgGateway.init({
  // centralized way to save the approved payment into db/cache
  onPaymentApproved: (gateway, order, response) => {
    return Payment.save(gateway, order, response)
  },
}))
// REST Paypal
router.post('/paypal', PgGateway.REST_PAYPAL.members.create)
router.get('/paypal/execute', PgGateway.REST_PAYPAL.members.execute)
// Braintree
router.post('/braintree/execute', PgGateway.BRAINTREE.members.execute)


app.use(router.routes())
app.use(router.allowMethods())


```

## API Reference



* [PGGateway](#PGGateway)
    * [.onPaymentInited()](#PGGateway+onPaymentInited_new) ⇒ <code>object</code> \| <code>false</code>
    * [.onPaymentApproved()](#PGGateway+onPaymentApproved_new) ⇒ <code>object</code> \| <code>false</code>
    * [.loadPaymentCreated()](#PGGateway+loadPaymentCreated_new) ⇒ <code>object</code> \| <code>false</code>
    * [.loadPaymentApproved()](#PGGateway+loadPaymentApproved_new) ⇒ <code>object</code> \| <code>false</code>
    * [.use()](#PGGateway+use_new) ⇒ <code>object</code>
    * [.init()](#PGGateway+init_new) ⇒ <code>function</code>




* [RestPaypalGateway](#RestPaypalGateway) ⇐ [<code>BaseGateway</code>](#BaseGateway)
    * [.init(options)](#RestPaypalGateway+init) ⇒ <code>object</code>
    * [.createPayment(ctx, next)](#RestPaypalGateway+createPayment) ⇒ <code>promise</code>
    * [.executePayment(ctx)](#RestPaypalGateway+executePayment) ⇒ <code>promise</code>




* [BraintreeGateway](#BraintreeGateway) ⇐ [<code>BaseGateway</code>](#BaseGateway)
    * [.init(options)](#BraintreeGateway+init) ⇒ <code>object</code>
    * [.createToken()](#BraintreeGateway+createToken) ⇒ <code>object</code>
    * [.executePayment(ctx, next)](#BraintreeGateway+executePayment)



### PGGateway

  **Kind**: global class  
<a name="PGGateway+onPaymentInited_new"></a>

### pgGateway.onPaymentInited() ⇒ <code>object</code> \| <code>false</code>
Default action onPaymentInited, can be overrided using PGGateway.init method. This is also can be access thru ctx.pgGateway.onPaymentInited

**Kind**: instance property of [<code>PGGateway</code>](#PGGateway)  

| Param | Type | Description |
| --- | --- | --- |
| order | <code>object</code> | Order |
| response | <code>object</code> | Response from 3th party gateway |

<a name="PGGateway+onPaymentApproved_new"></a>

### pgGateway.onPaymentApproved() ⇒ <code>object</code> \| <code>false</code>
Default action onPaymentApproved, can be overrided using PGGateway.init method. This is also can be access thru ctx.pgGateway.onPaymentApproved

**Kind**: instance property of [<code>PGGateway</code>](#PGGateway)  

| Param | Type | Description |
| --- | --- | --- |
| gatewayName | <code>string</code> | Gateway name |
| order | <code>object</code> | Order object |
| response | <code>object</code> | Response from 3th party gateway |

<a name="PGGateway+loadPaymentCreated_new"></a>

### pgGateway.loadPaymentCreated() ⇒ <code>object</code> \| <code>false</code>
Default action loadPaymentCreated, can be overrided using PGGateway.init method. This is also can be access thru ctx.pgGateway.loadPaymentCreated

**Kind**: instance property of [<code>PGGateway</code>](#PGGateway)  

| Param | Type | Description |
| --- | --- | --- |
| refId | <code>string</code> | Reference Id |

<a name="PGGateway+loadPaymentApproved_new"></a>

### pgGateway.loadPaymentApproved() ⇒ <code>object</code> \| <code>false</code>
Default action loadPaymentApproved, can be overrided using PGGateway.init method. This is also can be access thru ctx.pgGateway.loadPaymentApproved

**Kind**: instance property of [<code>PGGateway</code>](#PGGateway)  

| Param | Type | Description |
| --- | --- | --- |
| refId | <code>string</code> | Reference Id |
| username | <code>string</code> | User Name |

<a name="PGGateway+use_new"></a>

### pgGateway.use() ⇒ <code>object</code>
Add new configured payment gateway

**Kind**: instance property of [<code>PGGateway</code>](#PGGateway)  
**Returns**: <code>object</code> - self  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | Custom name that used to identify the gateway being added |
| gateway | [<code>BaseGateway</code>](#BaseGateway) | Payment gateway extends class BaseGateway |

<a name="PGGateway+init_new"></a>

### pgGateway.init() ⇒ <code>function</code>
Return a middleware to inject pgGateway into request's context

**Kind**: instance property of [<code>PGGateway</code>](#PGGateway)  
**Returns**: <code>function</code> - middleware  
**Access**: public  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>object</code> | Options |
| options.onPaymentInited | <code>function</code> | Function that will be performed when payment is inited |
| options.onPaymentApproved | <code>function</code> | Function that will be performed when payment is approved( or confirmed by 3th party gateway) |
| options.loadPaymentCreated | <code>function</code> | Function to retrive data from database for payment created |
| options.loadPaymentApproved | <code>function</code> | Function to retrive data from database for payment approved |

**Example**  
```js
import PgGateway from 'pg-gateway'

PgGateway.use(new BraintreeGateway({
 ...configs
}))

// To inject pgGateway into request's context
router.use(PgGateway.init({
 onPaymentApproved: (params) => {
   //...save data into db
},
 loadPaymentApproved: (refId, userName) => {
   //...retrive data from db
}
}))
```


### RestPaypalGateway

  RestPaypalGateway - Provide middleware to handle payments

**Kind**: global class  
**Extends**: [<code>BaseGateway</code>](#BaseGateway)  
<a name="RestPaypalGateway+init"></a>

### restPaypalGateway.init(options) ⇒ <code>object</code>
Single entry to create a well-configured braintree gateway

**Kind**: instance method of [<code>RestPaypalGateway</code>](#RestPaypalGateway)  
**Returns**: <code>object</code> - new RestPaypalGateway  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>object</code> | Options |
| options.isSandbox | <code>boolean</code> |  |
| options.paypalClientId | <code>string</code> |  |
| options.paypalSecret | <code>string</code> |  |
| options.returnUrl | <code>string</code> |  |
| options.cancelUrl | <code>string</code> |  |

**Example**  
```js
import PGGateway from 'pg-gateway'
import { RestPaypalGateway } from '..path'

PGGateway.use(RestPaypalGateway.init({
   isSandbox: true,
   paypalClientId: 'AbVGZ5Tc_2HKOYaIpiXPm_JHXbMECy7J7WnTyP2y4n3LsHfjwHvNE9XPHVPVHuF2qv8fVKm5qJ9U3txS',
   paypalSecret: 'EOBxs78isIeg7myFaReh0rw-eTC_y47TETI5vT5-AfMB6i1FtmwopA-OY_RV6bJTlU3yMU34IbzbI9Xv',
   returnUrl: 'http://localhost:3000/paypal/execute',
   cancelUrl: 'http://localhost:3000/',
   onPaymentCreated: (id, order) => { //cache the order }
   onPaymentExecuted: (key) => { //retrive the cached order}
}))

// this instance will expose 2 functions
// - create: function to create payment and send to paypal
// - execute: middleware to process payment
//
// you may access thru 
// - pgGateway.BRAINTREE.member.create or 
// - pgGateway.BRAINTREE.member.execute 
```
<a name="RestPaypalGateway+createPayment"></a>

### restPaypalGateway.createPayment(ctx, next) ⇒ <code>promise</code>
Middleware to create paypal payment

**Kind**: instance method of [<code>RestPaypalGateway</code>](#RestPaypalGateway)  

| Param | Type |
| --- | --- |
| ctx | <code>any</code> | 
| next | <code>any</code> | 

<a name="RestPaypalGateway+executePayment"></a>

### restPaypalGateway.executePayment(ctx) ⇒ <code>promise</code>
Middleware to execute paypal payment

**Kind**: instance method of [<code>RestPaypalGateway</code>](#RestPaypalGateway)  

| Param | Type |
| --- | --- |
| ctx | <code>any</code> | 



### BraintreeGateway

  BraintreeGateway - Provide middleware to handle payments

**Kind**: global class  
**Extends**: [<code>BaseGateway</code>](#BaseGateway)  
<a name="BraintreeGateway+init"></a>

### braintreeGateway.init(options) ⇒ <code>object</code>
Single entry to create a well-configured braintree gateway

**Kind**: instance method of [<code>BraintreeGateway</code>](#BraintreeGateway)  
**Returns**: <code>object</code> - new BraintreeGateway  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>object</code> | Options |
| options.isSandbox | <code>boolean</code> |  |
| options.BRAINTREE_MERCHANT_ID | <code>string</code> |  |
| options.BRAINTREE_PUBLIC_KEY | <code>string</code> |  |
| options.BRAINTREE_PRIVATE_KEY | <code>string</code> |  |

**Example**  
```js
import PGGateway from 'pg-gateway'
import { BraintreeGateway } from '..path'

PGGateway.use(BraintreeGateway.init({
   isSandbox: true,
   BRAINTREE_MERCHANT_ID: 'cx48wn2djqx2m4db',
   BRAINTREE_PUBLIC_KEY: '3zw4pzcmg46jbt77',
   BRAINTREE_PRIVATE_KEY: '01418a6cb6f2ab403dd8e61620934c96'
}))

// this instance will expose 2 function
// - createToken: function to create client token
// - execute: middleware to process payment
//
// you may access thru 
// - pgGateway.BRAINTREE.member.createToken or 
// - pgGateway.BRAINTREE.member.execute
```
<a name="BraintreeGateway+createToken"></a>

### braintreeGateway.createToken() ⇒ <code>object</code>
Middleware to create braintree client token

**Kind**: instance method of [<code>BraintreeGateway</code>](#BraintreeGateway)  
**Returns**: <code>object</code> - Response from braintree.clientToken.generate()  
<a name="BraintreeGateway+executePayment"></a>

### braintreeGateway.executePayment(ctx, next)
Middleware to execute payment after receiving payment nonce from client

**Kind**: instance method of [<code>BraintreeGateway</code>](#BraintreeGateway)  

| Param | Type |
| --- | --- |
| ctx | <code>Object</code> | 
| next | <code>function</code> | 




## Generate Docs

```
npm run docs
```

## Test 

```
npm run test
npm run test:watch
```