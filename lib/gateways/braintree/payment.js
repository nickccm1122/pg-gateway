'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BraintreeGateway = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _base = require('../base');

var _base2 = _interopRequireDefault(_base);

var _braintree = require('braintree');

var _braintree2 = _interopRequireDefault(_braintree);

var _paramsChecking = require('./paramsChecking');

var _logger = require('../../logger');

var _logger2 = _interopRequireDefault(_logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * 
 * @class BraintreeGateway - Provide middleware to handle payments
 * @extends BaseGateway
 */
var BraintreeGateway = exports.BraintreeGateway = function (_BaseGateway) {
  _inherits(BraintreeGateway, _BaseGateway);

  function BraintreeGateway(params) {
    _classCallCheck(this, BraintreeGateway);

    var _this = _possibleConstructorReturn(this, (BraintreeGateway.__proto__ || Object.getPrototypeOf(BraintreeGateway)).call(this, params));

    _this.members = {
      createToken: _this.createToken.bind(_this),
      execute: _this.executePayment.bind(_this)
    };
    return _this;
  }

  /**
   * Single entry to create a well-configured braintree gateway
   * 
   * @param {object} options Options
   * @param {boolean} options.isSandbox 
   * @param {string} options.BRAINTREE_MERCHANT_ID 
   * @param {string} options.BRAINTREE_PUBLIC_KEY 
   * @param {string} options.BRAINTREE_PRIVATE_KEY 
   * @method BraintreeGateway#init
   * @static 
   * @return {object} new BraintreeGateway
   * @example 
   * import PGGateway from 'pg-gateway'
   * import { BraintreeGateway } from '..path'
   * 
   * PGGateway.use(BraintreeGateway.init({
   *    isSandbox: true,
   *    BRAINTREE_MERCHANT_ID: 'cx48wn2djqx2m4db',
   *    BRAINTREE_PUBLIC_KEY: '3zw4pzcmg46jbt77',
   *    BRAINTREE_PRIVATE_KEY: '01418a6cb6f2ab403dd8e61620934c96'
   * }))
   * 
   * // this instance will expose 2 function
   * // - createToken: function to create client token
   * // - execute: middleware to process payment
   * //
   * // you may access thru 
   * // - pgGateway.BRAINTREE.member.createToken or 
   * // - pgGateway.BRAINTREE.member.execute
   * 
   */


  _createClass(BraintreeGateway, [{
    key: 'createToken',


    /**
     * Middleware to create braintree client token
     * 
     * @return {object} Response from braintree.clientToken.generate()
     * @method BraintreeGateway#createToken
     */
    value: function () {
      var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return this._instance.clientToken.generate({});

              case 2:
                return _context.abrupt('return', _context.sent);

              case 3:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function createToken() {
        return _ref.apply(this, arguments);
      }

      return createToken;
    }()

    /**
     * Middleware to execute payment after receiving payment nonce from client
     * 
     * @param {Object} ctx 
     * @param {Function} next 
     * 
     * @method BraintreeGateway#executePayment
     */

  }, {
    key: 'executePayment',
    value: function () {
      var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(ctx, next) {
        var _ctx$request$body, nonce, order, response, result;

        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                if (ctx.pgGateway) {
                  _context2.next = 2;
                  break;
                }

                throw new Error('You have no pgGateway initialized.');

              case 2:
                _ctx$request$body = ctx.request.body, nonce = _ctx$request$body.nonce, order = _ctx$request$body.order;


                (0, _logger2.default)(nonce);
                (0, _logger2.default)(order);
                _context2.next = 7;
                return this._instance.transaction.sale({
                  amount: order.price,
                  paymentMethodNonce: nonce,
                  options: {
                    submitForSettlement: true
                  }
                });

              case 7:
                response = _context2.sent;

                if (!(response && response.success)) {
                  _context2.next = 14;
                  break;
                }

                (0, _logger2.default)(response);
                _context2.next = 12;
                return this.saveToDB(ctx, response);

              case 12:
                result = _context2.sent;


                ctx.body = result ? {
                  refCode: result,
                  message: 'Please use the refCode and username to check your payment'
                } : {
                  success: true
                };

              case 14:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function executePayment(_x, _x2) {
        return _ref2.apply(this, arguments);
      }

      return executePayment;
    }()

    /**
     * Save approved payment into cache
     * 
     * @param {object} ctx 
     * @param {object} resFromBraintree 
     * @returns {object} object containing refId, username
     * 
     * @member BraintreeGateway#saveToDB
     * @private
     */

  }, {
    key: 'saveToDB',
    value: function () {
      var _ref3 = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(ctx, resFromBraintree) {
        var order, result;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                order = ctx.request.body.order;
                result = void 0;

                if (!(ctx.pgGateway && ctx.pgGateway.onPaymentApproved)) {
                  _context3.next = 6;
                  break;
                }

                _context3.next = 5;
                return ctx.pgGateway.onPaymentApproved(this._name, _extends({}, order), resFromBraintree.transaction);

              case 5:
                result = _context3.sent;

              case 6:

                (0, _logger2.default)(result);

                return _context3.abrupt('return', result);

              case 8:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function saveToDB(_x3, _x4) {
        return _ref3.apply(this, arguments);
      }

      return saveToDB;
    }()
  }], [{
    key: 'init',
    value: function init(options) {
      var _validateConfigParams = (0, _paramsChecking.validateConfigParams)(options),
          error = _validateConfigParams.error,
          config = _validateConfigParams.value;

      if (error) {
        throw new Error('Config validation error: ' + error.message);
      }

      var braintreeInstance = _braintree2.default.connect({
        environment: config.isSandbox ? _braintree2.default.Environment.Sandbox : _braintree2.default.Environment.Production,
        merchantId: config.BRAINTREE_MERCHANT_ID,
        publicKey: config.BRAINTREE_PUBLIC_KEY,
        privateKey: config.BRAINTREE_PRIVATE_KEY
      });

      var newGateway = new BraintreeGateway({
        instance: braintreeInstance,
        name: 'BRAINTREE'
      });

      return newGateway;
    }
  }]);

  return BraintreeGateway;
}(_base2.default);