---
sidebar_position: 5
title: Recommended config
---

# Recommended companion config

The preset itself is policy-neutral — it adds custom managers but does
not set schedules or PR limits. Once the preset is matching dozens of
plugins, the default Renovate schedule produces a **PR storm**. This is
a reasonable starting point that survives 50+ plugins in scope.

## Starting point

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
    },
    {
      "matchPackageNames": ["LazyVim/LazyVim"],
      "groupName": "lazyvim-distribution",
      "schedule": ["before 9am on first monday of month"],
      "dependencyDashboardApproval": true
    }
  ]
}
```

## Why each knob

### `dependencyDashboard: true`

Gives you a single GitHub issue listing every pending update across all
managed plugins. Essential once 50+ plugins are in scope: without it,
the only way to see the full backlog is to scroll through open PRs.

### `prConcurrentLimit: 5`

Caps the open-PR backlog. Without this, a bulk bump (e.g., the day
after a LazyVim major release) can open 40+ PRs simultaneously, each
of which has to be reviewed individually.

### `prHourlyLimit: 2`

Smooths the PR arrival rate. Combined with `prConcurrentLimit`, it
prevents Renovate from saturating CI when the queue is long.

### `schedule: ["before 9am on monday"]`

Batches all PR creation into a weekly window. Mondays before 9am means
PRs are waiting when you start the week and CI has time to run before
you triage. Adjust to your team's rhythm.

### Grouping under `vimpin-pinned`

```json
{
  "matchManagers": ["custom.regex"],
  "matchFileNames": ["**/*.lua"],
  "groupName": "vimpin-pinned",
  "addLabels": ["vimpin"]
}
```

Collects all Lua-spec PRs under one label, so triage is "one filter,
N PRs" rather than "N PRs scattered across the firehose." Useful when
your repo also has other Renovate-managed dependencies (npm, Go
modules, etc.) that should stay ungrouped.

### Distribution-layer plugins (`LazyVim/LazyVim`)

```json
{
  "matchPackageNames": ["LazyVim/LazyVim"],
  "groupName": "lazyvim-distribution",
  "schedule": ["before 9am on first monday of month"],
  "dependencyDashboardApproval": true
}
```

Distribution-layer plugins like LazyVim aggregate dozens of upstream
specs. Bumping LazyVim itself can change behaviour across your entire
config, so:

- `dependencyDashboardApproval: true` — the PR doesn't open
  automatically. You explicitly tick a box on the dashboard issue
  first.
- `schedule: "first monday of month"` — cadence proportional to the
  blast radius.

Apply the same pattern to any other distribution-style plugin you
depend on (e.g., `nvim-lua/kickstart.nvim` if you use it as a base).

## Tune to your tolerance

This config errs on the side of low PR volume. Teams that prefer a
faster update cadence can:

- Drop `prConcurrentLimit` / `prHourlyLimit` entirely (default 10 / 2).
- Remove the `schedule` to update on Renovate's default near-real-time
  cadence.
- Drop the grouping so each plugin opens its own PR (better
  per-plugin review, more PR noise).

The preset itself stays neutral on these knobs so each consumer can
pick the trade-off that fits.
