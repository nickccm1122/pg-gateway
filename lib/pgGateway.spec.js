'use strict';

var _pgGateway = require('./pgGateway');

var _pgGateway2 = _interopRequireDefault(_pgGateway);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('Class PGGateway', function () {
  it('should be of class', function () {
    expect(_pgGateway2.default).to.be.a('function');
  });

  it('should have default payment selection rule defined', function () {
    var pgGateway = new _pgGateway2.default();
    expect(pgGateway._selectionRule).to.be.defined;
    expect(pgGateway._selectionRule).to.be.a('function');
  });

  describe('use()', function () {
    var pgGateway = void 0;

    before(function () {
      pgGateway = new _pgGateway2.default();
    });
    it('should be a function', function () {
      expect(pgGateway.use).to.be.a('function');
    });
    it('should throw if no name is provide via argument or gateway', function () {
      expect(pgGateway.use, {}).to.throw(Error);
    });
  });
});