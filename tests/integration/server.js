'use strict'

var http = require('http')
var natives = require('../../')()
var segs = require('segfault-handler')

var RUN_TIME = 5 * 60 * 1000 // 5 minutes

segs.registerHandler('crash.log')

natives.on('gc', function(data) {
  if (!data.type) {
    throw new Error('Unknown type encountered: ' + data.typeId)
  }
})

console.log('Running test server for ' + RUN_TIME + 'ms')
var server = http.createServer(function(req, res) {
  res.write('ok')
  res.end()
})

server.on('close', function() {
  natives.unbind()
})
server.listen(8080)
var port = server.address().port

var reqCount = 0
var keepSending = true
setTimeout(sendRequest, 5000)
setTimeout(function() {
  console.log('stopping')
  keepSending = false
}, RUN_TIME)

function sendRequest() {
  http.get('http://localhost:' + port, function(res) {
    if (++reqCount % 100 === 0) {
      process.stdout.write('.')
    }

    if (!res || res.statusCode !== 200) {
      throw new Error('Bad response!?')
    }

    if (keepSending) {
      setTimeout(sendRequest, 10)
    } else {
      server.close()
    }
  })
}
