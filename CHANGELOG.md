### v11.0.0 (2024-07-31)
#### ⚠ BREAKING CHANGES

* Removed support for Node.js 16 (#273)

#### Features

* Removed support for Node.js 16 ([#273](https://github.com/newrelic/node-native-metrics/issues/273)) ([#274](https://github.com/newrelic/node-native-metrics/pull/274)) ([9f2d5c3](https://github.com/newrelic/node-native-metrics/commit/9f2d5c3dca1e4d3effcef2531d027d13bec39c0c))

#### Miscellaneous chores

* Updated CI to use native arm64 runner ([#264](https://github.com/newrelic/node-native-metrics/pull/264)) ([de17116](https://github.com/newrelic/node-native-metrics/commit/de171164cdb63a62b7c59754d0a412de635eb39b))

### v10.2.0 (2024-06-28)

#### Features

* Added support for Node 22.

#### Miscellaneous chores

* Added Node 22 to CI ([#250](https://github.com/newrelic/node-native-metrics/pull/250)) ([523426f](https://github.com/newrelic/node-native-metrics/commit/523426fa70cecbf99820c04e0495a7d4f6f62d26))
* **deps-dev:** bump braces from 3.0.2 to 3.0.3 ([#257](https://github.com/newrelic/node-native-metrics/pull/257)) ([38b36a6](https://github.com/newrelic/node-native-metrics/commit/38b36a6f06d1750b2b45cf318dad6d036559a37c))
* Made pre-commit hook require dep updates before running update third party deps ([#251](https://github.com/newrelic/node-native-metrics/pull/251)) ([bfab44d](https://github.com/newrelic/node-native-metrics/commit/bfab44d54add9549145cbaebd73223387b150f58))
* Removed copying package-lock.json to linux arm docker container ([#261](https://github.com/newrelic/node-native-metrics/pull/261)) ([da2d7c1](https://github.com/newrelic/node-native-metrics/commit/da2d7c16f7e4c4bb9e21ba03f4b1260bfec2404f))
* Removed outdated Slack reference ([#253](https://github.com/newrelic/node-native-metrics/pull/253)) ([d76afb4](https://github.com/newrelic/node-native-metrics/commit/d76afb40f0ef17030134213971d4239189dd63f8))

### v10.1.1 (2024-04-09)

#### Miscellaneous chores

* Skipped macOS integration tests in CI ([#245](https://github.com/newrelic/node-native-metrics/pull/245)) ([20b096f](https://github.com/newrelic/node-native-metrics/commit/20b096ffbc615a34a87e6818222ab44925341b79))

#### Continuous integration

* Removed `use_new_release` input from prepare release workflow ([#247](https://github.com/newrelic/node-native-metrics/pull/247)) ([6cadc52](https://github.com/newrelic/node-native-metrics/commit/6cadc5289596fc98942274a614d6e4cfcc7af26c))
* Updated CI process for releases ([#246](https://github.com/newrelic/node-native-metrics/pull/246)) ([aa63ee8](https://github.com/newrelic/node-native-metrics/commit/aa63ee830288b096b48c6064bf19456eb9f9c635))

### v10.1.0 (2024-03-05)

* Migrated to using prebuildify and node-gyp-install.
  + Prebuilt binaries are now shipped in the npm package.
  + Prebuilt binaries are included for Node.js 16, 18, and 20 across Windows x86/x64, Linux amd64/arm64, and macOS arm64.
  + The environment variables `NR_NATIVE_METRICS_NO_DOWNLOAD`, `NR_NATIVE_METRICS_NO_BUILD`, `NR_NATIVE_METRICS_DOWNLOAD_HOST`, and `NR_NATIVE_METRICS_REMOTE_PATH` have been removed.
* Bumped [@babel/traverse](https://github.com/babel/babel/tree/HEAD/packages/babel-traverse) from 7.22.5 to 7.23.2.

### v10.0.1 (2023-09-11)

* Fixed issue where this package could not download prebuilts.


* Fixed issue in Node 20 with using a proxy server to download prebuilts.

### v10.0.0 (2023-08-28)

* **BREAKING**: Removed support for Node 14.

* Added support for Node 20.

* Updated install stage to attempt download first, and fall back to build if download fails

* Refactored code to make it easier to test
 * Added full suite of unit tests

* Updated word-wrap from 1.2.3 to 1.2.4.

### v9.0.1 (2023-06-21)

* Updated the slack invite link
* Updated semver to 7.5.2.
* Updated README links to point to new forum link due to repolinter ruleset change
* Updated [xml2js](https://github.com/Leonidas-from-XIV/node-xml2js) to 0.5.0.
* Updated [json5](https://github.com/json5/json5) from 2.2.1 to 2.2.2.
* Added lockfile checks to CI workflow to prevent malicious changes
* Updated [qs](https://github.com/ljharb/qs) to 6.5.3.

### v9.0.0 (2022-08-01)

* **BREAKING** Removed support for Node 12.

  The minimum supported version is now Node v14. For further information on our support policy, see: https://docs.newrelic.com/docs/agents/nodejs-agent/getting-started/compatibility-requirements-nodejs-agent.

* Added support for Node 18.

* Fixed GC binder to properly record Garbage Collection metrics in Node 18.

* Resolved several dev-dependency audit warnings.

* Bumped minimum `nan` version to ^2.16.0.

### v8.0.0 (2022-03-22)

* **BREAKING** Removed RUSageMeter.  This was used to get resource usage statistics via `libuv`. It is no longer needed since Node.js version 12 has support via `process.cpuUsage`.

* Fixed spelling in compatibility documentation.

* Added integration tests for downloading with proxy.

* Fixed the download tests to skip when running on branch or unsupported architectures.

### v7.1.2 (2022-02-23)

* Added `windows-latest` run for Node 16 only back to CI.

* Added clarifying language to agent impacts when the module fails to install to install script.
  * Indicated which page the missing metrics impact.
  * Added new blurb to failure as the initial message can be missed/skimmed-over when there is significant build process logging.
  * Indicated it is safe to run in production.

### v7.1.1 (2022-02-16)

* Replaced usage of `proxy-agent` with `https-proxy-agent`.

* Bumped `nan` to ^2.15.0.

* Updated `add-to-board` to use org level `NODE_AGENT_GH_TOKEN`

* Changed trigger on binary upload to wait for release of module instead of waiting for a tag that starts with `v` to be created

* Updated CI workflow to use `windows-2019` image instead of `windows-latest`.

### v7.1.0 (2022-01-11)

* Added ability to download pre-builts through a proxy host.
  * Use `NR_NATIVE_METRICS_PROXY_HOST=<proxy_host> npm i @newrelic/native-metrics`.

* Fixed deprecated code, updated `fs.existsSync` to `fs.accessSync` and using `NULL` vs. the more modern `nullptr`.

* Added workflow to automate preparing release notes by reusing the newrelic/node-newrelic/.github/workflows/prep-release.yml@main workflow from agent repository.

* Added job to automatically add issues/pr to Node.js Engineering board

### v7.0.2 (2021-08-26):

* Updated code to only check `node-gyp` version when the module needs to be built to avoid hanging node and subsequently causing OOM errors.
* Added a pre-commit hook to check if package.json changes and run `oss third-party manifest` and `oss third-party notices`. This will ensure the `third_party_manifest.json` and `THIRD_PARTY_NOTICES.md` are up to date.
* Fixed intermittent timeout issue with the server smoke integration test.

  Excluded native metric install setup time from server soak test timeout.
* Added `@newrelic/eslint-config` to rely on a centralized eslint ruleset.
* Added `husky` + `lint-staged` to run linting on all staged js files.
* Added integration tests for pre-build and upload tasks.
* Upgraded setup-node CI job to v2 and changed the linting node version to `lts/*` for future proofing.

### v7.0.1 (2021-07-20):

* Added support for Node 16.
* **BREAKING** Removed support for Node 10.

  The minimum supported version is now Node v12. For further information on our support policy, see: https://docs.newrelic.com/docs/agents/nodejs-agent/getting-started/compatibility-requirements-nodejs-agent.

* Updated release workflow to run on Node v12.x, 14.x, and v16.x.
* Added files list to package.json instead of relying on `.npmignore`.
* Removed unused `bin/test-all-node.sh`.
* Removed semver check for Resource Unit meter availability.
* Fixed v7.0.0 by adding `binding.gyp` to package.json files list.

### v7.0.0 (2021-07-20):

* **This release has been deprecated.** Please use version 7.0.1 or higher.

### v6.0.2 (2021-06-16):

* Changes hasCalledBack from a constant to a variable to avoid failure when it gets reassigned.
Thank you @paulgoertzen-merico for the bug fix.
* Added 'no-const-assign' lint rule.

### v6.0.1 (2021-06-15):

* Created a standalone upload script to avoid issues where aws-sdk does not exist.
* Bumped tap to ^15.0.9.
* Replaced deprecated tap methods with preferred ones.
* Updated CONTRIBUTING.md to reference the New Relic org wide Code of Conduct.
* Added lib/upload.js to the .npmignore as it is not needed for the module to function.
* Bumped nan to ^2.14.2.

### v6.0.0 (2020-11-03):

* Removed Node v8.x from ci.
* Updated README to be consistent with OSS template.
* Added open source policy workflow.
* Supressing warnings during installation on alpine docker image.
  Thank you @eyedean for the contribution.
* Updated name and job-name in release workflow.
* Filtered out tags for CI workflow to prevent running on tag push for releases. The release job handles full testing.

### v5.3.0 (2020-08-06):

* Updated to Apache 2.0 license.
* Added third party notices file and metadata for dependencies.
* Updated README with more detail.
* Added issue templates for bugs and enhancements.
* Added code of conduct file.
* Updated contributing guide.
* Added pull request template.
* Migrated CI to GitHub Actions.
* Added copyright headers to all source files.
* Added additional items to .npmignore.

### v5.2.0 (2020-06-01):

* Added special binary naming case to enable usage in Electron environments.

  Enables the module to be used in Electron environments when built with tools that add 'electron' to `npm_config_runtime` or `npm_config_disturl` (such as `electron-rebuild` or `electron-builder`). In this case, the ABI is left-off of the file name.

  Many thanks to @frankrobert-ls for raising the issue and providing a patch!

  Please Note: Electron is not officially supported and other issues may still exist with the module in these environments.

### v5.1.0 (2020-05-06):

* Upgraded `nan` to ^2.14.1 to resolve 'GetContents' deprecation warning with Node 14.

  Includes addition of Node 14 coverage and builds. Many thanks to @abetomo for the contribution.

### v5.0.0 (2019-10-16):

* **BREAKING** Removed support for Node 6, 7, 9 and 11.

  The minimum supported version of the native metrics module is now Node v8. For further information on our support policy, see: https://docs.newrelic.com/docs/agents/nodejs-agent/getting-started/compatibility-requirements-nodejs-agent.

* Added support for Node v12.

### v4.1.0 (2019-02-07):

* Added support for insecure (http) binary hosts. Use at your own discretion.

  The default host remains as New Relic's binary repository behind an `https`
  server. To use an `http` endpoint you must manually configure it yourself.

  Special thanks to Adam Brett (@adambrett) and Guilherme Nagatomo (@guilhermehn)
  for contributing this feature.

### v4.0.0 (2019-01-22):

* **BREAKING**: Dropped support for Node versions <6.

* Added pre-execution log message calling out that this is an optional
  dependency in the agent.

* Simplified final error by removing most of the confusing `Failed to...`
  messages.

### v3.1.2 (2018-10-22):

* Corrected check for build flags to base on gyp version, not Node version.

  Previously, when checking if the old `\t:` syntax should be used, this looked
  for Node <10.8.0. Now this looks for node-gyp <3.7.0. This accounts for
  situations where users install their own versions of node-gyp.

  Special thanks to Eric Boureau (@eboureau) for contributing this fix.

### v3.1.1 (2018-09-10):

* Fixed building the module on Windows with Node v10.8.0 or greater.

  Special thanks to Elmar Burke (@elmarburke) for this contribution!

### v3.1.0 (2018-07-02):

* Added support for caching prebuilt binaries for firewalled deployments.

  Simply set the `NR_NATIVE_METRICS_DOWNLOAD_HOST` environment variable to the
  protocol and host for the download (e.g. `http://your-internal-cache/`) and
  `NR_NATIVE_METRICS_REMOTE_PATH` to the path to the download folder (e.g.
  `path/to/downloads/folder`).

  Special thanks to Adam Brett (@adambrett) for contributing this feature.

* Added support and pre-built binaries for Node 10.

### v3.0.0 (2018-06-04):

* **BREAKING** Removed support for Node 0.12.

  The minimum supported version of the native metrics module is now Node v4.

* **BREAKING** Removed `gc` event in favor of `getGCMetrics()` method.

  The `gc` event will no longer be emitted for each garbage collection by V8.
  Instead, metrics for garbage collections are aggregated in C++ and can be
  retrieved by calling `getGCMetrics()`. Like `getLoopMetrics()`, this new
  method will reset the aggregated metrics.

* Added pre-built binaries for Node 5 and 7.

### v2.4.0 (2018-04-20):

* Added `NR_NATIVE_METRICS_NO_BUILD` and `NR_NATIVE_METRICS_NO_DOWNLOAD`
  environment variables.

  These are just environment variable versions of the `--no-build` and
  `--no-download` flags introduced in v2.3.0.

### v2.3.0 (2018-04-19):

* Added `--no-build` and `--no-download` flags for install script.

  These flags prevent the installer for the native metrics from either building
  or downloading binaries. If both are specified, `--no-download` is ignored.

### v2.2.0 (2018-02-12):

* The package will now pull down pre-built binaries if compilation fails.

  After confirming that the binary downloading functionality works, the feature
  has been enabled by default.  The installation script will still default to a
  fresh build where possible, using the download option as a fall back.

* The process will no longer be held open due to pending timers.

  Previously, the timer used to calculate the CPU usage by a tick of the event
  loop was left pending, causing the process to hang.


### v2.1.2 (2017-09-26):

* Metric timers no longer hold the process open.

Thanks to @samshull for the contribution!

### v2.1.1 (2017-04-03):

* Fixed build error on Windows thanks to Maximilian Haupt (@0x7f).

* Added C++-layer unit testing using [gtest](https://github.com/google/googletest).

* Updated readme with correct installation for the New Relic Agent v1.

### v2.1.0 (2017-02-06):

* Added an event loop CPU usage metric.

  The module will now report round trip CPU usage metrics for Node's event loop. This
  metric can be read off with `nativeMetrics.getLoopMetrics()` and will
  represent the amount of CPU time per tick of the event loop.

### v2.0.2 (2017-01-19):

* Removed pre-compiling binaries using the `node-pre-gyp` module.

  Previously we provided pre-compiled binaries for certain platforms and versions of Node.
  However, this caused issues for customers using shrinkwrapping.  In order to support
  shrinkwrapping as well as all versions of Node and npm that our customers use, we have
  decided to remove this feature.  This means that in order to use this module, users now
  need to have a compiler on the machine where it is being installed.
  See [node-gyp] (https://www.npmjs.com/package/node-gyp#installation) for more
  information on compiling native addons.

### v2.0.0 (2017-01-04):

* Removed support for Node 0.10.

  The `segfault-handler` dependency no longer compiles on Node 0.10 in our tests.

* The `node-pre-gyp` module is now a bundled dependency.

  Previously it was installed using a preinstall script, which was causing an issue with
  shrinkwrapping parent projects.  Thanks to Robert Rossman (@Alaneor) for
  the contribution!

* Added License section to the Readme file.

### v1.0.0 (2016-12-07):

* General release. No code changes from v0.1.1.

### v0.1.1 (2016-12-05):

* Added guard against binding GC events more than once.

* Removed OS X from Travis to temporarily get around extremely long builds.
  Added script to run tests locally across multiple versions of Node.

* Added test for checking licenses of dependencies.

### v0.1.0 (2016-11-29):

* Added `gc` event with duration and type of garbage collection.
* Added `usage` event with current and diff of resource usage stats.
