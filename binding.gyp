{
  "variables": {
    # Node.js >= 20 seems to have issues with this. Search
    # "'openssl_fips' is not defined while evaluating" for many results.
    "openssl_fips": 0,
    # Gate for the dev/CI-only `tests` target. Defaults to 0 so that the
    # default build (and, importantly, prebuildify) only ever builds the
    # shippable `native_metrics` target. The `native` npm script sets this to
    # 1 via `node-gyp ... -Dbuild_tests=1`.
    "build_tests%": 0
  },
  "targets": [{
    "target_name": "native_metrics",
    "sources": [
      "src/native_metrics.cpp",
      "src/GCBinder.hpp",
      "src/GCBinder.cpp",
      "src/LoopChecker.hpp",
      "src/LoopChecker.cpp",
      "src/Metric.hpp"
    ],
    "defines": [
      "NOMINMAX"
    ],
    "include_dirs": [
      "src",
      "<!(node -e \"require('nan')\")"
    ],
    "conditions": [
      ["OS == 'linux'", {
        "cflags_cc": [
          "-Wno-cast-function-type" # nan issue: https://github.com/nodejs/nan/issues/807
        ]
      }]
    ]
  }],
  "conditions": [
    # Only define the `tests` target when explicitly requested, so that
    # prebuildify never picks up the test binary as the shippable artifact.
    ["build_tests == 1", {
      "targets": [{
        # Dev/CI-only target. Not shipped: it is built with `node-gyp` (see the
        # `native` npm script), never by prebuildify, and is excluded from the
        # published package.
        "target_name": "tests",
        "sources": [
          # Test deps and setup
          "src/tests/gtest/gtest.h",
          "src/tests/gtest-all.cc",
          "src/tests/main.cpp",

          # Actual tests
          "src/tests/metrics_test.cpp"
        ],
        "defines": [
          "NOMINMAX"
        ],
        "include_dirs": [
          "src",
          "<!(node -e \"require('nan')\")"
        ],
        "conditions": [
          ["OS == 'linux'", {
            "cflags_cc": [
              "-Wno-cast-function-type" # nan issue: https://github.com/nodejs/nan/issues/807
            ]
          }]
        ]
      }]
    }]
  ]
}
