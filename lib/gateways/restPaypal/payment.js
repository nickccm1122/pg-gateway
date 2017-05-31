'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RestPaypalGateway = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _base = require('../base');

var _base2 = _interopRequireDefault(_base);

var _paypalRestSdk = require('paypal-rest-sdk');

var _paypalRestSdk2 = _interopRequireDefault(_paypalRestSdk);

var _paramsChecking = require('./paramsChecking');

var _logger = require('../../logger');

var _logger2 = _interopRequireDefault(_logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * @class RestPaypalGateway - Provide middleware to handle payments
 * @extends BaseGateway
 */
var RestPaypalGateway = exports.RestPaypalGateway = function (_BaseGateway) {
  _inherits(RestPaypalGateway, _BaseGateway);

  function RestPaypalGateway(params) {
    _classCallCheck(this, RestPaypalGateway);

    var _this = _possibleConstructorReturn(this, (RestPaypalGateway.__proto__ || Object.getPrototypeOf(RestPaypalGateway)).call(this, params));

    _this._RETURN_URL = params.returnUrl;
    _this._CANCEL_URL = params.cancelUrl;
    _this._onPaymentCreated = params.onPaymentCreated;
    _this._onPaymentExecuted = params.onPaymentExecuted;

    /**
     * Middlewares supported by this gateway
     */
    _this.members = {
      create: _this.createPayment.bind(_this),
      execute: _this.executePayment.bind(_this)
    };
    return _this;
  }

  /**
   * Single entry to create a well-configured braintree gateway
   * 
   * @param {object} options Options
   * @param {boolean} options.isSandbox 
   * @param {string} options.paypalClientId 
   * @param {string} options.paypalSecret 
   * @param {string} options.returnUrl
   * @param {string} options.cancelUrl 
   *
   * @return {object} new RestPaypalGateway
   * @static 
   * @method RestPaypalGateway#init
   * 
   * @example 
   * 
   * import PGGateway from 'pg-gateway'
   * import { RestPaypalGateway } from '..path'
   * 
   * PGGateway.use(RestPaypalGateway.init({
   *    isSandbox: true,
   *    paypalClientId: 'AbVGZ5Tc_2HKOYaIpiXPm_JHXbMECy7J7WnTyP2y4n3LsHfjwHvNE9XPHVPVHuF2qv8fVKm5qJ9U3txS',
   *    paypalSecret: 'EOBxs78isIeg7myFaReh0rw-eTC_y47TETI5vT5-AfMB6i1FtmwopA-OY_RV6bJTlU3yMU34IbzbI9Xv',
   *    returnUrl: 'http://localhost:3000/paypal/execute',
   *    cancelUrl: 'http://localhost:3000/',
   *    onPaymentCreated: (id, order) => { //cache the order }
   *    onPaymentExecuted: (key) => { //retrive the cached order}
   * }))
   * 
   * // this instance will expose 2 functions
   * // - create: function to create payment and send to paypal
   * // - execute: middleware to process payment
   * //
   * // you may access thru 
   * // - pgGateway.BRAINTREE.member.create or 
   * // - pgGateway.BRAINTREE.member.execute 
   */


  _createClass(RestPaypalGateway, [{
    key: 'createPayment',


    /**
     * Middleware to create paypal payment
     * 
     * @param {any} ctx 
     * @param {any} next 
     * @return {promise} 
     * @method RestPaypalGateway#createPayment
     */
    value: function () {
      var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(ctx, next) {
        var _this2 = this;

        var order, createPaymentJson, response, redirectUrl;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (ctx.pgGateway) {
                  _context.next = 2;
                  break;
                }

                throw new Error('You have no pgGateway initialized.');

              case 2:

                (0, _logger2.default)('Incoming request body: ' + JSON.stringify(ctx.request.body));

                order = ctx.request.body.order;


                if (!order && order.price) {
                  ctx.throw(400, 'You have no amount values');
                }

                createPaymentJson = {
                  'intent': 'sale',
                  'payer': {
                    'payment_method': 'paypal'
                  },
                  'redirect_urls': {
                    'return_url': this._RETURN_URL,
                    'cancel_url': this._CANCEL_URL
                  },
                  'transactions': [{
                    'amount': {
                      'total': order.price,
                      'currency': order.currency
                    }
                  }]
                };
                _context.prev = 6;
                _context.next = 9;
                return new Promise(function (resolve, reject) {
                  _this2._instance.payment.create(createPaymentJson, function (error, payment) {
                    if (error) {
                      reject(error);
                    } else {
                      resolve(payment);
                    }
                  });
                });

              case 9:
                response = _context.sent;


                /**
                 * cache the order
                 */
                (0, _logger2.default)(this._onPaymentCreated);
                this._onPaymentCreated(response.id, order);

                // redirect the user to paypal payment auth
                redirectUrl = response.links.find(function (link) {
                  return link.rel === 'approval_url';
                }).href;

                // Paypal auth redirect
                // ctx.redirect(redirectLink)

                ctx.body = {
                  redirectUrl: redirectUrl
                };

                _context.next = 19;
                break;

              case 16:
                _context.prev = 16;
                _context.t0 = _context['catch'](6);

                ctx.throw(500, 'Cannot initialize payment with paypal.');

              case 19:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this, [[6, 16]]);
      }));

      function createPayment(_x, _x2) {
        return _ref.apply(this, arguments);
      }

      return createPayment;
    }()

    /**
     * Middleware to execute paypal payment
     * 
     * @param {any} ctx 
     * @return {promise} 
     * @method RestPaypalGateway#executePayment
     */

  }, {
    key: 'executePayment',
    value: function () {
      var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(ctx) {
        var _ctx$query, paymentId, PayerID, paymentObj, approvedPayment, order, result;

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

                // ?paymentId=PAY-xxxxxxx&
                // token=EC-xxxxxxxx&
                // PayerID=xxxxxxx
                _ctx$query = ctx.query, paymentId = _ctx$query.paymentId, PayerID = _ctx$query.PayerID;
                paymentObj = void 0, approvedPayment = void 0;

                // 1. execute

                if (paymentObj) {
                  _context2.next = 8;
                  break;
                }

                _context2.next = 7;
                return new Promise(function (resolve, reject) {
                  _paypalRestSdk2.default.payment.execute(paymentId, { payer_id: PayerID }, function (error, payment) {
                    if (error) {
                      reject(error);
                    } else {
                      resolve(payment);
                    }
                  });
                });

              case 7:
                approvedPayment = _context2.sent;

              case 8:
                _context2.next = 10;
                return this._onPaymentExecuted(approvedPayment.id);

              case 10:
                order = _context2.sent;


                (0, _logger2.default)('what is the order??...');
                (0, _logger2.default)(order);
                // 3. save cache

                if (!(approvedPayment && approvedPayment.state === 'approved')) {
                  _context2.next = 20;
                  break;
                }

                (0, _logger2.default)(approvedPayment);
                (0, _logger2.default)('saveToDB...');
                _context2.next = 18;
                return this.saveToDB(ctx, approvedPayment, order);

              case 18:
                result = _context2.sent;


                ctx.body = result ? { refCode: result, message: 'Please use the refCode and username to check your payment, Go to http://localhost:3000/check-payment' } : {
                  success: true
                };

              case 20:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function executePayment(_x3) {
        return _ref2.apply(this, arguments);
      }

      return executePayment;
    }()

    /**
     * Save approved payment into cache
     * 
     * @param {object} ctx 
     * @param {object} resFromBraintree 
     * @param {object} order order from cache
     * @returns {object} object containing refId, username
     * 
     * @member RestPaypalGateway#saveToDB
     * @private
     */

  }, {
    key: 'saveToDB',
    value: function () {
      var _ref3 = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(ctx, approvedPayment, order) {
        var result;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                result = void 0;

                (0, _logger2.default)('OMG');
                (0, _logger2.default)(order);

                if (!(ctx.pgGateway && ctx.pgGateway.onPaymentApproved)) {
                  _context3.next = 7;
                  break;
                }

                _context3.next = 6;
                return ctx.pgGateway.onPaymentApproved(this._name, _extends({}, order), approvedPayment);

              case 6:
                result = _context3.sent;

              case 7:

                (0, _logger2.default)(result);

                return _context3.abrupt('return', result);

              case 9:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function saveToDB(_x4, _x5, _x6) {
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

      _paypalRestSdk2.default.configure({
        'mode': config.isSandbox ? 'sandbox' : 'live', //sandbox or live
        'client_id': config.paypalClientId,
        'client_secret': config.paypalSecret,
        'headers': {
          'custom': 'header'
        }
      });

      var newGateway = new RestPaypalGateway({
        instance: _paypalRestSdk2.default,
        name: 'REST_PAYPAL',
        returnUrl: config.returnUrl,
        cancelUrl: config.cancelUrl,
        onPaymentCreated: config.onPaymentCreated,
        onPaymentExecuted: config.onPaymentExecuted
      });

      return newGateway;
    }
  }]);

  return RestPaypalGateway;
}(_base2.default);