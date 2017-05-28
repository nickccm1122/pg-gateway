'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BraintreeGateway = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _base = require('../base');

var _base2 = _interopRequireDefault(_base);

var _braintree = require('braintree');

var _braintree2 = _interopRequireDefault(_braintree);

var _paramsChecking = require('./paramsChecking');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var BraintreeGateway = exports.BraintreeGateway = function (_BaseGateway) {
  _inherits(BraintreeGateway, _BaseGateway);

  function BraintreeGateway(params) {
    _classCallCheck(this, BraintreeGateway);

    var _this = _possibleConstructorReturn(this, (BraintreeGateway.__proto__ || Object.getPrototypeOf(BraintreeGateway)).call(this, params));

    _this._braintree = params.braintree;
    return _this;
  }

  /**
   * single entry to create a well-configured braintree gateway
   * 
   * @static
   * 
   * @memberof BraintreeGateway
   */


  _createClass(BraintreeGateway, null, [{
    key: 'init',
    value: function init(params) {
      var _validateConfigParams = (0, _paramsChecking.validateConfigParams)(params),
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
        braintree: braintreeInstance
      });

      return newGateway;
    }
  }]);

  return BraintreeGateway;
}(_base2.default);