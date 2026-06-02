---
sidebar_position: 5
title: vimpin-renovate-config
---

# vimpin-renovate-config

Renovate preset that opens update PRs for [canonical-form](./vimpin/canonical-form.md)
plugin specs.

## Usage

```json
{
  "$schema": "https://docs.renovatebot.com/renovate-schema.json",
  "extends": ["github>gr1m0h/vimpin-renovate-config"]
}
```

The bare preset enables both sub-presets below. To enable only one,
extend it directly (`github>gr1m0h/vimpin-renovate-config:lua-pin`).

| Sub-preset | Target | Datasource |
| --- | --- | --- |
| `:lua-pin` | `*.lua` plugin specs in canonical form | `github-tags` (tag-tracked) / `git-refs` (branch-tracked) |
| `:lazy-nvim-lock` | `lazy-lock.json` entries with `branch`, `commit`, `url` fields | `git-refs` — recognises `github.com`, `gitlab.com`, `git.sr.ht` |

## How updates land

For each match, Renovate opens a PR that bumps the commit hash and (for
tag-tracked entries) rewrites the annotation in the **same** regex match
— so commit ↔ annotation drift is structurally impossible while
Renovate is the sole updater.

## Constraints

- **`commit` is the first field after the repo string.** Custom fields
  (`keys`, `event`, `opts`, `config = function()`) must come *after* the
  commit. `vimpin run` enforces this layout automatically.
- **Specs without an annotation are invisible to Renovate.** That's the
  supported way to say "never update this plugin".
- **`lazy-lock.json` needs a `url` field per entry.** `lazy.nvim` does
  not emit `url` for default GitHub plugins, so the lockfile manager is
  most useful for non-default sources or for users who post-process the
  lockfile.
