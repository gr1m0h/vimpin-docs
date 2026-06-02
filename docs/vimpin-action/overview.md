---
sidebar_position: 1
title: Overview
---

# vimpin-action

A GitHub Action wrapper around the [vimpin](../vimpin/overview.md) CLI.

[`gr1m0h/vimpin-action`](https://github.com/gr1m0h/vimpin-action) collapses
the install-and-run boilerplate into a single workflow step. A workflow
can verify pins, fail PRs that introduce drift, or open update PRs
without managing Go installation and CLI versioning by hand.

## What the wrapper does

The action is a composite GitHub Action that:

1. Installs the Go toolchain at the requested version.
2. Installs the `vimpin` CLI at the requested ref (SHA, semver tag,
   `latest`, or `main`).
3. Translates the action's `mode` input into the corresponding CLI
   invocation.
4. Surfaces a `changed` output so downstream steps can branch on whether
   the action wrote (or would write) any files.

## Why a separate wrapper

Three reasons the action lives in its own repository:

1. **Independent versioning.** The action's `inputs` / `outputs` surface
   evolves on a different cadence than the CLI's flags. Bundling them in
   one repo would force a CLI release on every action surface change.
2. **CI-shaped ergonomics.** The action defaults are tuned for a CI
   environment (e.g., `mode: verify-check` is read-only by default,
   `fail-on-diff: false` for `update` mode so a PR-creating workflow can
   still write files first).
3. **Pinning the wrapper itself.** Following the same supply-chain
   discipline vimpin enforces on plugins, users pin
   `gr1m0h/vimpin-action@<sha>` and the action transitively pins the CLI
   to a known commit.

## Relationship to the CLI

| Concern | Lives in `vimpin` | Lives in `vimpin-action` |
| --- | :---: | :---: |
| Lua spec scanning / rewriting | ✓ | — |
| `git ls-remote` resolution | ✓ | — |
| CLI entry points | ✓ | — |
| Action input / output surface | — | ✓ |
| Composite-action wiring | — | ✓ |
| Action release tags | — | ✓ |

Bug reports about pinning behaviour go to
[`gr1m0h/vimpin`](https://github.com/gr1m0h/vimpin); bug reports about
the action wrapper go to
[`gr1m0h/vimpin-action`](https://github.com/gr1m0h/vimpin-action).

## Next

- [Quickstart](./quickstart.md)
- [Inputs](./inputs.md)
- [Modes](./modes.md)
- [Recipes](./recipes.md)
- [Versioning policy](./versioning.md)
