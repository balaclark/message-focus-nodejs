module.exports = mockClient

var methods =
    { 'campaign.create': mockCreate
    }

function mockClient() {
  return { methodCall: methodCall }
}

function methodCall(method, data, cb) {
  methods[method].call(null, data, cb)
}

function mockCreate(data, cb) {
  if (!data || !data[0].project_id) return cb(new Error('bad request'))
  var res =
      { id: '1'
      , project_id: data[0].project_id
      , name: data[0].name
      , description: data[0].description
      , owner_user_id: data[0].owner_user_id
      , colour: 'blue'
      }
  cb(null, res)
}
