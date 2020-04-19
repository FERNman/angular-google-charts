# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [1.1.0](https://github.com/FERNman/angular-google-charts/compare/v0.1.6...v1.1.0) (2020-04-19)

### ⚠ BREAKING CHANGES

- always load the `google.visualization` namespace
- rename raw chart to chart wrapper
- raw chart component
- google chart component
- script loader service public interface

### Features

- add safe mode to config ([e11974c](https://github.com/FERNman/angular-google-charts/commit/e11974c9ae8a851329d99b00251051cb3f29059b))
- always load the `google.visualization` namespace ([1a9d892](https://github.com/FERNman/angular-google-charts/commit/1a9d892ff721693d6636b24670f325b91a533c05))
- controls and dashboards ([3c7c497](https://github.com/FERNman/angular-google-charts/commit/3c7c497edcfd9d11db61eafd1ed251349b6fa55f))
- editing charts ([c6eda2d](https://github.com/FERNman/angular-google-charts/commit/c6eda2db8b270f7289c911a789ba65aac1cb0d4e))
- provide config as object ([2d5953f](https://github.com/FERNman/angular-google-charts/commit/2d5953fb62401890e81d6d6cc170eb05ac797597))

### Bug Fixes

- mouse events emitting multiple times if chart is redrawn ([20e6ad1](https://github.com/FERNman/angular-google-charts/commit/20e6ad1e27018ad5c300b23c4a374c2d43b02466)), closes [#83](https://github.com/FERNman/angular-google-charts/issues/83)
- run callbacks after loading scripts in angular zone ([b567030](https://github.com/FERNman/angular-google-charts/commit/b567030fa7821549eef4ecde135c5431755a5271))

### improvement

- script loader service public interface ([8f1f36b](https://github.com/FERNman/angular-google-charts/commit/8f1f36b0254d6444cf5bc9da556176bac85713f3))

* google chart component ([013f978](https://github.com/FERNman/angular-google-charts/commit/013f978dae88cceb963983ae353574344c41726d))
* raw chart component ([ed88549](https://github.com/FERNman/angular-google-charts/commit/ed885493882d9c7266c28a44416cb406eccdafed))
* rename raw chart to chart wrapper ([875e71e](https://github.com/FERNman/angular-google-charts/commit/875e71e6eacaf119314d2b3e4d32d64cca35665d))
