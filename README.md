# PGGateway

Payment SDK of payment gateways

## Supported Payment Gateways

- Braintree: 
- Paypal REST API: PayPal Payments

## How to use

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
    * [.checkPayment(ctx)](#RestPaypalGateway+checkPayment) ⇒ <code>promise</code>




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
   cancelUrl: 'http://localhost:3000/'
}))
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

<a name="RestPaypalGateway+checkPayment"></a>

### restPaypalGateway.checkPayment(ctx) ⇒ <code>promise</code>
Middleware to check paypal payment

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