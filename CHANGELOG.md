### v10.1.0 (2024-03-04)

Migrated to using prebuildify and node-gyp-install.

--- NOTES NEEDS REVIEW ---
Bumps [@babel/traverse](https://github.com/babel/babel/tree/HEAD/packages/babel-traverse) from 7.22.5 to 7.23.2.
<details>
<summary>Release notes</summary>
<p><em>Sourced from <a href="https://github.com/babel/babel/releases"><code>@​babel/traverse</code>'s releases</a>.</em></p>
<blockquote>
<h2>v7.23.2 (2023-10-11)</h2>
<p><strong>NOTE</strong>: This release also re-publishes <code>@babel/core</code>, even if it does not appear in the linked release commit.</p>
<p>Thanks <a href="https://github.com/jimmydief"><code>@​jimmydief</code></a> for your first PR!</p>
<h4>:bug: Bug Fix</h4>
<ul>
<li><code>babel-traverse</code>
<ul>
<li><a href="https://redirect.github.com/babel/babel/pull/16033">#16033</a> Only evaluate own String/Number/Math methods (<a href="https://github.com/nicolo-ribaudo"><code>@​nicolo-ribaudo</code></a>)</li>
</ul>
</li>
<li><code>babel-preset-typescript</code>
<ul>
<li><a href="https://redirect.github.com/babel/babel/pull/16022">#16022</a> Rewrite <code>.tsx</code> extension when using <code>rewriteImportExtensions</code> (<a href="https://github.com/jimmydief"><code>@​jimmydief</code></a>)</li>
</ul>
</li>
<li><code>babel-helpers</code>
<ul>
<li><a href="https://redirect.github.com/babel/babel/pull/16017">#16017</a> Fix: fallback to typeof when toString is applied to incompatible object (<a href="https://github.com/JLHwung"><code>@​JLHwung</code></a>)</li>
</ul>
</li>
<li><code>babel-helpers</code>, <code>babel-plugin-transform-modules-commonjs</code>, <code>babel-runtime-corejs2</code>, <code>babel-runtime-corejs3</code>, <code>babel-runtime</code>
<ul>
<li><a href="https://redirect.github.com/babel/babel/pull/16025">#16025</a> Avoid override mistake in namespace imports (<a href="https://github.com/nicolo-ribaudo"><code>@​nicolo-ribaudo</code></a>)</li>
</ul>
</li>
</ul>
<h4>Committers: 5</h4>
<ul>
<li>Babel Bot (<a href="https://github.com/babel-bot"><code>@​babel-bot</code></a>)</li>
<li>Huáng Jùnliàng (<a href="https://github.com/JLHwung"><code>@​JLHwung</code></a>)</li>
<li>James Diefenderfer (<a href="https://github.com/jimmydief"><code>@​jimmydief</code></a>)</li>
<li>Nicolò Ribaudo (<a href="https://github.com/nicolo-ribaudo"><code>@​nicolo-ribaudo</code></a>)</li>
<li><a href="https://github.com/liuxingbaoyu"><code>@​liuxingbaoyu</code></a></li>
</ul>
<h2>v7.23.1 (2023-09-25)</h2>
<p>Re-publishing <code>@babel/helpers</code> due to a publishing error in 7.23.0.</p>
<h2>v7.23.0 (2023-09-25)</h2>
<p>Thanks <a href="https://github.com/lorenzoferre"><code>@​lorenzoferre</code></a> and <a href="https://github.com/RajShukla1"><code>@​RajShukla1</code></a> for your first PRs!</p>
<h4>:rocket: New Feature</h4>
<ul>
<li><code>babel-plugin-proposal-import-wasm-source</code>, <code>babel-plugin-syntax-import-source</code>, <code>babel-plugin-transform-dynamic-import</code>
<ul>
<li><a href="https://redirect.github.com/babel/babel/pull/15870">#15870</a> Support transforming <code>import source</code> for wasm (<a href="https://github.com/nicolo-ribaudo"><code>@​nicolo-ribaudo</code></a>)</li>
</ul>
</li>
<li><code>babel-helper-module-transforms</code>, <code>babel-helpers</code>, <code>babel-plugin-proposal-import-defer</code>, <code>babel-plugin-syntax-import-defer</code>, <code>babel-plugin-transform-modules-commonjs</code>, <code>babel-runtime-corejs2</code>, <code>babel-runtime-corejs3</code>, <code>babel-runtime</code>, <code>babel-standalone</code>
<ul>
<li><a href="https://redirect.github.com/babel/babel/pull/15878">#15878</a> Implement <code>import defer</code> proposal transform support (<a href="https://github.com/nicolo-ribaudo"><code>@​nicolo-ribaudo</code></a>)</li>
</ul>
</li>
<li><code>babel-generator</code>, <code>babel-parser</code>, <code>babel-types</code>
<ul>
<li><a href="https://redirect.github.com/babel/babel/pull/15845">#15845</a> Implement <code>import defer</code> parsing support (<a href="https://github.com/nicolo-ribaudo"><code>@​nicolo-ribaudo</code></a>)</li>
<li><a href="https://redirect.github.com/babel/babel/pull/15829">#15829</a> Add parsing support for the &quot;source phase imports&quot; proposal (<a href="https://github.com/nicolo-ribaudo"><code>@​nicolo-ribaudo</code></a>)</li>
</ul>
</li>
<li><code>babel-generator</code>, <code>babel-helper-module-transforms</code>, <code>babel-parser</code>, <code>babel-plugin-transform-dynamic-import</code>, <code>babel-plugin-transform-modules-amd</code>, <code>babel-plugin-transform-modules-commonjs</code>, <code>babel-plugin-transform-modules-systemjs</code>, <code>babel-traverse</code>, <code>babel-types</code>
<ul>
<li><a href="https://redirect.github.com/babel/babel/pull/15682">#15682</a> Add <code>createImportExpressions</code> parser option (<a href="https://github.com/JLHwung"><code>@​JLHwung</code></a>)</li>
</ul>
</li>
<li><code>babel-standalone</code>
<ul>
<li><a href="https://redirect.github.com/babel/babel/pull/15671">#15671</a> Pass through nonce to the transformed script element (<a href="https://github.com/JLHwung"><code>@​JLHwung</code></a>)</li>
</ul>
</li>
<li><code>babel-helper-function-name</code>, <code>babel-helper-member-expression-to-functions</code>, <code>babel-helpers</code>, <code>babel-parser</code>, <code>babel-plugin-proposal-destructuring-private</code>, <code>babel-plugin-proposal-optional-chaining-assign</code>, <code>babel-plugin-syntax-optional-chaining-assign</code>, <code>babel-plugin-transform-destructuring</code>, <code>babel-plugin-transform-optional-chaining</code>, <code>babel-runtime-corejs2</code>, <code>babel-runtime-corejs3</code>, <code>babel-runtime</code>, <code>babel-standalone</code>, <code>babel-types</code>
<ul>
<li><a href="https://redirect.github.com/babel/babel/pull/15751">#15751</a> Add support for optional chain in assignments (<a href="https://github.com/nicolo-ribaudo"><code>@​nicolo-ribaudo</code></a>)</li>
</ul>
</li>
<li><code>babel-helpers</code>, <code>babel-plugin-proposal-decorators</code>
<ul>
<li><a href="https://redirect.github.com/babel/babel/pull/15895">#15895</a> Implement the &quot;decorator metadata&quot; proposal (<a href="https://github.com/nicolo-ribaudo"><code>@​nicolo-ribaudo</code></a>)</li>
</ul>
</li>
<li><code>babel-traverse</code>, <code>babel-types</code>
<ul>
<li><a href="https://redirect.github.com/babel/babel/pull/15893">#15893</a> Add <code>t.buildUndefinedNode</code> (<a href="https://github.com/liuxingbaoyu"><code>@​liuxingbaoyu</code></a>)</li>
</ul>
</li>
<li><code>babel-preset-typescript</code></li>
</ul>
<!-- raw HTML omitted -->
</blockquote>
<p>... (truncated)</p>
</details>
<details>
<summary>Changelog</summary>
<p><em>Sourced from <a href="https://github.com/babel/babel/blob/main/CHANGELOG.md"><code>@​babel/traverse</code>'s changelog</a>.</em></p>
<blockquote>
<h2>v7.23.2 (2023-10-11)</h2>
<h4>:bug: Bug Fix</h4>
<ul>
<li><code>babel-traverse</code>
<ul>
<li><a href="https://redirect.github.com/babel/babel/pull/16033">#16033</a> Only evaluate own String/Number/Math methods (<a href="https://github.com/nicolo-ribaudo"><code>@​nicolo-ribaudo</code></a>)</li>
</ul>
</li>
<li><code>babel-preset-typescript</code>
<ul>
<li><a href="https://redirect.github.com/babel/babel/pull/16022">#16022</a> Rewrite <code>.tsx</code> extension when using <code>rewriteImportExtensions</code> (<a href="https://github.com/jimmydief"><code>@​jimmydief</code></a>)</li>
</ul>
</li>
<li><code>babel-helpers</code>
<ul>
<li><a href="https://redirect.github.com/babel/babel/pull/16017">#16017</a> Fix: fallback to typeof when toString is applied to incompatible object (<a href="https://github.com/JLHwung"><code>@​JLHwung</code></a>)</li>
</ul>
</li>
<li><code>babel-helpers</code>, <code>babel-plugin-transform-modules-commonjs</code>, <code>babel-runtime-corejs2</code>, <code>babel-runtime-corejs3</code>, <code>babel-runtime</code>
<ul>
<li><a href="https://redirect.github.com/babel/babel/pull/16025">#16025</a> Avoid override mistake in namespace imports (<a href="https://github.com/nicolo-ribaudo"><code>@​nicolo-ribaudo</code></a>)</li>
</ul>
</li>
</ul>
<h2>v7.23.0 (2023-09-25)</h2>
<h4>:rocket: New Feature</h4>
<ul>
<li><code>babel-plugin-proposal-import-wasm-source</code>, <code>babel-plugin-syntax-import-source</code>, <code>babel-plugin-transform-dynamic-import</code>
<ul>
<li><a href="https://redirect.github.com/babel/babel/pull/15870">#15870</a> Support transforming <code>import source</code> for wasm (<a href="https://github.com/nicolo-ribaudo"><code>@​nicolo-ribaudo</code></a>)</li>
</ul>
</li>
<li><code>babel-helper-module-transforms</code>, <code>babel-helpers</code>, <code>babel-plugin-proposal-import-defer</code>, <code>babel-plugin-syntax-import-defer</code>, <code>babel-plugin-transform-modules-commonjs</code>, <code>babel-runtime-corejs2</code>, <code>babel-runtime-corejs3</code>, <code>babel-runtime</code>, <code>babel-standalone</code>
<ul>
<li><a href="https://redirect.github.com/babel/babel/pull/15878">#15878</a> Implement <code>import defer</code> proposal transform support (<a href="https://github.com/nicolo-ribaudo"><code>@​nicolo-ribaudo</code></a>)</li>
</ul>
</li>
<li><code>babel-generator</code>, <code>babel-parser</code>, <code>babel-types</code>
<ul>
<li><a href="https://redirect.github.com/babel/babel/pull/15845">#15845</a> Implement <code>import defer</code> parsing support (<a href="https://github.com/nicolo-ribaudo"><code>@​nicolo-ribaudo</code></a>)</li>
<li><a href="https://redirect.github.com/babel/babel/pull/15829">#15829</a> Add parsing support for the &quot;source phase imports&quot; proposal (<a href="https://github.com/nicolo-ribaudo"><code>@​nicolo-ribaudo</code></a>)</li>
</ul>
</li>
<li><code>babel-generator</code>, <code>babel-helper-module-transforms</code>, <code>babel-parser</code>, <code>babel-plugin-transform-dynamic-import</code>, <code>babel-plugin-transform-modules-amd</code>, <code>babel-plugin-transform-modules-commonjs</code>, <code>babel-plugin-transform-modules-systemjs</code>, <code>babel-traverse</code>, <code>babel-types</code>
<ul>
<li><a href="https://redirect.github.com/babel/babel/pull/15682">#15682</a> Add <code>createImportExpressions</code> parser option (<a href="https://github.com/JLHwung"><code>@​JLHwung</code></a>)</li>
</ul>
</li>
<li><code>babel-standalone</code>
<ul>
<li><a href="https://redirect.github.com/babel/babel/pull/15671">#15671</a> Pass through nonce to the transformed script element (<a href="https://github.com/JLHwung"><code>@​JLHwung</code></a>)</li>
</ul>
</li>
<li><code>babel-helper-function-name</code>, <code>babel-helper-member-expression-to-functions</code>, <code>babel-helpers</code>, <code>babel-parser</code>, <code>babel-plugin-proposal-destructuring-private</code>, <code>babel-plugin-proposal-optional-chaining-assign</code>, <code>babel-plugin-syntax-optional-chaining-assign</code>, <code>babel-plugin-transform-destructuring</code>, <code>babel-plugin-transform-optional-chaining</code>, <code>babel-runtime-corejs2</code>, <code>babel-runtime-corejs3</code>, <code>babel-runtime</code>, <code>babel-standalone</code>, <code>babel-types</code>
<ul>
<li><a href="https://redirect.github.com/babel/babel/pull/15751">#15751</a> Add support for optional chain in assignments (<a href="https://github.com/nicolo-ribaudo"><code>@​nicolo-ribaudo</code></a>)</li>
</ul>
</li>
<li><code>babel-helpers</code>, <code>babel-plugin-proposal-decorators</code>
<ul>
<li><a href="https://redirect.github.com/babel/babel/pull/15895">#15895</a> Implement the &quot;decorator metadata&quot; proposal (<a href="https://github.com/nicolo-ribaudo"><code>@​nicolo-ribaudo</code></a>)</li>
</ul>
</li>
<li><code>babel-traverse</code>, <code>babel-types</code>
<ul>
<li><a href="https://redirect.github.com/babel/babel/pull/15893">#15893</a> Add <code>t.buildUndefinedNode</code> (<a href="https://github.com/liuxingbaoyu"><code>@​liuxingbaoyu</code></a>)</li>
</ul>
</li>
<li><code>babel-preset-typescript</code>
<ul>
<li><a href="https://redirect.github.com/babel/babel/pull/15913">#15913</a> Add <code>rewriteImportExtensions</code> option to TS preset (<a href="https://github.com/nicolo-ribaudo"><code>@​nicolo-ribaudo</code></a>)</li>
</ul>
</li>
<li><code>babel-parser</code>
<ul>
<li><a href="https://redirect.github.com/babel/babel/pull/15896">#15896</a> Allow TS tuples to have both labeled and unlabeled elements (<a href="https://github.com/yukukotani"><code>@​yukukotani</code></a>)</li>
</ul>
</li>
</ul>
<h4>:bug: Bug Fix</h4>
<ul>
<li><code>babel-plugin-transform-block-scoping</code>
<ul>
<li><a href="https://redirect.github.com/babel/babel/pull/15962">#15962</a> fix: <code>transform-block-scoping</code> captures the variables of the method in the loop (<a href="https://github.com/liuxingbaoyu"><code>@​liuxingbaoyu</code></a>)</li>
</ul>
</li>
</ul>
<h4>:nail_care: Polish</h4>
<ul>
<li><code>babel-traverse</code>
<ul>
<li><a href="https://redirect.github.com/babel/babel/pull/15797">#15797</a> Expand evaluation of global built-ins in <code>@babel/traverse</code> (<a href="https://github.com/lorenzoferre"><code>@​lorenzoferre</code></a>)</li>
</ul>
</li>
<li><code>babel-plugin-proposal-explicit-resource-management</code>
<ul>
<li><a href="https://redirect.github.com/babel/babel/pull/15985">#15985</a> Improve source maps for blocks with <code>using</code> declarations (<a href="https://github.com/nicolo-ribaudo"><code>@​nicolo-ribaudo</code></a>)</li>
</ul>
</li>
</ul>
<h4>:microscope: Output optimization</h4>
<ul>
<li><code>babel-core</code>, <code>babel-helper-module-transforms</code>, <code>babel-plugin-transform-async-to-generator</code>, <code>babel-plugin-transform-classes</code>, <code>babel-plugin-transform-dynamic-import</code>, <code>babel-plugin-transform-function-name</code>, <code>babel-plugin-transform-modules-amd</code>, <code>babel-plugin-transform-modules-commonjs</code>, <code>babel-plugin-transform-modules-umd</code>, <code>babel-plugin-transform-parameters</code>, <code>babel-plugin-transform-react-constant-elements</code>, <code>babel-plugin-transform-react-inline-elements</code>, <code>babel-plugin-transform-runtime</code>, <code>babel-plugin-transform-typescript</code>, <code>babel-preset-env</code>
<ul>
<li><a href="https://redirect.github.com/babel/babel/pull/15984">#15984</a> Inline <code>exports.XXX =</code> update in simple variable declarations (<a href="https://github.com/nicolo-ribaudo"><code>@​nicolo-ribaudo</code></a>)</li>
</ul>
</li>
</ul>
<h2>v7.22.20 (2023-09-16)</h2>
<!-- raw HTML omitted -->
</blockquote>
<p>... (truncated)</p>
</details>
<details>
<summary>Commits</summary>
<ul>
<li><a href="https://github.com/babel/babel/commit/b4b9942a6cde0685c222eb3412347880aae40ad5"><code>b4b9942</code></a> v7.23.2</li>
<li><a href="https://github.com/babel/babel/commit/b13376b346946e3f62fc0848c1d2a23223314c82"><code>b13376b</code></a> Only evaluate own String/Number/Math methods (<a href="https://github.com/babel/babel/tree/HEAD/packages/babel-traverse/issues/16033">#16033</a>)</li>
<li><a href="https://github.com/babel/babel/commit/ca58ec15cb6dde6812c36997477e44880bec0bba"><code>ca58ec1</code></a> v7.23.0</li>
<li><a href="https://github.com/babel/babel/commit/0f333dafcf470f1970083e4e695ced6aec8bead0"><code>0f333da</code></a> Add <code>createImportExpressions</code> parser option (<a href="https://github.com/babel/babel/tree/HEAD/packages/babel-traverse/issues/15682">#15682</a>)</li>
<li><a href="https://github.com/babel/babel/commit/3744545649fdc21688a2f3c97e1e39dbebff0d21"><code>3744545</code></a> Fix linting</li>
<li><a href="https://github.com/babel/babel/commit/c7e6806e2194deb36c330f543409c792592b22d4"><code>c7e6806</code></a> Add <code>t.buildUndefinedNode</code> (<a href="https://github.com/babel/babel/tree/HEAD/packages/babel-traverse/issues/15893">#15893</a>)</li>
<li><a href="https://github.com/babel/babel/commit/38ee8b4dd693f1e2bd00107bbc1167ce84736ea0"><code>38ee8b4</code></a> Expand evaluation of global built-ins in <code>@babel/traverse</code> (<a href="https://github.com/babel/babel/tree/HEAD/packages/babel-traverse/issues/15797">#15797</a>)</li>
<li><a href="https://github.com/babel/babel/commit/9f3dfd90211472cf0083a3234dd1a1b857ce3624"><code>9f3dfd9</code></a> v7.22.20</li>
<li><a href="https://github.com/babel/babel/commit/3ed28b29c1fb15588369bdd55187b69f1248e87d"><code>3ed28b2</code></a> Fully support <code>||</code> and <code>&amp;&amp;</code> in <code>pluginToggleBooleanFlag</code> (<a href="https://github.com/babel/babel/tree/HEAD/packages/babel-traverse/issues/15961">#15961</a>)</li>
<li><a href="https://github.com/babel/babel/commit/77b0d7359909c94f3797c24006f244847fbc8d6d"><code>77b0d73</code></a> v7.22.19</li>
<li>Additional commits viewable in <a href="https://github.com/babel/babel/commits/v7.23.2/packages/babel-traverse">compare view</a></li>
</ul>
</details>
<br />


[![Dependabot compatibility score](https://dependabot-badges.githubapp.com/badges/compatibility_score?dependency-name=@babel/traverse&package-manager=npm_and_yarn&previous-version=7.22.5&new-version=7.23.2)](https://docs.github.com/en/github/managing-security-vulnerabilities/about-dependabot-security-updates#about-compatibility-scores)

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
- `@dependabot show <dependency name> ignore conditions` will show all of the ignore conditions of the specified dependency
- `@dependabot ignore this major version` will close this PR and stop Dependabot creating any more for this major version (unless you reopen the PR or upgrade to it yourself)
- `@dependabot ignore this minor version` will close this PR and stop Dependabot creating any more for this minor version (unless you reopen the PR or upgrade to it yourself)
- `@dependabot ignore this dependency` will close this PR and stop Dependabot creating any more for this dependency (unless you reopen the PR or upgrade to it yourself)
You can disable automated security fix PRs for this repo from the [Security Alerts page](https://github.com/newrelic/node-native-metrics/network/alerts).

</details>
--------------------------

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
