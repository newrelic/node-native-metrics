{
  "targets": [{
    "target_name": "native_metrics",
    "sources": [
      "src/native_metrics.cpp",
      "src/GCBinder.hpp",
      "src/GCBinder.cpp",
      "src/LoopChecker.hpp",
      "src/LoopChecker.cpp",
      "src/Metric.hpp",
      "src/RUsageMeter.hpp",
      "src/RUsageMeter.cpp"
    ],
    "defines": [
      "NOMINMAX"
    ],
    "include_dirs": [
      "src",
      "<!(node -e \"require('nan')\")"
    ]
  }]
}
