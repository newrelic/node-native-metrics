/*
 * Copyright 2022 New Relic Corporation. All rights reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict'

const http = require('http')
const proxyServer = require('@newrelic/proxy')

async function startServer() {
  const server = proxyServer(http.createServer())
  const port = await new Promise((resolve) => {
    server.listen(() => {
      const listenerPort = server.address().port
      // eslint-disable-next-line no-console
      console.log(`Started proxy on port: ${listenerPort}`)
      resolve(listenerPort)
    })
  })
  process.send && process.send({ msg: 'STARTED', port })
}

startServer().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err)
  // eslint-disable-next-line no-process-exit
  process.exit(1)
})
