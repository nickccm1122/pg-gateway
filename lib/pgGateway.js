'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _logger = require('./logger');

var _logger2 = _interopRequireDefault(_logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @class PGGateway
 */
var PGGateway = function () {
  function PGGateway() {
    _classCallCheck(this, PGGateway);

    this._gateways = {};
    this._isSandbox = true;

    /**
     * Default action onPaymentInited, can be overrided using PGGateway.init method. This is also can be access thru ctx.pgGateway.onPaymentInited
     * @param {object} order Order
     * @param {object} response Response from 3th party gateway
     * @return {object|false}
     * @member PGGateway#onPaymentInited()
     */
    this.onPaymentInited = this._onPaymentInited.bind(this);
    /**
     * Default action onPaymentApproved, can be overrided using PGGateway.init method. This is also can be access thru ctx.pgGateway.onPaymentApproved
     * @param {string} gatewayName Gateway name
     * @param {object} order Order object
     * @param {object} response Response from 3th party gateway
     * @return {object|false}
     * @member PGGateway#onPaymentApproved()
     */
    this.onPaymentApproved = this._onPaymentApproved.bind(this);
    /**
     * Default action loadPaymentCreated, can be overrided using PGGateway.init method. This is also can be access thru ctx.pgGateway.loadPaymentCreated
     * @param {string} refId Reference Id
     * @return {object|false}
     * @member PGGateway#loadPaymentCreated()
     */
    this.loadPaymentCreated = this._loadPaymentCreated.bind(this);
    /**
     * Default action loadPaymentApproved, can be overrided using PGGateway.init method. This is also can be access thru ctx.pgGateway.loadPaymentApproved
     * @param {string} refId Reference Id
     * @param {string} username User Name
     * @return {object|false}
     * @member PGGateway#loadPaymentApproved()
     */
    this.loadPaymentApproved = this._loadPaymentApproved.bind(this);
  }

  /**
   * Add new configured payment gateway
   * 
   * @param {string} name Custom name that used to identify the gateway being added
   * @param {BaseGateway} gateway Payment gateway extends class BaseGateway
   * @returns {object} self
   * @member PGGateway#use()
   */


  _createClass(PGGateway, [{
    key: 'use',
    value: function use(name, gateway) {
      if (!gateway) {
        gateway = name;
        name = gateway._name;
      }
      if (!name) throw new Error('Gateway must have a name!');

      this._gateways[name] = gateway;
      this[name] = this._gateways[name]; // also create a reference as member prop)
      return this;
    }

    /**
     * Return a middleware to inject pgGateway into request's context
     * 
     * @param {object} options Options
     * @param {function} options.onPaymentInited Function that will be performed when payment is inited
     * @param {function} options.onPaymentApproved Function that will be performed when payment is approved( or confirmed by 3th party gateway)
     * @param {function} options.loadPaymentCreated Function to retrive data from database for payment created
     * @param {function} options.loadPaymentApproved Function to retrive data from database for payment approved
     * @member PGGateway#init()
     * @public
     * @return {function} middleware
     * 
     * @example 
     * import PgGateway from 'pg-gateway'
     * 
     * PgGateway.use(new BraintreeGateway({
     *  ...configs
     * }))
     * 
     * // To inject pgGateway into request's context
     * router.use(PgGateway.init({
     *  onPaymentApproved: (params) => {
     *    //...save data into db
     * },
     *  loadPaymentApproved: (refId, userName) => {
     *    //...retrive data from db
     * }
     * }))
     */

  }, {
    key: 'init',
    value: function init(options) {
      var _this = this;

      var _ref = options || {},
          onPaymentInited = _ref.onPaymentInited,
          onPaymentApproved = _ref.onPaymentApproved,
          loadPaymentCreated = _ref.loadPaymentCreated,
          loadPaymentApproved = _ref.loadPaymentApproved;

      if (onPaymentInited) {
        this.onPaymentInited = onPaymentInited;
      }

      if (onPaymentApproved) {
        this.onPaymentApproved = onPaymentApproved;
      }

      if (loadPaymentCreated) {
        this.loadPaymentCreated = loadPaymentCreated;
      }

      if (loadPaymentApproved) {
        this.loadPaymentApproved = loadPaymentApproved;
      }

      return function () {
        var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee(ctx, next) {
          return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  ctx.pgGateway = _this;
                  _context.next = 3;
                  return next();

                case 3:
                case 'end':
                  return _context.stop();
              }
            }
          }, _callee, _this);
        }));

        return function (_x, _x2) {
          return _ref2.apply(this, arguments);
        };
      }();
    }

    /**
     * Default action onPaymentInited
     * 
     * @param {any} params 
     * 
     * @member PGGateway#onPaymentInited
     * @private 
     * 
     */

  }, {
    key: '_onPaymentInited',
    value: function _onPaymentInited(params) {
      (0, _logger2.default)('PGGateway - onPaymentInited: %s', JSON.stringify(params));
      return false;
    }

    /**
     * Default action onPaymentApproved
     * 
     * @param {any} params 
     * 
     * @member PGGateway#onPaymentApproved
     * @private 
     */

  }, {
    key: '_onPaymentApproved',
    value: function _onPaymentApproved(params) {
      (0, _logger2.default)('PGGateway - onPaymentApproved: %s', JSON.stringify(params));
      return false;
    }

    /**
     * Default action loadPaymentCreated
     * 
     * @returns [object|false]
     * 
     * @member PGGateway#loadPaymentCreated
     * @private
     */

  }, {
    key: '_loadPaymentCreated',
    value: function _loadPaymentCreated(refId, userName) {
      return false;
    }

    /**
     * Default action loadPaymentApproved
     * 
     * @returns [object|false]
     * 
     * @member PGGateway#loadPaymentApproved
     * @private
     */

  }, {
    key: '_loadPaymentApproved',
    value: function _loadPaymentApproved() {
      return false;
    }
  }]);

  return PGGateway;
}();

exports.default = PGGateway;