var assert = require('assert-diff')
  , sinon = require('sinon')
  , mockClient = require('./lib/mock-xmlrpc-client')()
  , createCampaign = require('../lib/campaign')

describe('Campaign', function () {
  var campaign
    , spyClient

  beforeEach(function () {
    spyClient = sinon.spy(mockClient.methodCall)
    campaign = createCampaign(mockClient)
  })

  afterEach(function () {
    spyClient.reset()
  })

  describe('Create', function () {

    it('should return a newly created campaign on success', function (done) {
      var data =
          { ownerUserId: 'test-owner'
          , project: 'test-project'
          , name: 'Test Campaign'
          , description: 'A test campaign'
          }
        , expected =
          new campaign.Campaign(
            '1'
          , 'test-project'
          , 'Test Campaign'
          , 'A test campaign'
          , 'test-owner'
          , 'blue')

      campaign.create(data, function (err, created) {
        delete created.toString
        delete expected.toString
        assert.deepEqual(created, expected)
        done()
      })
    })

    it('should return an error on failure', function (done) {
      campaign.create(null, function (err, created) {
        assert.strictEqual(created, undefined)
        assert.equal(err.message, 'bad request')
        done()
      })
    })
  })
})
