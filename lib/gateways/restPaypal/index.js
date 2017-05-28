'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RestPaypalGateway = undefined;

var _base = require('../base');

var _base2 = _interopRequireDefault(_base);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var RestPaypalGateway = exports.RestPaypalGateway = function (_BaseGateway) {
  _inherits(RestPaypalGateway, _BaseGateway);

  function RestPaypalGateway(params) {
    _classCallCheck(this, RestPaypalGateway);

    return _possibleConstructorReturn(this, (RestPaypalGateway.__proto__ || Object.getPrototypeOf(RestPaypalGateway)).call(this, params));
  }

  return RestPaypalGateway;
}(_base2.default);