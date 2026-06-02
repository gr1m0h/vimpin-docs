---
sidebar_position: 2
title: Canonical form
---

# Canonical form

Every Lua spec vimpin manages is rewritten into one of two shapes.

### Form A — single-line

```lua
{ "owner/repo", commit = "<40-hex>" }, -- tag: v0.1.5
```

### Form B — multi-line

```lua
{
  "owner/repo",
  commit = "<40-hex>", -- branch: main
  keys = { "x" },
  config = function() end,
}
```

## Two invariants

1. **`commit` is the only authoritative ref.** `tag = "..."` and
   `branch = "..."` field-form entries are removed.
2. **The annotation lives on the same line as the commit value.** This is
   how vimpin and Renovate know which upstream ref to track. Comments
   placed above the spec or after the closing brace of a multi-line spec
   are ignored.

## Tag vs branch

| Annotation | Update behaviour |
| --- | --- |
| `-- tag: <ref>` | `--update` bumps to the latest semver tag. |
| `-- branch: <name>` | `--update` bumps to the branch HEAD. |
| (none) | Frozen pin. Nothing will move it. |

## Source of truth

The **commit SHA on disk is authoritative**. `--verify` reverse-resolves
the SHA and corrects the annotation if it drifted (e.g., upstream tag
rewrite). The SHA itself only moves under `--update`.
