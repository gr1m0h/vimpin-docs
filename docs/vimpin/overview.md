---
sidebar_position: 1
title: Overview
---

# vimpin

> Pin Vim/Neovim plugin specs to explicit commit hashes.

[`gr1m0h/vimpin`](https://github.com/gr1m0h/vimpin) is a Go CLI that
rewrites your existing plugin spec files to pin every plugin to a
40-character commit hash, **inline**, while keeping a human-readable
annotation of the original tag or branch.

The approach extends the commit-pinning pattern that has become standard
for CI workflows (`actions/checkout@<sha>`, `pinact`, `ratchet`) to the
Lua spec files that Neovim plugin managers consume.

## Scope

vimpin aims to support the major Vim/Neovim plugin managers over time.

**Currently only `lazy.nvim` Lua specs are supported.**

## Why pin

`lazy.nvim` happily honours `commit = "..."` in your spec, but most people
never reach for that field because there is no good update story without
external tooling. So plugins stay on a floating HEAD (`:Lazy update` moves
them) or on a `tag = "..."` that lazy.nvim resolves at install time but
does not lock — both of which leave the supply chain undefended.

vimpin makes the commit the source of truth, written directly into the
Lua spec, with the original tag / branch preserved as a comment for both
humans and Renovate to read.

## Where the SHA is authoritative

The **commit SHA on disk is authoritative.** Once a spec is in canonical
form, vimpin will never change the SHA unless you explicitly ask via
`--update`. The annotation comment is a derived artefact: it records which
tag (or branch) the SHA was taken from. If the annotation drifts (someone
hand-edited it, or upstream rewrote a tag), `--verify` corrects the
annotation to match the SHA, never the other way around.

This is the foundation of vimpin's supply-chain story: **the only path
that moves an SHA forward is one the operator typed themselves.**

## Non-goals

- Replacing plugin managers — keep using `lazy.nvim`.
- Managing lazy-load configuration (`event`, `cmd`, `keys`) — vimpin only
  touches the pinning fields and the annotation comment.
- Cryptographic verification of commit contents.

## Next

- [Installation](./installation.md)
- [Quickstart](./quickstart.md)
- [Canonical form](./canonical-form.md)
- [Commands reference](./commands.md)
