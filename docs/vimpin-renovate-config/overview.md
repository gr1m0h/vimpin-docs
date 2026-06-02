---
sidebar_position: 1
title: Overview
---

# vimpin-renovate-config

A [Renovate](https://docs.renovatebot.com/) preset for keeping Vim /
Neovim plugin pins up to date.

[`gr1m0h/vimpin-renovate-config`](https://github.com/gr1m0h/vimpin-renovate-config)
is built to consume [vimpin](../vimpin/overview.md)'s canonical Lua spec
form, but the managers work on **any Lua spec that follows the same
layout** — vimpin is not a requirement for using this preset.

## What it provides

Two custom Renovate managers, each shipped as a sub-preset:

| Sub-preset | Targets | When to use |
| --- | --- | --- |
| `:lua-pin` | `*.lua` plugin specs | `lazy.nvim` specs pinned in vimpin's canonical form. |
| `:lazy-nvim-lock` | `lazy-lock.json` | `lazy.nvim`'s lockfile, **augmented with `url` fields** (see [Lazy lock](./lazy-lock.md)). |

Extending the bare preset (`github>gr1m0h/vimpin-renovate-config`)
enables both.

## How updates land

For each matched entry, Renovate opens a PR that bumps the `commit`
value (`currentDigest`) and, where applicable, the annotation
(`currentValue`). Because both halves of the entry are captured in the
**same regex match**, they update together — drift between commit and
annotation is structurally impossible while Renovate is the sole
updater.

The actual checkout still happens through `lazy.nvim` — nothing in this
preset depends on how plugins are installed.

## Tag-tracking vs branch-tracking

- `-- tag: <ref>` → managed by the
  [`github-tags`](https://docs.renovatebot.com/modules/datasource/github-tags/)
  datasource. Renovate opens a PR whenever a newer tag exists on the
  upstream repo and atomically rewrites both the commit hash and the
  annotation.
- `-- branch: <name>` → managed by the
  [`git-refs`](https://docs.renovatebot.com/modules/datasource/git-refs/)
  datasource. Renovate opens a PR whenever the branch's HEAD moves and
  rewrites the commit hash; the annotation stays as-is (the branch name
  itself does not change).

The choice between tag-tracking and branch-tracking is made by the
human at pin time, in the `-- tag:` / `-- branch:` annotation. Renovate
respects whatever vimpin wrote.

## Why this preset over hand-rolled regex managers

You could write the same `customManagers` block in your own
`renovate.json`. The reasons to extend the preset instead:

1. **Canonical-form contract.** The regex matches exactly what vimpin
   emits. Local copies drift when the canonical form evolves; the
   preset stays in sync with each vimpin release.
2. **One source of truth.** Other consumers of the canonical form (the
   action, future tooling) all assume the same layout — having a single
   preset everyone references reduces ambient inconsistency.
3. **Tested regex.** The matchStrings the preset ships are exercised
   against real-world spec files and Renovate's regex semantics. A
   copy-pasted regex is one re-quote away from silently skipping every
   match.

## Next

- [Usage](./usage.md) — `extends` and sub-preset selection
- [Spec form](./spec-form.md) — what the `:lua-pin` regex requires
- [Lazy lock](./lazy-lock.md) — caveats of the `:lazy-nvim-lock` preset
- [Recommended config](./recommended-config.md) — a tuned Renovate
  config that survives 50+ plugins
- [Caveats](./caveats.md) — known limitations
