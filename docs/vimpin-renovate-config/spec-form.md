---
sidebar_position: 3
title: Supported spec form
---

# Supported Lua spec form

The `:lua-pin` manager looks for entries shaped like vimpin's canonical
output. Both forms are recognised; commit hashes are abbreviated with
`...` in the docs for readability.

## Form A — single-line

```lua
{ "ggandor/leap.nvim", commit = "8a40d3aa...07b9079b" }, -- tag: v0.1.5
```

## Form B — multi-line

```lua
{
  "folke/which-key.nvim",
  commit = "3aab2147...0a44c15a", -- branch: main
  keys = { "<leader>" },
  config = function() end,
}
```

## Two invariants that must hold

For Renovate to pick up an entry, **both** of these must be true:

### 1. `commit` is the first field after the repo string

Between the closing quote of the repo string (`"owner/repo"`) and the
start of `commit = "..."` there may be only whitespace (including
newlines) and the comma separator. **No other fields belong in that
slot.**

Valid:

```lua
{ "owner/repo", commit = "..." }                              ✓
{ "owner/repo",
  commit = "...",                                              ✓
  keys = { "x" },
}
```

Invalid (Renovate will skip the entry):

```lua
{ "owner/repo", lazy = true, commit = "..." }                  ✗
{ "owner/repo", keys = { "x" }, commit = "..." }               ✗
```

The fix: re-run `vimpin run` — it enforces this field order
automatically.

### 2. The annotation is on the same line as the commit value

For Form A, the annotation trails the closing `},`. For Form B, the
annotation trails the commit field's value directly.

Either way the regex never has to span a newline between the commit
and its annotation:

```lua
commit = "8a40d3aa...07b9079b", -- tag: v0.1.5     ✓ (Form A or B)
```

Invalid layouts (the entry is silently skipped):

```lua
-- tag: v0.1.5                                       ✗ (annotation above)
{ "owner/repo", commit = "8a40d..." },

{
  "owner/repo",
  commit = "8a40d...",
  keys = { "x" },
}, -- tag: v0.1.5                                    ✗ (annotation after brace)
```

## What the regex captures

Internally, the `:lua-pin` manager declares a Renovate
[`customManagers`](https://docs.renovatebot.com/configuration-options/#custommanagers)
entry that:

1. Matches the canonical-form layout shown above with a regex.
2. Extracts `depName` from the repo string (e.g., `ggandor/leap.nvim`).
3. Extracts `currentDigest` from the commit field (the 40-hex SHA).
4. Extracts `currentValue` from the annotation (e.g., `v0.1.5` or
   `main`).
5. Picks `datasourceTemplate` based on `tag:` vs `branch:`:
   - `tag:` → `github-tags`
   - `branch:` → `git-refs`

When Renovate finds a newer matching ref upstream, it rewrites both the
`commit = "..."` value and the annotation in a single PR.

## Hand-editing safety

If you edit a spec by hand:

- **Keep the field order** (`commit` first after the repo string).
- **Keep the annotation on the commit's line.**

If either invariant breaks, Renovate silently skips the entry — it
will not break your build, but updates will stop arriving until the
next `vimpin run` restores the canonical form.

## What the regex does *not* match

- Plugins without an annotation (no `-- tag:` or `-- branch:`) — these
  are intentionally invisible to Renovate. That's the supported way to
  say "never update this plugin": pin the commit, omit the annotation.
- Plugins specified by URL (`url = "https://..."`) instead of
  `owner/repo` — not yet supported.
- Non-Lua specs — the preset is `lazy.nvim`-shaped today.
