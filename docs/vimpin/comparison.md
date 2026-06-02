---
sidebar_position: 7
title: Comparison
---

# Comparison with peer approaches

The three peer choices for keeping `lazy.nvim` plugin versions
reproducible — and how they differ from vimpin.

## Summary

| Approach | Locks? | Source of truth | Update flow |
| --- | --- | --- | --- |
| `lazy-lock.json` (lazy.nvim) | Records only | Last `:Lazy sync` | `:Lazy update` moves everything |
| Hand-written `commit = "..."` | Yes (commit pin) | The Lua spec | Nothing automated; manual edits |
| **vimpin** | Yes (commit pin) | **The SHA itself** | `--update` to bump; bots PR via Renovate |

## `lazy-lock.json`

`lazy.nvim`'s lockfile is **a record of what was last installed**, not a
constraint that's enforced on next install. The spec still drives:
`:Lazy update` moves your plugins to whatever `tag`, `branch`, or HEAD
the spec says, and writes the new SHAs back to the lockfile after the
fact.

That works fine for solo dotfiles where you trust your own
`:Lazy update`. It breaks down when:

- multiple machines or teammates share the same config and need to
  install the *same* SHAs
- you want Renovate to propose updates, because the lockfile is keyed by
  plugin short name (`telescope.nvim`) rather than `owner/repo`, so a
  Renovate manager cannot identify what to update

vimpin operates at the spec layer, so the canonical Lua file *is* the
contract — multi-machine and bot-friendly by construction.

## Hand-written `commit = "..."`

`lazy.nvim` accepts `commit = "<sha>"` in any spec, so in principle you
can hand-pin everything. In practice almost no one does, because:

1. **No update story.** Bumping requires manually running
   `git ls-remote`, copying SHAs, and tracking which tag each SHA
   corresponds to.
2. **No annotation.** A raw SHA tells you nothing about what version of
   the plugin you're on.
3. **No drift detection.** If upstream rewrites a tag, you have no way
   to know the SHA you've pinned no longer matches the human-readable
   version you wrote in a side comment.

vimpin solves all three by treating the canonical-form layout (with the
inline `-- tag:` / `-- branch:` annotation) as a first-class artifact
that tooling — both human and machine — can read.

## When vimpin is the wrong answer

vimpin is not the right tool if:

- **You use a plugin manager other than `lazy.nvim`.** Today the
  canonical form is `lazy.nvim`-specific. Support for other managers is
  on the roadmap but not in main.
- **You install all plugins via Nix or system packages.** Pinning then
  happens at the Nix layer; vimpin would not see those plugins at all.
- **You actively *want* a floating HEAD.** Some users prefer to track
  upstream `main` because they file issues upstream and want their bug
  reports against the very latest code. For that workflow, leave
  `branch = "main"` in field form and let `:Lazy update` move you.

## When vimpin is the right answer

You probably want vimpin if you:

- treat your dotfiles repo as production code
- want Renovate or Dependabot to propose plugin updates as PRs
- have ever been bitten by an upstream tag rewrite
- need reproducible installs across machines or teammates
- already pin GitHub Actions to SHAs and want the same hygiene for
  plugins
