# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [1.1.6](https://github.com/FERNman/angular-google-charts/compare/v1.1.5...v1.1.6) (2020-09-12)

### Bug Fixes

- compilation errors because of types ([24a5d6c](https://github.com/FERNman/angular-google-charts/commit/24a5d6c0b8c8e6e403e2ac4b9e0ab39196e76641)), closes [#167](https://github.com/FERNman/angular-google-charts/issues/167)

### [1.1.5](https://github.com/FERNman/angular-google-charts/compare/v1.1.4...v1.1.5) (2020-09-07)

### Bug Fixes

- incorrect documentation links ([eaba673](https://github.com/FERNman/angular-google-charts/commit/eaba67300582e8a49a03fcf698f5233d18271891))

### [1.1.4](https://github.com/FERNman/angular-google-charts/compare/v1.1.3...v1.1.4) (2020-04-26)

### Bug Fixes

- compile error when using typescript < 3.7 ([7e9ff39](https://github.com/FERNman/angular-google-charts/commit/7e9ff396ce7a92e4d23d6737f43f6fc050b07cd5)), closes [microsoft/typescript#33939](https://github.com/microsoft/typescript/issues/33939) [#140](https://github.com/FERNman/angular-google-charts/issues/140)

### [1.1.3](https://github.com/FERNman/angular-google-charts/compare/v1.1.2...v1.1.3) (2020-04-23)

### Bug Fixes

- no selector for directive error ([95e594b](https://github.com/FERNman/angular-google-charts/commit/95e594b38256ff88dd5d18313d3f478f4afdb8a5))

### [1.1.2](https://github.com/FERNman/angular-google-charts/compare/v1.1.1...v1.1.2) (2020-04-22)

### Bug Fixes

- select event not firing ([624b080](https://github.com/FERNman/angular-google-charts/commit/624b080d443e696b38c222b07f540bc52b8993bb))

### [1.1.1](https://github.com/FERNman/angular-google-charts/compare/v1.1.0...v1.1.1) (2020-04-22)

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
