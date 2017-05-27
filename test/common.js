/**
 * This is where we define global variable for testing purpose(Mocha + chan).
 * This file will be "required" in the mocha test config file: mocha.opts
 */
import chai, { expect } from 'chai'
import chaiAsPromised from 'chai-as-promised'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'

global.chai = chai
global.expect = expect
global.sinon = sinon
chai.use(chaiAsPromised)
chai.use(sinonChai)

