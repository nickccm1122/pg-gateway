'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _classifyPayment = require('./helpers/classifyPayment');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @export
 * @class PGGateway
 */
var PGGateway = function () {
  function PGGateway() {
    _classCallCheck(this, PGGateway);

    this._gateways = {};
    this._selectionRule = _classifyPayment.classifyPayment;
    this._isSandbox = true;
  }

  /**
   * Add configured payment gateway
   * 
   * @param {string} name - the payment that name will be identified by this Object
   * @param {BaseGateway} gateway - Payment gateway 
   * @returns {object} - The object itself
   * 
   * @memberof PGGateway
   */


  _createClass(PGGateway, [{
    key: 'use',
    value: function use(name, gateway) {
      if (!gateway) {
        gateway = name;
        name = gateway.name;
      }
      if (!name) throw new Error('Gateway must have a name!');

      this._gateways[name] = gateway;
      this[name] = this._gateways[name]; // also create a reference as member prop
      return this;
    }

    /**
     * Add logic to decide which payment to use.
     * There is a default logic if no input is provided.
     * 
     * The provided method will have an object with currency and cardType as input.
     * 
     * The provided method must return a object with a name of the selected Payment
     * 
     * @example 
     * addDeaddDecisionLogic(({currency, cardType}) => {
     *  ...logic...
     *  return {
     *    selectedPayment: 'BRAINTREE' // your defined name of payment or default.
     *    isValid: true   // To indicate the payment can be keep processing
     *    reason: null    // Optional. set to some value if the payment can't be processed.
     *  }
     * })
     * 
     * @memberof PGGateway
     */

  }, {
    key: 'addDecisionRule',
    value: function addDecisionRule(inputMethod) {
      this._selectionRule = inputMethod;
    }

    /**
     * high level method to create transaction
     * 
     * @memberof PGGateway
     */

  }, {
    key: 'createTransaction',
    value: function createTransaction() {}
  }]);

  return PGGateway;
}();

exports.default = PGGateway;