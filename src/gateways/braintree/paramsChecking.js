import joi from 'joi'

/**
 * Validate Braintree Config Params
 * 
 * @export
 * @param {object} params - the input params pass to BraintreeGateway.init()
 * @returns 
 */
export function validateConfigParams(params) {
  const envVarsSchema = joi.object().keys({
    isSandbox: joi.boolean().default(true),
    BRAINTREE_MERCHANT_ID: joi.string().required(),
    BRAINTREE_PUBLIC_KEY: joi.string().token().required(),
    BRAINTREE_PRIVATE_KEY: joi.string().token().required()
  }).unknown()

  return joi.validate(params, envVarsSchema, { stripUnknown: true })
}