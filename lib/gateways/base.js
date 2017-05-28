"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Base class for implementing payment method SDK
 */

var BaseGateway = function BaseGateway(params) {
  _classCallCheck(this, BaseGateway);

  this._name = params.name;
  this._instance = params._instance;
};

exports.default = BaseGateway;