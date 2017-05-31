import client from './db'

/** 
 * @class OrderModel
 */
class OrderModel {
  constructor(params) {
    this.primaryKey = 'Order'
    this.expire = 3600 // expire in 1 hour
  }

  /**
   * Save Approved/Settled payment into cache db
   * 
   * @param {String} gateway 
   * @param {Object} order 
   * @param {Object} response 
   * @returns {String} reference Id
   * 
   * @memberof OrderModel
   */
  async save(id, order) {
    console.log('saving......')
    const flattenOrder = JSON.stringify(order)

    const key = [this.primaryKey, id].join('.')

    try {
      await client.hmsetAsync([key, 'order', flattenOrder, 'status', 'pending_for_approval'])
      await client.expireAsync(key, this.expire)
    } catch (error) {
      throw new Error(error)
    }

    console.log(`........done..${key}`)
    return id
  }

  /**
   * Get the cached order object from Cache
   * return order object if found or false if not found
   * 
   * @param {String} id 
   * 
   * @memberof OrderModel
   */
  async getById(id) {
    console.log('getting......')
    const key = [this.primaryKey, id].join('.')
    console.log(key)
    let parsedReturn
    try {
      const ret = await client.hgetallAsync(key)
      console.log(ret)

      if (ret) {
        parsedReturn = Object.keys(ret).reduce((acc, key) => {
          switch (key) {
          case 'order':
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

export const Order = new OrderModel()
