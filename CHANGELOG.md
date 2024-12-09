# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.0] - 2024-12-09

### Added

- Attribute changes will be batched via [`queueMicrotask`](https://developer.mozilla.org/en-US/docs/Web/API/Window/queueMicrotask), by [@compulim](https://github.com/compulim), in PR [#8](https://github.com/compulim/react-define-as-custom-element/pull/8)
- Support custom methods by registering via `useMethodCallback()`, by [@compulim](https://github.com/compulim), in PR [#9](https://github.com/compulim/react-define-as-custom-element/pull/9), [#10](https://github.com/compulim/react-define-as-custom-element/pull/10), and [#11](https://github.com/compulim/react-define-as-custom-element/pull/11)

### Removed

- 💥 Removed `withPropsDebounce`, by [@compulim](https://github.com/compulim), in PR [#8](https://github.com/compulim/react-define-as-custom-element/pull/8)

## [0.1.0] - 2024-12-06

- First public release

[0.2.0]: https://github.com/compulim/react-define-as-custom-element/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/compulim/react-define-as-custom-element/releases/tag/v0.1.0
