# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Documentation framework with CI drift prevention (JSDoc enforcement, ADRs, staleness checks)
- Architecture Decision Records (ADRs) at `docs/adr/`
- Living `ROADMAP.md` at project root
- JSDoc required on all exported functions via `eslint-plugin-jsdoc`
- CI staleness check to warn when code outpaces docs
