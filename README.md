<a href="https://opensource.newrelic.com/oss-category/#community-plus"><picture><source media="(prefers-color-scheme: dark)" srcset="https://github.com/newrelic/opensource-website/raw/main/src/images/categories/dark/Community_Plus.png"><source media="(prefers-color-scheme: light)" srcset="https://github.com/newrelic/opensource-website/raw/main/src/images/categories/Community_Plus.png"><img alt="New Relic Open Source community plus project banner." src="https://github.com/newrelic/opensource-website/raw/main/src/images/categories/Community_Plus.png"></picture></a>

# Native Metrics for New Relic Node.js Agent

[![npm status badge][1]][2] [![native-metrics CI][ci-badge]][ci-link] [![codecov][3]][4]

This module provides hooks into the native layer of Node.js to provide metrics for
the [New Relic Node.js Agent][npm-newrelic]. It gathers information that isn't
available at the JS layer about the V8 virtual machine and the process health.
It comes packaged with the New Relic Agent since v2, and there is nothing that
needs to be done. For Agent v1 you need only to install the module alongside
[`newrelic`][npm-newrelic].

## Installation and Getting Started

Typically, most users use the version auto-installed by the agent.

In some cases, installing a specific version is ideal. For example, new features or major changes might be released via a major version update to this module, prior to inclusion in the main New Relic Node.js agent.

```
$ npm install --save @newrelic/native-metrics
```

Note that this is a native module and thus must be compiled to function.
Pre-built binaries are included in the package for the following platforms, across all LTS versions of Node.js:

+ Linux/amd64
+ Linux/arm64
+ macOS/arm64
+ Windows/x64
+ Windows/x86

If your system does not match the above matrix, you will need to have a compiler installed on the machine where this is to be
deployed. See [node-gyp](https://www.npmjs.com/package/node-gyp#installation)
for more information on compiling native addons.

If you prepare and package deployments on one machine and install them on
another, the two machines must have the same operating system and architecture.
If they are not, you will need to re-build the native module after deploying in
order to get the correct binaries.

During installation, the module will first attempt to locate a prebuilt binary for the target machine within its included list of prebuilt binaries. If that fails, it will attempt a standard [node-gyp](https://www.npmjs.com/package/node-gyp#installation) build. If you do not want to use prebuilt binary, or know that it will need to be built, you can force a build:

```sh
$ npm install @newrelic/native-metrics --build-from-source
```

For more information, please see the agent [installation guide][install-node] and [compatibility and requirements][compatibility].

### Musl Libc Systems

As noted above, this module ships pre-built binaries for most standard systems,
i.e. systems based on the [GNU C Library](https://en.wikipedia.org/wiki/Glibc).
As of August 2024, Node.js does not provide "official" releases that are based
on [musl libc](https://en.wikipedia.org/wiki/Musl); such builds are only
available via the [unofficial builds](https://github.com/nodejs/unofficial-builds)
project. Therefore, if deploying to musl based systems, e.g. Alpine Linux, you
must provide a [node-gyp](https://github.com/nodejs/node-gyp) compatible build
environment.

As an example, to install and use this module on an Alpine Linux based Docker
image, we can utilize the [multi-stage build](https://docs.docker.com/build/building/multi-stage/)
pattern to build a compatible image:

**package.json**:
```json
{
  "dependencies": {
    "@newrelic/native-metrics": "^11.0.0"
  }
}
```

**index.js**:
```js
'use strict'

const metrics = require('@newrelic/native-metrics')
console.log("gcEnabled:", metrics().gcEnabled)
```

**Dockerfile**:
```Dockerfile
FROM node:20-alpine AS builder

WORKDIR /app
COPY index.js package.json .

RUN apk add g++ make py3-pip
RUN npm install --production

FROM node:20-alpine
COPY --from=builder app/ /app/
WORKDIR /app
CMD node index.js
```

With those files in place, we can build and run the image:

```sh
$ docker build --tag demo .
$ docker run --rm -it demo
gcEnabled: true
```

## Usage

```js
var getMetricEmitter = require('@newrelic/native-metrics')

var emitter = getMetricEmitter()
if (emitter.gcEnabled) {
  setInterval(() => {
    var gcMetrics = emitter.getGCMetrics()
    for (var type in gcMetrics) {
      console.log('GC type name:', type)
      console.log('GC type id:', gcMetrics[type].typeId)
      console.log('GC metrics:', gcMetrics[type].metrics)
    }
  }, 1000)
}
if (emitter.usageEnabled) {
  emitter.on('usage', (usage) => console.log(usage))
}
if (emitter.loopEnabled) {
  setInterval(() => {
    var loopMetrics = emitter.getLoopMetrics()
    console.log('Total time:', loopMetrics.usage.total)
    console.log('Min time:', loopMetrics.usage.min)
    console.log('Max time:', loopMetrics.usage.max)
    console.log('Sum of squares:', loopMetrics.usage.sumOfSquares)
    console.log('Count:', loopMetrics.usage.count)
  }, 1000)
}
```

The metric emitter keeps a referenced timer running for its periodic sampling
events. For a graceful shutdown of the process call `NativeMetricEmitter#unbind`.

```js
getMetricEmitter().unbind() // Process will now close gracefully.
```

If you would like to change the period of the sampling, simply unbind and then
call `NativeMetricEmitter#bind` with the new period.

```js
var emitter = getMetricEmitter({timeout: 15000})
emitter.unbind()
emitter.bind(10000) // Samples will now fire once every 10 seconds.
```

## Testing

This module includes a list of unit and functional tests.  To run these tests, use the following command

    $ npm run test

You may also run individual test suites with the following commands

    $ npm run unit
    $ npm run integration

## Support

Should you need assistance with New Relic products, you are in good hands with several support channels.

If the issue has been confirmed as a bug or is a feature request, please file a GitHub issue.

**Support Channels**

* [New Relic Documentation](https://docs.newrelic.com/docs/agents/nodejs-agent/getting-started/introduction-new-relic-nodejs): Comprehensive guidance for using our platform
* [New Relic Community](https://forum.newrelic.com/): The best place to engage in troubleshooting questions
* [New Relic Developer](https://developer.newrelic.com/): Resources for building a custom observability applications
* [New Relic University](https://learn.newrelic.com/): A range of online training for New Relic users of every level
* [New Relic Technical Support](https://support.newrelic.com/) 24/7/365 ticketed support. Read more about our [Technical Support Offerings](https://docs.newrelic.com/docs/licenses/license-information/general-usage-licenses/support-plan).

## Privacy

At New Relic we take your privacy and the security of your information seriously, and are committed to protecting your information. We must emphasize the importance of not sharing personal data in public forums, and ask all users to scrub logs and diagnostic information for sensitive information, whether personal, proprietary, or otherwise.

We define "Personal Data" as any information relating to an identified or identifiable individual, including, for example, your name, phone number, post code or zip code, Device ID, IP address and email address.

Please review [New Relic’s General Data Privacy Notice](https://newrelic.com/termsandconditions/privacy) for more information.

## Roadmap
See our [roadmap](https://github.com/newrelic/node-newrelic/blob/main/ROADMAP_Node.md), to learn more about our product vision, understand our plans, and provide us valuable feedback.

## Contribute

We encourage your contributions to improve Native Metrics for the New Relic Node.js Agent! Keep in mind when you submit your pull request, you'll need to sign the CLA via the click-through using CLA-Assistant. You only have to sign the CLA one time per project.

If you have any questions, or to execute our corporate CLA, required if your contribution is on behalf of a company, please drop us an email at opensource@newrelic.com.

To [all contributors](https://github.com/newrelic/node-native-metrics/graphs/contributors), we thank you! Without your contribution, this project would not be what it is today.

If you would like to contribute to this project, please review [these guidelines](https://github.com/newrelic/node-native-metrics/blob/main/CONTRIBUTING.md).

**A note about vulnerabilities**

As noted in our [security policy](https://github.com/newrelic/node-native-metrics/security/policy), New Relic is committed to the privacy and security of our customers and their data. We believe that providing coordinated disclosure by security researchers and engaging with the security community are important means to achieve our security goals.

If you believe you have found a security vulnerability in this project or any of New Relic's products or websites, we welcome and greatly appreciate you reporting it to New Relic through [HackerOne](https://hackerone.com/newrelic).

## License
The Native Metrics for New Relic Node.js Agent package is licensed under the [Apache 2.0](http://apache.org/licenses/LICENSE-2.0.txt) License.

[ci-badge]: https://github.com/newrelic/node-native-metrics/workflows/native-metrics%20CI/badge.svg
[ci-link]: https://github.com/newrelic/node-native-metrics/actions?query=workflow%3A%22native-metrics+CI%22
[npm-newrelic]: https://www.npmjs.com/package/newrelic
[install-node]: https://docs.newrelic.com/docs/agents/nodejs-agent/installation-configuration/install-nodejs-agent
[compatibility]: https://docs.newrelic.com/docs/agents/nodejs-agent/getting-started/compatibility-requirements-nodejs-agent
[1]: https://img.shields.io/npm/v/@newrelic/native-metrics.svg
[2]: https://www.npmjs.com/package/@newrelic/native-metrics
[3]: https://codecov.io/gh/newrelic/node-native-metrics/branch/main/graph/badge.svg
[4]: https://codecov.io/gh/newrelic/node-native-metrics
