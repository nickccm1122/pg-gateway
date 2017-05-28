/**
 * Base class for implementing payment method SDK
 */

export default class BaseGateway {
  constructor(params) {
    this._name = params.name
    this._instance = params.instance
    
  }
}