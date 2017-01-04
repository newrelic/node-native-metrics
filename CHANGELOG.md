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
