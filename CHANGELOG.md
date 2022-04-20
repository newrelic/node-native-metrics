### v8.0.1 (2022-04-20)

* Bumped async to ^3.2.2 to resolve dev dependency audit warning.

* Bumped tap to ^16.0.1.

* Resolved dev-only audit warnings.

--- NOTES NEEDS REVIEW ---
Bumps [moment](https://github.com/moment/moment) from 2.29.1 to 2.29.2.
<details>
<summary>Changelog</summary>
<p><em>Sourced from <a href="https://github.com/moment/moment/blob/develop/CHANGELOG.md">moment's changelog</a>.</em></p>
<blockquote>
<h3>2.29.2 <a href="https://gist.github.com/ichernev/1904b564f6679d9aac1ae08ce13bc45c">See full changelog</a></h3>
<ul>
<li>Release Apr 3 2022</li>
</ul>
<p>Address <a href="https://github.com/advisories/GHSA-8hfj-j24r-96c4">https://github.com/advisories/GHSA-8hfj-j24r-96c4</a></p>
</blockquote>
</details>
<details>
<summary>Commits</summary>
<ul>
<li><a href="https://github.com/moment/moment/commit/75e2ac573e8cd62086a6bc6dc1b8d271e2804391"><code>75e2ac5</code></a> Build 2.29.2</li>
<li><a href="https://github.com/moment/moment/commit/5a2987758edc7d413d1248737d9d0d1b65a70450"><code>5a29877</code></a> Bump version to 2.29.2</li>
<li><a href="https://github.com/moment/moment/commit/4fd847b7a8c7065d88ba0a64b727660190dd45d7"><code>4fd847b</code></a> Update changelog for 2.29.2</li>
<li><a href="https://github.com/moment/moment/commit/4211bfc8f15746be4019bba557e29a7ba83d54c5"><code>4211bfc</code></a> [bugfix] Avoid loading path-looking locales from fs</li>
<li><a href="https://github.com/moment/moment/commit/f2a813afcfd0dd6e63812ea74c46ecc627f6a6a6"><code>f2a813a</code></a> [misc] Fix indentation (according to prettier)</li>
<li><a href="https://github.com/moment/moment/commit/7a10de889de64c2519f894a84a98030bec5022d9"><code>7a10de8</code></a> [test] Avoid hours around DST</li>
<li><a href="https://github.com/moment/moment/commit/e96809208c9d1b1bbe22d605e76985770024de42"><code>e968092</code></a> [locale] ar-ly: fix locale name (<a href="https://github-redirect.dependabot.com/moment/moment/issues/5828">#5828</a>)</li>
<li><a href="https://github.com/moment/moment/commit/53d7ee6ad8c60c891571c7085db91831bbc095b4"><code>53d7ee6</code></a> [misc] fix builds (<a href="https://github-redirect.dependabot.com/moment/moment/issues/5836">#5836</a>)</li>
<li><a href="https://github.com/moment/moment/commit/52019f1dda47c3e598aaeaa4ac89d5a574641604"><code>52019f1</code></a> [misc] Specify length of toArray return type (<a href="https://github-redirect.dependabot.com/moment/moment/issues/5766">#5766</a>)</li>
<li><a href="https://github.com/moment/moment/commit/0dcaaa689d02dde824029b09ab6aa64ff351ee2e"><code>0dcaaa6</code></a> [locale] tr: update translation of Monday and Saturday (<a href="https://github-redirect.dependabot.com/moment/moment/issues/5756">#5756</a>)</li>
<li>Additional commits viewable in <a href="https://github.com/moment/moment/compare/2.29.1...2.29.2">compare view</a></li>
</ul>
</details>
<br />


[![Dependabot compatibility score](https://dependabot-badges.githubapp.com/badges/compatibility_score?dependency-name=moment&package-manager=npm_and_yarn&previous-version=2.29.1&new-version=2.29.2)](https://docs.github.com/en/github/managing-security-vulnerabilities/about-dependabot-security-updates#about-compatibility-scores)

Dependabot will resolve any conflicts with this PR as long as you don't alter it yourself. You can also trigger a rebase manually by commenting `@dependabot rebase`.

[//]: # (dependabot-automerge-start)
[//]: # (dependabot-automerge-end)

---

<details>
<summary>Dependabot commands and options</summary>
<br />

You can trigger Dependabot actions by commenting on this PR:
- `@dependabot rebase` will rebase this PR
- `@dependabot recreate` will recreate this PR, overwriting any edits that have been made to it
- `@dependabot merge` will merge this PR after your CI passes on it
- `@dependabot squash and merge` will squash and merge this PR after your CI passes on it
- `@dependabot cancel merge` will cancel a previously requested merge and block automerging
- `@dependabot reopen` will reopen this PR if it is closed
- `@dependabot close` will close this PR and stop Dependabot recreating it. You can achieve the same result by closing it manually
- `@dependabot ignore this major version` will close this PR and stop Dependabot creating any more for this major version (unless you reopen the PR or upgrade to it yourself)
- `@dependabot ignore this minor version` will close this PR and stop Dependabot creating any more for this minor version (unless you reopen the PR or upgrade to it yourself)
- `@dependabot ignore this dependency` will close this PR and stop Dependabot creating any more for this dependency (unless you reopen the PR or upgrade to it yourself)
- `@dependabot use these labels` will set the current labels as the default for future PRs for this repo and language
- `@dependabot use these reviewers` will set the current reviewers as the default for future PRs for this repo and language
- `@dependabot use these assignees` will set the current assignees as the default for future PRs for this repo and language
- `@dependabot use this milestone` will set the current milestone as the default for future PRs for this repo and language

You can disable automated security fix PRs for this repo from the [Security Alerts page](https://github.com/newrelic/node-native-metrics/network/alerts).

</details>
--------------------------

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
