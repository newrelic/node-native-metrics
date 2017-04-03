
# Native Metrics for New Relic Node Agent

This module provides hooks into the native layer of Node to provide metrics for
the [New Relic Node Agent][npm-newrelic]. It gathers
information that isn't available at the JS layer about the V8 virtual machine
and the process health. It comes packaged with the New Relic Agent v2, and there
is nothing that needs to be done. For Agent v1 you need only to install the
module alongside [`newrelic`][npm-newrelic].

## Installation

`npm install @newrelic/native-metrics`

Note that this is a native module and thus must be compiled to function. You
will need to have a compiler installed on the machine where this is to be
deployed. See [node-gyp](https://www.npmjs.com/package/node-gyp#installation)
for more information on compiling native addons.

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
