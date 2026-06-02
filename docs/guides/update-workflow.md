---
sidebar_position: 2
title: Update workflows
---

# Update workflows

Three ways to bump pinned specs to current upstream versions. Each has a
different shape and different trade-offs.

| Approach | PR shape | Cadence | Granularity | Trust assumption |
| --- | --- | --- | --- | --- |
| **Manual** (`vimpin run --update`) | None — local | On demand | All-or-nothing | You're at the keyboard. |
| **Scheduled action** (`vimpin-action mode: update`) | One PR for all changes | Weekly cron | All-or-nothing | You trust a batched review. |
| **Renovate preset** | One PR per plugin | Whenever upstream moves | Per-plugin | You trust per-plugin reviews. |

Pick one — they will race if you enable both the scheduled action and
Renovate.

## Manual updates

For dotfiles you maintain in person:

```bash
cd ~/dotfiles
vimpin run --update           # bump everything
git diff lua/plugins/         # review
git commit -am "chore: vimpin --update"
```

This is the right cadence for a personal config where you'd prefer to
review changes synchronously, e.g., as part of a weekly maintenance
ritual.

To bump only a subset:

```bash
vimpin run --update lua/plugins/treesitter.lua
```

The argument is forwarded to vimpin's path discovery — narrowing the
scope narrows what gets bumped.

## Scheduled action workflow

The "one batched PR per week" approach. The full workflow is in
[CI setup → Scheduled update workflow](./ci-setup.md#2-scheduled-update-workflow);
the high-level shape is:

```yaml
on:
  schedule:
    - cron: '0 9 * * 1'  # Monday morning
  workflow_dispatch:

jobs:
  update:
    steps:
      - uses: actions/checkout@v4
      - uses: gr1m0h/vimpin-action@v0.1.0
        id: vimpin
        with: { mode: update }
      - if: steps.vimpin.outputs.changed == 'true'
        uses: peter-evans/create-pull-request@v6
        with: { title: "chore(deps): vimpin --update" }
```

**When this is right:**
- Solo dotfiles or small-team config.
- You want low PR noise.
- You trust `--update`'s semver semantics (latest tag wins).
- Reverting one plugin from a bulk PR is acceptable to you.

**When this is wrong:**
- Plugin churn is high enough that you want per-plugin context in the
  PR description.
- You need fine-grained groupings (e.g., colorscheme plugins on a
  different schedule than LSP plugins).
- Multiple humans are reviewing the dotfiles and want to assign
  per-plugin reviewers.

## Renovate

The "one PR per plugin" approach via
[`vimpin-renovate-config`](../vimpin-renovate-config/overview.md):

```json
{
  "$schema": "https://docs.renovatebot.com/renovate-schema.json",
  "extends": [
    "config:recommended",
    "github>gr1m0h/vimpin-renovate-config"
  ]
}
```

**When this is right:**
- Team config where per-plugin review matters.
- You want grouping and scheduling controls (see
  [Recommended config](../vimpin-renovate-config/recommended-config.md)).
- You already use Renovate for other dependencies and want the same
  triage workflow.

**When this is wrong:**
- You don't want to install Renovate (it's a GitHub App; some orgs
  restrict).
- A 50-plugin dotfiles repo will generate a steady trickle of PRs; if
  PR fatigue is a concern, the batched workflow is gentler.

## Branch-tracked specs

`-- branch:` annotated specs deserve a moment of thought: they bump on
**every upstream commit**, not on every upstream tag. If a plugin's
default branch sees frequent commits, you'll see frequent updates.

Options:

1. **Re-pin to a tag** — `vimpin run --update` will move a `-- tag:`
   annotated spec to the latest semver tag.
2. **Use `dependencyDashboardApproval`** for noisy branch-tracked
   plugins in your Renovate config — they show up on the dashboard
   for explicit approval before a PR opens.
3. **Drop to a frozen pin** — remove the annotation, accept that the
   plugin won't update until you re-annotate.

## Combining update + PR-gate

Both approaches assume the [PR-gate workflow](./ci-setup.md) is in
place. When the scheduled / Renovate PR opens, it will go through the
same `check` / `no-api` / `verify-check` gauntlet. Because vimpin's
`--update` and Renovate's preset both produce canonical form output,
the gate stays green on update PRs by construction.

If you see a `verify-check` failure on a Renovate PR, that's a real
bug — file an issue against `vimpin-renovate-config` with the
offending spec and the upstream tag.
