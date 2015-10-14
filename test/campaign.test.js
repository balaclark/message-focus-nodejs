var assert = require('assert-diff')
  , sinon = require('sinon')
  , mockClient = require('./lib/mock-xmlrpc-client')()
  , createCampaign = require('../lib/campaign')

describe('Campaign', function () {
  var campaign

  beforeEach(function () {
    campaign = createCampaign(mockClient)
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

  describe('Create', function () {

    beforeEach(function () {
      sinon.spy(mockClient, 'methodCall')
    })

    afterEach(function () {
      mockClient.methodCall.restore()
    })

    it('should return true on success', function (done) {
      var data =
          { id: '1'
          , ownerUserId: 'test-owner'
          , project: 'test-project'
          , name: 'Test Campaign'
          , description: 'A test campaign'
          }
      campaign.update(data, function (err, created) {
        assert.strictEqual(created, true)
        done()
      })
    })

    it('should correctly call the api', function (done) {
      var data =
          { id: '1'
          , ownerUserId: 'test-owner'
          , project: 'test-project'
          , name: 'Test Campaign'
          , description: 'A test campaign'
          }
        , expected =
          { name: 'Test Campaign'
          , description: 'A test campaign'
          , owner_user_id: 'test-owner'
          , project_id: 'test-project'
          }
      campaign.update(data, function (err) {
        assert.equal(mockClient.methodCall.firstCall.args[0], 'campaign.update')
        assert.deepEqual(mockClient.methodCall.firstCall.args[1], [ 1, expected ])
        done()
      })
    })

    it('should require a campaign id', function (done) {
      campaign.update({}, function (err, created) {
        assert.strictEqual(created, undefined)
        assert.equal(err.message, 'The campaign has no ID')
        done()
      })
    })

  })

})
