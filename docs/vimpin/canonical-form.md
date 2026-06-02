---
sidebar_position: 4
title: Canonical form
---

# Canonical form

Every Lua spec that vimpin manages is rewritten into one of two shapes.
Both shapes obey the same invariants, which downstream tools (the action,
the Renovate preset, hand-edits) can rely on without ambiguity.

## The two shapes

### Form A — single-line spec

```lua
{ "owner/repo", commit = "<40-hex>" }, -- tag: v0.1.5
```

Used when the spec carries no additional fields beyond the pinning info.

### Form B — multi-line spec

```lua
{
  "owner/repo",
  commit = "<40-hex>", -- branch: main
  keys = { "x" },
  config = function() end,
}
```

Used when the spec carries `keys`, `event`, `opts`, `config = function()`,
or any other configuration field. The annotation comment **trails the
commit field**, not the closing brace.

## Invariants

Two invariants hold across both forms:

### 1. `commit` is the only authoritative ref

`lazy.nvim` uses it directly. Any `tag = "..."` or `branch = "..."` field
that was present in the field-form spec is **removed** by `vimpin run`.
Keeping them would be a divergence vector — two fields each claiming to
identify the same revision.

### 2. The annotation lives on the same line as the commit value

This is how vimpin (and the Renovate preset) knows which upstream ref to
track on subsequent runs. The annotation must immediately follow the
commit value with a single space and the `--` comment marker:

```lua
commit = "8a40d3aa...07b9079b", -- tag: v0.1.5
```

Comments placed elsewhere — above the spec, after the closing brace of a
multi-line spec, or on the repo string line — are **ignored** by both
vimpin and Renovate.

## Tag vs branch annotations

| Annotation | Semantics | Updater behaviour |
| --- | --- | --- |
| `-- tag: <ref>` | Track a specific upstream tag. | `vimpin run --update` bumps to the latest semver tag; Renovate opens a PR per new tag. |
| `-- branch: <name>` | Track a moving branch. | `vimpin run --update` bumps to the current branch HEAD; Renovate opens a PR whenever HEAD advances. |
| (no annotation) | Frozen pin. | Neither vimpin nor Renovate will move it. The supported way to say "never update this." |

## Why same-line annotation

The annotation lives on the same line as the commit so the Renovate
regex never has to span a newline between the commit and its tag. That
matters in three ways:

1. **Atomicity** — Renovate captures both halves in a single regex match,
   so a PR cannot bump the commit without also rewriting the annotation.
2. **Drift detection** — `vimpin run --verify` can reverse-resolve the
   SHA on the remote and compare against the inline annotation in one
   pass.
3. **Hand-edit safety** — a developer manually editing the file sees the
   pinned tag adjacent to the SHA. There is no "look elsewhere for the
   semantic version" round-trip.

## What gets removed

- `tag = "..."` — superseded by the annotation.
- `branch = "..."` — superseded by the annotation.
- `version = "..."` — `lazy.nvim` semver constraint; vimpin does not
  manage this. If present, it is left untouched, but **`version` and
  `commit` together can produce ambiguous behaviour**; pick one.

## What stays

Anything that is not a pinning field. `keys`, `event`, `cmd`, `opts`,
`config`, `init`, `dir`, etc. all pass through unchanged. vimpin does
not parse or reformat configuration code.

## What if I edit by hand?

Two outcomes are possible:

1. You preserve the canonical form → vimpin treats your edit as the new
   ground truth.
2. You break the form (move the annotation off-line, drop the comment,
   put `tag` back) → `vimpin run` will rewrite back to canonical form on
   the next run. No data is lost; the rewrite is mechanical.

The contract is: **disk wins as long as the form is canonical.** vimpin's
job is to enforce the form, not to second-guess the values.
