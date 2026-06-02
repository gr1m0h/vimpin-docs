---
sidebar_position: 3
title: Quickstart
---

# Quickstart

The five-minute introduction. For a tour spanning all three tools in the
family, see [Getting Started](../getting-started.md).

## Install

```bash
go install github.com/gr1m0h/vimpin/cmd/vimpin@latest
```

## Pin a spec

Starting point — a normal `lazy.nvim` spec with a tag or branch hint:

```lua
-- lua/plugins/example.lua
return {
  { "ggandor/leap.nvim", tag = "v0.1.5" },
  {
    "folke/which-key.nvim",
    branch = "main",
    keys = { "<leader>" },
  },
}
```

Resolve every tag / branch to a commit and write it back inline:

```bash
vimpin run
```

Same file, now pinned and annotated:

```lua
return {
  { "ggandor/leap.nvim", commit = "8a40d3aa...07b9079b" }, -- tag: v0.1.5
  {
    "folke/which-key.nvim",
    commit = "3aab2147...0a44c15a", -- branch: main
    keys = { "<leader>" },
  },
}
```

:::note
Commit hashes are elided with `...` in the docs for readability. On disk
the full 40-character SHA that `git ls-remote` returns is stored.
:::

## Gate CI on every PR

```bash
vimpin run --check
```

The `--check` flag turns vimpin into a read-only verifier: exit code 0 if
every spec is already canonical, non-zero otherwise. Wire this into a PR
workflow and any unpinned spec produces a red check.

For the GitHub Actions equivalent in a single step, see
[vimpin-action quickstart](../vimpin-action/quickstart.md).

## Paths

Without arguments, `vimpin run` scans the **LazyVim default layout**:

- `lua/plugins/`
- `lua/config/lazy.lua`
- `init.lua`
- `plugin/`

To target a different layout, pass paths explicitly:

```bash
vimpin run lua/extras/  config/lazy/specs.lua
```

## Opt out individual plugins

Append `-- vimpin:ignore` to any spec to skip it under every mode:

```lua
{ "internal/dev-plugin", dir = "~/code/plugin" }, -- vimpin:ignore
```

This is the supported escape hatch for local plugins, plugins you do not
want managed, or temporary experiments.

## Next

- [Canonical form](./canonical-form.md) — the contract every spec must satisfy
- [Commands](./commands.md) — `--verify`, `--update`, `--no-api`, `--check`
- [Authentication](./authentication.md) — private repos and rate limits
