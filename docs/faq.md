---
sidebar_position: 99
title: FAQ
---

# FAQ

## Will this work with packer.nvim / vim-plug / dein.vim?

Not today. The canonical form is `lazy.nvim`-shaped and the rewriter
targets Lua specs in that layout.

Support for other plugin managers is a planned extension — track
progress on the
[vimpin issue tracker](https://github.com/gr1m0h/vimpin/issues).

## Does vimpin replace `lazy-lock.json`?

Effectively yes for users of vimpin.

`lazy-lock.json` is `:Lazy sync`'s record of what it last installed.
With vimpin, the canonical Lua spec on disk is what
`:Lazy install` reads to decide what to fetch — the lockfile becomes
a regenerated derivative.

If you also want Renovate to manage `lazy-lock.json` itself (e.g.,
during a transition period), the [`:lazy-nvim-lock`
preset](./vimpin-renovate-config/lazy-lock.md) is available. Its
caveats are documented.

## Why not just use `lazy.nvim`'s `version = "..."` constraint?

`version = "..."` resolves at install time but doesn't lock. Two
machines installing on different days can land on different commits.

vimpin's `commit = "..."` produces bit-for-bit reproducibility across
machines and across time — at the cost of needing a mechanism (`vimpin
--update`, Renovate) to bump it.

## What happens if upstream deletes a tag?

`vimpin run --verify` will detect that no tag points at the SHA
anymore and clear the tag part of the annotation (or leave a comment
noting the absence — exact behaviour evolves; check the CLI's `--verify`
output).

The SHA itself stays valid as long as upstream hasn't garbage-collected
the commit, which GitHub effectively doesn't do for commits referenced
by anything else.

## What happens if upstream rewrites a tag?

The SHA on disk is unchanged. The annotation is now incorrect.
`vimpin run --verify` will either rewrite the annotation to a tag that
now matches the SHA (if one exists), or clear the tag annotation.

This is the supply-chain-defence sweet spot:
- You're still installing the SHA you originally vetted.
- CI flags the drift via `verify-check`, so you know an upstream
  rewrite happened.
- You can decide whether to follow the rewrite (`vimpin run --update`
  to bump to the new tag's SHA) or stay put.

## How is this different from `pinact` for plugins?

Same idea, different surface.

`pinact` rewrites GitHub Actions `uses: actions/checkout@v4` to
`uses: actions/checkout@<sha> # v4`. vimpin rewrites `lazy.nvim` Lua
specs to a canonical form with `commit = "<sha>"` and a `-- tag: v0.1.5`
annotation.

The design is intentionally analogous so that anyone familiar with
pinact can pick up vimpin without re-learning the model.

## Can I use vimpin without GitHub Actions / Renovate?

Yes. vimpin is a standalone CLI. Run it locally as part of your
dotfiles maintenance:

```bash
vimpin run --update          # bump everything
git diff lua/                # review
git commit -am "chore: vimpin update"
```

The action and Renovate preset are wrappers that automate the CI side
of the story. They are optional.

## Does `--update` follow major version bumps?

Yes — `--update` follows the latest semver tag, regardless of major
version. If you want to stay on `v1.x.y` while upstream releases
`v2.0.0`, the supported pattern today is to use `-- vimpin:ignore` on
the spec and bump manually. Per-spec version constraint expressions
are a candidate roadmap item.

## What if I want some plugins on a tag and some on a branch?

That's the supported case. vimpin reads each spec's existing field
form to pick the annotation:

- `tag = "v0.1.5"` → `-- tag: v0.1.5` annotation
- `branch = "main"` → `-- branch: main` annotation

You can mix and match across plugins in the same config. The
`--update` mode bumps tag-annotated specs to the latest semver tag and
branch-annotated specs to the current branch HEAD.

## How big does my config have to be for this to matter?

The supply-chain argument applies starting at one plugin. The
operational argument (PR storm management, dependency dashboard, etc.)
starts mattering around 20-30 plugins.

For a five-plugin config, manual `vimpin run --update` once a month is
plenty.

For a fifty-plugin LazyVim-based config, the CI / Renovate setup
described in [CI setup](./guides/ci-setup.md) is closer to mandatory.

## Where do I report bugs?

| Component | Where to file |
| --- | --- |
| Pinning behaviour, rewriter, CLI flags | [`gr1m0h/vimpin`](https://github.com/gr1m0h/vimpin/issues) |
| GitHub Action surface | [`gr1m0h/vimpin-action`](https://github.com/gr1m0h/vimpin-action/issues) |
| Renovate preset regex / managers | [`gr1m0h/vimpin-renovate-config`](https://github.com/gr1m0h/vimpin-renovate-config/issues) |
| This documentation | [`gr1m0h/vimpin-docs`](https://github.com/gr1m0h/vimpin-docs/issues) |

When in doubt, file against `vimpin` and we'll re-route.
