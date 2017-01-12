{
  "targets": [{
    "target_name": "native_metrics",
    "sources": [
      "src/native_metrics.cpp",
      "src/GCBinder.hpp",
      "src/GCBinder.cpp",
      "src/RUsageMeter.hpp",
      "src/RUsageMeter.cpp"
    ],
    "include_dirs": [
      "src",
      "<!(node -e \"require('nan')\")"
    ]
  }]
}
