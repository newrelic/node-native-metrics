/*
 * Copyright 2020 New Relic Corporation. All rights reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict'

// eslint-disable-next-line node/no-missing-require
const nativeTests = require('../../build/Release/tests')
// eslint-disable-next-line no-process-exit
process.exit(nativeTests.test())
