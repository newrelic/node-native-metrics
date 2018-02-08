
# Native Metrics for New Relic Node Agent

This module provides hooks into the native layer of Node to provide metrics for
the [New Relic Node Agent][npm-newrelic]. It gathers information that isn't
available at the JS layer about the V8 virtual machine and the process health.
It comes packaged with the New Relic Agent v2, and there is nothing that needs
to be done. For Agent v1 you need only to install the module alongside
[`newrelic`][npm-newrelic].

## Installation

`npm install --save @newrelic/native-metrics`

Note that this is a native module and thus must be compiled to function.
Pre-built binaries are provided for Linux servers running supported versions of
Node. If you are not using Linux or not using a supported version of Node, you
will need to have a compiler installed on the machine where this is to be
deployed. See [node-gyp](https://www.npmjs.com/package/node-gyp#installation)
for more information on compiling native addons.

If you prepare and package deployments on one machine and install them on
another, the two machines must have the same operating system and architecture.
If they are not, you will need to re-build the native module after deploying in
order to get the correct binaries.

During installation, the module will first attempt build from source on the
target machine. If that fails, it will attempt to download a pre-built binary
for your system. You can disable the download attempt by passing the flag
`--no-download` during installation.

```sh
$ npm install @newrelic/native-metrics --no-download
```

## Usage

```js
var getMetricEmitter = require('@newrelic/native-metrics')

var emitter = getMetricEmitter()
if (emitter.gcEnabled) {
  emitter.on('gc', (gc) => console.log(gc.type + ': ' + gc.duration))
}
if (emitter.usageEnabled) {
  emitter.on('usage', (usage) => console.log(usage))
}
if (emitter.loopEnabled) {
  setInterval(() => {
    var loopMetrics = emitter.getLoopMetrics()
    console.log("Loop time:", loopMetrics.loop)
    console.log("IO wait time:", loopMetrics.ioWait)
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

## License

The New Relic native metrics module is free-to-use, proprietary software. Please
see the full license (found in [LICENSE](LICENSE)) for details on its license
and the licenses of its dependencies.

[npm-newrelic]: https://www.npmjs.com/package/newrelic
