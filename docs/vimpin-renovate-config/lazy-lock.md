---
sidebar_position: 4
title: lazy-lock.json support
---

# lazy-lock.json (with url augmentation)

The `:lazy-nvim-lock` sub-preset adds a Renovate manager for
`lazy-lock.json`. There is a meaningful precondition: **lockfile
entries must carry a `url` field**.

## Why `url` is required

`lazy-lock.json` is keyed by plugin **short name**, not `owner/repo`:

```json
{
  "telescope.nvim": {
    "branch": "master",
    "commit": "abc12345...ef012345"
  }
}
```

Given only `"telescope.nvim"`, Renovate cannot identify which
repository to query for new commits. `telescope.nvim` could be
`nvim-telescope/telescope.nvim`, or a fork, or an entirely unrelated
plugin that happens to share the short name.

The `:lazy-nvim-lock` preset works on lockfile entries that **also
carry a `url` field**:

```json
{
  "telescope.nvim": {
    "branch": "master",
    "commit": "abc12345...ef012345",
    "url": "https://github.com/nvim-telescope/telescope.nvim"
  }
}
```

With `url` present, Renovate has an unambiguous identifier and can
update both `commit` and (where relevant) `branch` atomically.

## Where `url` comes from

`lazy.nvim` emits `url` automatically for **non-default sources** (any
plugin specified via `url = "..."` in the spec). For default GitHub
plugins (specified as `"owner/repo"`), `lazy.nvim` does not write
`url` because it can rederive the URL from the short name at sync
time.

So out of the box, `lazy-lock.json` entries are roughly:

- Default-source plugins: `branch`, `commit` only → **invisible to
  Renovate**.
- Explicit-URL plugins: `branch`, `commit`, `url` → managed by the
  preset.

## Augmenting the lockfile

If you want Renovate to manage **every** entry in `lazy-lock.json`,
post-process the file once to add the missing `url` fields. A small
Lua snippet that walks `lazy.plugins()` and writes them back will do:

```lua
local lazy = require("lazy")
local json = vim.json

local lockfile_path = vim.fn.stdpath("config") .. "/lazy-lock.json"
local raw = vim.fn.readfile(lockfile_path)
local lock = json.decode(table.concat(raw, "\n"))

for _, plugin in ipairs(lazy.plugins()) do
  if lock[plugin.name] and not lock[plugin.name].url then
    lock[plugin.name].url = plugin.url
  end
end

vim.fn.writefile({ json.encode(lock) }, lockfile_path)
```

Run once, commit the result, and the `:lazy-nvim-lock` manager will
start picking up every entry.

## Should you bother?

For vimpin users, **the canonical Lua spec is the source of truth.**
`lazy-lock.json` is informational — it records what `:Lazy sync` last
installed, but the Lua spec (with `commit = "..."`) is what
`:Lazy install` reads to decide what to fetch.

So the `:lazy-nvim-lock` preset is mostly relevant to users who have
**not** yet adopted vimpin and want Renovate-driven updates against
the lockfile alone. Once you adopt vimpin, the `:lua-pin` preset is
sufficient — the lockfile becomes a regenerated derivative, not a
contract.

If you straddle both worlds (some plugins pinned in canonical form,
some only in `lazy-lock.json`), enabling both presets is safe — they
do not race because they match disjoint files.

## Caveats

- **`url` rewrites are not supported.** The preset updates `commit`
  and, for tag-tracking entries, the version-like field. It does not
  rewrite `url` itself.
- **Lockfile order is preserved as-is by Renovate.** Cosmetic changes
  to the file outside of the managed entry are also preserved.
