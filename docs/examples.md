---
sidebar_position: 3
title: Examples
---

# Examples

Copy-paste-ready snippets for the most common scenarios. Pick the one
that matches your situation; each links into the in-depth docs for the
full context.

## CLI

### Pin a fresh dotfiles repo

```bash
# Inside your dotfiles repo
go install github.com/gr1m0h/vimpin/cmd/vimpin@latest
vimpin run                             # rewrite every spec to canonical form
git add -A && git commit -m "chore: pin lazy.nvim specs with vimpin"
```

→ See [CLI quickstart](./vimpin/quickstart.md).

### Bump everything to the latest tag

```bash
vimpin run --update
git diff lua/                          # review
git commit -am "chore: vimpin --update"
```

→ See [Commands → `--update`](./vimpin/commands.md#--update--bump-pinned-specs).

### Catch annotation drift after an upstream tag rewrite

```bash
vimpin run --verify                    # correct annotation; SHA stays
vimpin run --verify --check            # CI-friendly: exit non-zero on drift
```

→ See [Commands → `--verify`](./vimpin/commands.md#--verify--sha-is-the-source-of-truth).

### Fast offline pre-check in CI

```bash
vimpin run --no-api                    # structural check, no network
```

→ See [Commands → `--no-api`](./vimpin/commands.md#--no-api--offline-structural-check).

## GitHub Actions

### Required PR check (three orthogonal gates)

```yaml
jobs:
  vimpin:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: gr1m0h/vimpin-action@v0.1.0
        with: { mode: no-api }
      - uses: gr1m0h/vimpin-action@v0.1.0
        with: { mode: check }
      - uses: gr1m0h/vimpin-action@v0.1.0
        with: { mode: verify-check }
```

→ See [vimpin-action recipes](./vimpin-action/recipes.md#required-check-on-every-pr).

### Weekly update PR

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

→ See [vimpin-action recipes → scheduled PR](./vimpin-action/recipes.md#scheduled-update-pr).

### Custom Lua spec paths

```yaml
- uses: gr1m0h/vimpin-action@v0.1.0
  with:
    mode: verify-check
    paths: lua/extras/ lua/lazy/specs.lua
```

→ See [Inputs → `paths`](./vimpin-action/inputs.md#paths).

## Renovate

### Minimum setup

```json
{
  "$schema": "https://docs.renovatebot.com/renovate-schema.json",
  "extends": ["github>gr1m0h/vimpin-renovate-config"]
}
```

→ See [Renovate preset usage](./vimpin-renovate-config/usage.md).

### Tuned for 50+ plugins

```json
{
  "$schema": "https://docs.renovatebot.com/renovate-schema.json",
  "extends": [
    "config:recommended",
    "github>gr1m0h/vimpin-renovate-config"
  ],
  "dependencyDashboard": true,
  "prConcurrentLimit": 5,
  "prHourlyLimit": 2,
  "schedule": ["before 9am on monday"],
  "packageRules": [
    {
      "matchManagers": ["custom.regex"],
      "matchFileNames": ["**/*.lua"],
      "groupName": "vimpin-pinned",
      "addLabels": ["vimpin"]
    }
  ]
}
```

→ See [Recommended config](./vimpin-renovate-config/recommended-config.md).

### Single sub-preset

```json
{ "extends": ["github>gr1m0h/vimpin-renovate-config:lua-pin"] }
```

→ See [Usage → Picking a single sub-preset](./vimpin-renovate-config/usage.md#picking-a-single-sub-preset).

## Spec form

### Skip a plugin (escape hatch)

```lua
{ "internal/dev-plugin", dir = "~/code/plugin" }, -- vimpin:ignore
```

→ See [Quickstart → Opt out](./vimpin/quickstart.md#opt-out-individual-plugins).

### Freeze a plugin permanently (never update)

```lua
-- No -- tag: or -- branch: annotation = no updater will touch it.
{ "owner/repo", commit = "abc12345...ef012345" },
```

→ See [Caveats → No HEAD-only tracking](./vimpin-renovate-config/caveats.md#no-head-only-tracking).
