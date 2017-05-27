"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PGGateway = function () {
  function PGGateway() {
    _classCallCheck(this, PGGateway);
  }

  //TODO: Inject configured payment gateway - 2017-05-28


  _createClass(PGGateway, [{
    key: "use",
    value: function use() {}

    //TODO: add logic for deciding which payment method to use - 2017-05-28

  }, {
    key: "addDecisionLogic",
    value: function addDecisionLogic() {}

    //TODO: high level method to create transaction - 2017-05-28

  }, {
    key: "createTransaction",
    value: function createTransaction() {}
  }]);

  return PGGateway;
}();

exports.default = PGGateway;