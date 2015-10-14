var assert = require('assert-diff')
  , sinon = require('sinon')
  , rewire = require('rewire')
  , MessageFocus = rewire('..')

function XmlrpcSpy() {
  this.methodCall = sinon.spy(function (method, params, cb) { cb() })
  this.createClient = sinon.spy(function () {
    return { methodCall: this.methodCall }
  })
}

describe('MessageFocus', function () {
  var xmlrpcSpy

  beforeEach(function () {
    xmlrpcSpy = new XmlrpcSpy() 
    MessageFocus.__set__('xmlrpc', xmlrpcSpy) 
  })

  describe('methodCall', function () {

    it('should setup an authed xmlrpc client', function (done) {
      var mf = new MessageFocus('account', 'user', 'password')
      mf.methodCall('test', null, function () {
        assert(xmlrpcSpy.createClient.calledOnce)
        assert.deepEqual(xmlrpcSpy.createClient.firstCall.args[0]
        , { url: 'https://app.adestra.com/api/xmlrpc'
          , basic_auth:
            { user: 'account.user'
            , pass: 'password'
            }
          })
        done() 
      })
    })

    it('the authed xmlrpc client should be memoized', function (done) {
      var mf = new MessageFocus('account', 'user', 'password')
      mf.methodCall('test', null, function () {
        mf.methodCall('test', null, function () {
          mf.methodCall('test', null, function () {
            assert(xmlrpcSpy.createClient.calledOnce)
            assert(xmlrpcSpy.methodCall.calledThrice)
            done() 
          })
        })
      })
    })
  })
})
