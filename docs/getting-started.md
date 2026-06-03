---
sidebar_position: 2
title: Getting Started
---

# Getting Started

## 1. Pin your specs

```bash
go install github.com/gr1m0h/vimpin/cmd/vimpin@latest
vimpin run
```

`vimpin run` scans `lua/plugins/`, `lua/config/lazy.lua`, `init.lua`, and
`plugin/` by default and rewrites every `tag = "..."` / `branch = "..."`
into [canonical form](./vimpin/canonical-form.md):

```lua
{ "example/example.nvim", commit = "deadbeef...cafebabe" }, -- tag: v1.0.0
```

## 2. Gate CI on pinned specs

```yaml
# .github/workflows/vimpin.yml
on: pull_request
jobs:
  vimpin:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: gr1m0h/vimpin-action@v0.1.0
        with: { mode: verify-check }
```

See [vimpin-action](./vimpin-action.md) for other modes.

## 3. Let Renovate open update PRs

```json
{
  "$schema": "https://docs.renovatebot.com/renovate-schema.json",
  "extends": ["github>gr1m0h/vimpin-renovate-config"]
}
```

See [vimpin-renovate-config](./vimpin-renovate-config.md).
