# Changelog

All notable changes to this project are documented in this file.

## v1.1.2

### Fixed

- Hidden badges now reappear immediately when dashboard edit mode is opened.

## v1.1.1

### Fixed

- Fixed `show_badge: false` so it hides the badge outside dashboard edit mode.

## v1.1.0

### Added

- Added `show_badge` for boolean or JavaScript-controlled badge visibility.

## v1.0.1

### Fixed

- Removed extra horizontal space when a badge displays only an icon.

## v1.0.0

### Added

- Published the project as JS Badge.

### Changed

- Renamed the HACS package and generated bundle to `js-badge`.
- Renamed the Home Assistant badge type to `custom:js-badge`.
- Updated product names, internal identifiers, CSS variables and documentation for JS Badge.

### Breaking changes

- Existing configurations must change `type: custom:custom-js-badge` to `type: custom:js-badge`.
