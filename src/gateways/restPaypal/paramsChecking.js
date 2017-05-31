import joi from 'joi'

/**
 * Validate paypal Config Params
 * 
 * @export
 * @param {object} params - the input params pass to PaypalGateway.init()
 * @returns {object}
 */
export function validateConfigParams(params) {
  const envVarsSchema = joi.object().keys({
    isSandbox: joi.boolean().default(true),
    paypalClientId: joi.string().required(),
    paypalSecret: joi.string().required(),
    returnUrl: joi.string().required(),
    cancelUrl: joi.string().required()
  }).unknown()

  return joi.validate(params, envVarsSchema, { stripUnknown: true })
}