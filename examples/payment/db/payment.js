import client from './db'

/**
 * Data Modal of payment
 * 
 * @class payment
 */
class PaymentModel {
  constructor(params) {
    this.primaryKey = 'Payment'
    this.refPrefix = 'Pay-'
    this.defaultReferenceCodeLength = 6
    this.expire = 3600 // expire in 1 hour
  }

  /**
   * Generate Reference Code
   * 
   * @param {Number} length 
   * @param {String} prefix 
   * @returns {String}
   * 
   * @memberof PaymentModel
   */
  genKey(length, prefix) {
    const char = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']

    return [...Array(length)].reduce((acc) => {
      return acc + char[Math.round(Math.random() * (char.length - 1))]
    }, prefix)

  }

  /**
   * Save Approved/Settled payment into cache db
   * 
   * @param {String} gateway 
   * @param {Object} order 
   * @param {Object} response 
   * @returns {String} reference Id
   * 
   * @memberof PaymentModel
   */
  async save(gateway, order, response) {
    console.log('saving......')
    const flattenOrder = JSON.stringify(order)
    const resString = JSON.stringify(response)

    const refId = this.genKey(this.defaultReferenceCodeLength, this.refPrefix)
    const key = [this.primaryKey, refId].join('.')

    try {
      await client.hmsetAsync([key, 'order', flattenOrder, 'response', resString, 'gateway', gateway])
      await client.expireAsync(key, this.expire)
    } catch (error) {
      throw new Error(error)
    }

    console.log(`........done..${refId}`)
    return refId
  }

  /**
   * Get the cached Payment object from Cache
   * return payment object if found or false if not found
   * 
   * @param {String} refId 
   * 
   * @memberof PaymentModel
   */
  async getByRefId(refId) {
    const key = [this.primaryKey, refId].join('.')
    let parsedReturn
    try {
      const ret = await client.hgetallAsync(key)

      if (ret) {
        parsedReturn = Object.keys(ret).reduce((acc, key) => {
          switch (key) {
          case 'order':
          case 'response':
            return Object.assign(acc, {
              [key]: JSON.parse(ret[key]) })
          default:
            return Object.assign(acc, {
              [key]: ret[key] })
          }
        }, {})
      }

    } catch (error) {
      throw new Error(error)
    }

    return parsedReturn ? parsedReturn : false
  }
}

export const Payment = new PaymentModel()