---
sidebar_position: 3
title: Commands
---

# Commands

```text
vimpin run [PATHS...] [FLAGS]
```

With no `PATHS`, vimpin scans `lua/plugins/`, `lua/config/lazy.lua`,
`init.lua`, `plugin/`.

## Modes

`--verify`, `--update`, `--no-api` are mutually exclusive. `--check`
combines with any of them (or runs alone).

| Flag | What it does |
| --- | --- |
| _(none)_ | Pin field-form specs to [canonical form](./canonical-form.md). No-op on already-canonical specs. |
| `--verify` | Reverse-resolve each SHA; rewrite the annotation if it drifted. SHA stays. Branch-annotated specs are skipped (no meaningful reverse lookup). |
| `--update` | Bump each spec to the latest semver tag (or branch HEAD). The only mode that moves a SHA forward. |
| `--no-api` | Offline structural check: every spec must have a 40-hex commit and a `-- tag:` / `-- branch:` annotation. |
| `--check` | Do not write; exit non-zero if anything would change. |

## Escape hatch

Append `-- vimpin:ignore` to skip a spec in every mode:

```lua
{ "internal/dev-plugin", dir = "~/code/plugin" }, -- vimpin:ignore
```
