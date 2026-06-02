---
sidebar_position: 2
title: Getting Started
---

# Getting Started

A five-minute tour. By the end you will have:

1. Installed `vimpin` and pinned an example spec.
2. Wired `vimpin-action` as a required CI check on PRs.
3. Extended Renovate with `vimpin-renovate-config` so updates land as PRs.

## 1. Install vimpin and pin a spec

```bash
go install github.com/gr1m0h/vimpin/cmd/vimpin@latest
```

Create a sample `lazy.nvim` spec with a tag hint:

```bash
mkdir -p lua/plugins
cat > lua/plugins/example.lua <<'LUA'
return {
  { "ggandor/leap.nvim", tag = "v0.1.5" },
  {
    "folke/which-key.nvim",
    branch = "main",
    keys = { "<leader>" },
  },
}
LUA
```

Resolve every tag / branch to a commit and write it back:

```bash
vimpin run
```

Inspect the result:

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

This shape is the [**canonical form**](./vimpin/canonical-form.md). Every
downstream tool in the family — the action, the Renovate preset — assumes
this layout.

## 2. Gate CI with vimpin-action

Add `.github/workflows/vimpin.yml`:

```yaml
name: vimpin
on:
  pull_request:
    paths:
      - 'lua/**/*.lua'
      - 'init.lua'
permissions:
  contents: read
jobs:
  vimpin:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: gr1m0h/vimpin-action@v0.1.0
        with:
          mode: check
      - uses: gr1m0h/vimpin-action@v0.1.0
        with:
          mode: no-api
      - uses: gr1m0h/vimpin-action@v0.1.0
        with:
          mode: verify-check
```

Three orthogonal checks:

- `check` — any spec that vimpin would rewrite is still in field form.
- `no-api` — offline structural check (no commit field, no annotation).
- `verify-check` — the SHA still points at the annotated tag upstream.

Mark the workflow as a required status check on `main` in your repository
settings. See [Guides → CI setup](./guides/ci-setup.md) for the full
recipe, including a scheduled update workflow.

## 3. Hand updates to Renovate

Add `renovate.json` to your dotfiles repo:

```json
{
  "$schema": "https://docs.renovatebot.com/renovate-schema.json",
  "extends": [
    "config:recommended",
    "github>gr1m0h/vimpin-renovate-config"
  ]
}
```

That single `extends` enables both custom managers shipped by the preset
([`lua-pin`](./vimpin-renovate-config/spec-form.md) and
[`lazy-nvim-lock`](./vimpin-renovate-config/lazy-lock.md)). Renovate will
open PRs that bump the commit hash and rewrite the annotation atomically.

For a tuned configuration that survives 50+ plugins, see
[Recommended config](./vimpin-renovate-config/recommended-config.md).

## What you've built

```
       hand edit / new plugin
                │
                ▼
        ┌──────────────┐
        │   vimpin run │  ← initial pin (field-form → canonical)
        └──────┬───────┘
               │ canonical
               ▼
        ┌──────────────┐
        │ vimpin-action│  ← CI gate (check / no-api / verify-check)
        └──────┬───────┘
               │ merged to main
               ▼
        ┌──────────────┐
        │   Renovate   │  ← opens PRs (commit + annotation in lockstep)
        └──────────────┘
```

The full reasoning behind this loop lives in
[Guides → Supply-chain story](./guides/supply-chain.md).
