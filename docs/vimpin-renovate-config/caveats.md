---
sidebar_position: 6
title: Caveats
---

# Caveats

Known limitations and traps.

## Field order matters

`commit` must come **immediately** after the positional repo string. Custom
fields (`event`, `keys`, `opts`, `config = function()`) must come *after*
the commit, not before.

```lua
-- Renovate sees this:
{ "owner/repo", commit = "...", keys = { "x" } }   ✓

-- Renovate skips this:
{ "owner/repo", keys = { "x" }, commit = "..." }   ✗
```

Use `vimpin run` to enforce this layout automatically — it reorders fields
to put `commit` first.

## Annotation must follow commit on the same line

Comments placed elsewhere are silently ignored by the regex:

```lua
-- tag: v0.1.5                                          ✗ (above)
{ "owner/repo", commit = "..." },

{ "owner/repo", commit = "..." }, -- tag: v0.1.5        ✓ (Form A: after brace, same line)

{
  "owner/repo",
  commit = "...", -- tag: v0.1.5                        ✓ (Form B: trailing commit)
  keys = { "x" },
}

{
  "owner/repo",
  commit = "...",
  keys = { "x" },
}, -- tag: v0.1.5                                       ✗ (Form B: after brace)
```

## No HEAD-only tracking

Specs with neither a `-- tag:` nor a `-- branch:` annotation are
invisible to Renovate. **That is the supported way to say "do not update
this plugin":** pin the commit, omit the annotation.

```lua
-- Renovate will leave this alone forever:
{ "owner/repo", commit = "abc12345...ef012345" },
```

This is intentional. Removing the annotation is a one-character commit;
restoring it (via `vimpin run --verify` or by hand) is also easy. The
absence of an annotation conveys a clear human intent that the regex
can respect without ambiguity.

## `lazy-lock.json` requires `url`

Without a `url` field on each lockfile entry, Renovate cannot map the
short name back to a repository. See [Lazy lock](./lazy-lock.md) for
the augmentation script.

## Non-github.com hosts

Both the `:lua-pin` regex (via the `github-tags` datasource) and
`:lazy-nvim-lock` (via `git-refs`) currently target GitHub. Specs
referencing GitLab / Gitea / self-hosted remotes are silently skipped.

This will be revisited as vimpin gains non-github.com support; until
then, the supported workarounds are:

1. Mirror the upstream to GitHub (via Renovate or manually).
2. Use `-- vimpin:ignore` to suppress vimpin's pinning on those plugins
   and skip them in Renovate config explicitly.

## Renovate version

The custom managers use the modern
[`customManagers`](https://docs.renovatebot.com/configuration-options/#custommanagers)
format. Renovate 36+ is required (which is GitHub-hosted Renovate's
default). If you self-host an older Renovate, upgrade before adopting
the preset.

## URL-only plugins

Plugins declared without `owner/repo` form — e.g., `url = "https://..."`
or `dir = "..."` — are not matched by the `:lua-pin` regex. For local /
custom-URL plugins, the supported pattern is:

```lua
{ url = "https://...", dir = "...", commit = "..." }, -- vimpin:ignore
```

Manual update is required; this is by design (vimpin can't reasonably
resolve refs for an arbitrary URL today).
