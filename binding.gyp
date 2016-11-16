{
  "targets": [{
    "target_name": "<(module_name)",
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
  }, {
    "target_name": "action_after_build",
    "type": "none",
    "dependencies": [ "<(module_name)" ],
    "copies": [
      {
        "files": [ "<(PRODUCT_DIR)/<(module_name).node" ],
        "destination": "<(module_path)"
      }
    ]
  }]
}
