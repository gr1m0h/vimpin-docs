---
sidebar_position: 2
title: Usage
---

# Usage

Add the preset to your dotfiles repo's `renovate.json`:

```json
{
  "$schema": "https://docs.renovatebot.com/renovate-schema.json",
  "extends": ["github>gr1m0h/vimpin-renovate-config"]
}
```

The bare preset enables every supported manager (currently `:lua-pin`
and `:lazy-nvim-lock`).

## Picking a single sub-preset

To pull in only one of the managers, extend the sub-preset directly:

```json
{
  "$schema": "https://docs.renovatebot.com/renovate-schema.json",
  "extends": ["github>gr1m0h/vimpin-renovate-config:lua-pin"]
}
```

| Sub-preset | What it enables | Use when |
| --- | --- | --- |
| `:lua-pin` | `*.lua` plugin spec regex manager | You only manage canonical-form Lua specs (the common case). |
| `:lazy-nvim-lock` | `lazy-lock.json` regex manager | You also want `lazy-lock.json` Renovate-managed. Requires `url` fields — see [Lazy lock](./lazy-lock.md). |

In the common case you want both — extend the bare preset and skip the
selection.

## Combined with a Renovate base config

The preset is **policy-neutral**: it adds custom managers but does not
set schedules, concurrent-PR limits, or grouping. Combine it with
`config:recommended` (or your team's house base config):

```json
{
  "$schema": "https://docs.renovatebot.com/renovate-schema.json",
  "extends": [
    "config:recommended",
    "github>gr1m0h/vimpin-renovate-config"
  ]
}
```

For a production-grade configuration that handles 50+ plugins without
PR storms, see [Recommended config](./recommended-config.md).

## Where the preset lives

The preset files are public JSON in
[`gr1m0h/vimpin-renovate-config`](https://github.com/gr1m0h/vimpin-renovate-config):

- `default.json` — extends both sub-presets
- `lua-pin.json` — the canonical-form Lua spec manager
- `lazy-nvim-lock.json` — the `lazy-lock.json` manager

Renovate's `github>` extends syntax fetches these directly. No
GitHub App permission is required to **consume** the preset; it is just
a public file fetch.
