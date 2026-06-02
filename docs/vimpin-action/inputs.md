---
sidebar_position: 3
title: Inputs
---

# Inputs

Full reference for the action's `with:` surface.

| Input | Default | Description |
| --- | --- | --- |
| `mode` | `verify-check` | One of `run`, `check`, `verify`, `verify-check`, `update`, `no-api`. See [Modes](./modes.md). |
| `paths` | _(vimpin default)_ | Space-separated paths to scan. Empty means use vimpin's discovery layout (`lua/plugins/`, `lua/config/lazy.lua`, `init.lua`, `plugin/`). |
| `version` | `80abc5307ba6633cb2aa372a02aafb7ac6051f89` (v0.1.0) | vimpin CLI version. Accepts a commit SHA (recommended), a semver tag, `latest`, or `main`. |
| `fail-on-diff` | `false` | For `mode: run` and `mode: update` — fail the job if any files would change. Pointless for `check` / `verify-check` / `no-api`, which already exit non-zero on diff. |
| `go-version` | `1.24` | Go toolchain version used to install the CLI via `actions/setup-go`. |

## `mode`

The action's primary input. Maps to a vimpin CLI invocation:

```text
mode: run            → vimpin run [paths]
mode: check          → vimpin run --check [paths]
mode: verify         → vimpin run --verify [paths]
mode: verify-check   → vimpin run --verify --check [paths]
mode: update         → vimpin run --update [paths]
mode: no-api         → vimpin run --no-api [paths]
```

Each mode is covered in detail in [Modes](./modes.md).

## `paths`

Whitespace-separated list of paths passed positionally to vimpin. Useful
when your spec layout deviates from the LazyVim default:

```yaml
- uses: gr1m0h/vimpin-action@v0.1.0
  with:
    mode: verify-check
    paths: lua/extras/ lua/lazy/specs.lua
```

Leave empty (the default) to let vimpin's built-in discovery handle path
selection.

## `version`

Selects the vimpin CLI to install. The default pins to the v0.1.0
commit SHA — a deliberate choice that gives every consumer of the action
a known-good CLI without per-action releases.

| Value | When to use |
| --- | --- |
| `<40-hex SHA>` | **Production CI.** Reproducible, audit-friendly. Renovate or Dependabot can keep this up to date. |
| `v0.1.0`, `v0.2.0`, ... | Tag-pinning. Faster to read but vulnerable to tag rewrites. |
| `latest` | Always-fresh — but no reproducibility. Useful for the action's own CI but not for downstream users. |
| `main` | Tracks unreleased CLI changes. Only when investigating a CLI bug. |

## `fail-on-diff`

Only meaningful for `mode: run` and `mode: update`, both of which would
otherwise exit `0` even after writing files. Set to `true` when the
workflow's purpose is "block the merge if vimpin would change anything":

```yaml
- uses: gr1m0h/vimpin-action@v0.1.0
  with:
    mode: run
    fail-on-diff: true   # equivalent to mode: check
```

The `mode: check` and `mode: verify-check` modes already imply
`fail-on-diff: true`; this input lets the `run` / `update` modes opt
in.

## `go-version`

Forwarded to
[`actions/setup-go`](https://github.com/actions/setup-go). Override only
when you need a Go version different from `1.24` (e.g., to match an
internal toolchain policy). The CLI itself targets the latest stable
Go.
