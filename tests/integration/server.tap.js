'use strict'

var tap = require('tap')
var http = require('http')
var natives = require('../../')()
var segs = require('segfault-handler')

var RUN_TIME = 5 * 60 * 1000 // 5 minutes

segs.registerHandler('crash.log')

tap.test('server soak test', {timeout: RUN_TIME + 10000}, function(t) {
  natives.on('gc', function(data) {
    t.ok(data.type, 'should have a recognized type name')
  })

  t.comment('Running test server for ' + RUN_TIME + 'ms')
  var server = http.createServer(function(req, res) {
    res.write('ok')
    res.end()
  })

  server.on('close', function() {
    natives.unbind()
  })
  server.listen(8080)
  var port = server.address().port

  var keepSending = true
  setTimeout(sendRequest, 1000)
  setTimeout(function() {
    t.comment('stopping')
    keepSending = false
  }, RUN_TIME)

  function sendRequest() {
    http.get('http://localhost:' + port, function(res) {
      t.ok(res, 'should have a response object')
      t.equal(res.statusCode, 200, 'should have a successful response')

      if (keepSending) {
        setTimeout(sendRequest, 10)
      } else {
        server.close()
        t.end()
      }
    })
  }
})
