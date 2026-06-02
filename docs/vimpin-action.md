---
sidebar_position: 4
title: vimpin-action
---

# vimpin-action

GitHub Action wrapper around the [vimpin CLI](./vimpin/overview.md).
Replaces the install-and-run boilerplate with a single `uses:` step.

## Usage

```yaml
- uses: actions/checkout@v4
- uses: gr1m0h/vimpin-action@v0.1.0
  with:
    mode: verify-check
```

## Inputs

| Input | Default | Description |
| --- | --- | --- |
| `mode` | `verify-check` | One of `run`, `check`, `verify`, `verify-check`, `update`, `no-api`. Each maps 1:1 to a CLI flag combination — see [Commands](./vimpin/commands.md). |
| `paths` | _(empty)_ | Space-separated paths. Empty uses vimpin's discovery layout. |
| `version` | `80abc5307ba6633cb2aa372a02aafb7ac6051f89` (v0.1.0) | CLI version: commit SHA (recommended), semver tag, `latest`, or `main`. |
| `fail-on-diff` | `false` | For `run` / `update`: fail the job if files changed. |
| `go-version` | `1.24` | Go toolchain version. |

## Outputs

| Output | Description |
| --- | --- |
| `changed` | `"true"` if the chosen mode wrote (or would write) changes. |

## Scheduled update PR

```yaml
on:
  schedule: [{ cron: '0 9 * * 1' }]
  workflow_dispatch:
jobs:
  update:
    permissions: { contents: write, pull-requests: write }
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: gr1m0h/vimpin-action@v0.1.0
        id: vimpin
        with: { mode: update }
      - if: steps.vimpin.outputs.changed == 'true'
        uses: peter-evans/create-pull-request@v6
        with:
          title: "chore(deps): vimpin --update"
          branch: vimpin-update
```

## Versioning

The action versions independently from the CLI. Pin the action to a SHA
in production CI (`gr1m0h/vimpin-action@<sha>`) and let Renovate or
Dependabot keep it current.
