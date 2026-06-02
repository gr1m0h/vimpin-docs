---
sidebar_position: 1
title: Overview
---

# vimpin

> Pin Vim/Neovim plugin specs to explicit commit hashes.

[`gr1m0h/vimpin`](https://github.com/gr1m0h/vimpin) is a Go CLI that
rewrites your `lazy.nvim` Lua specs so every plugin is pinned to a
40-character commit, with the original tag or branch preserved as an
inline comment.

## Install

```bash
go install github.com/gr1m0h/vimpin/cmd/vimpin@latest
```

Requires Go 1.24 and `git` on `$PATH`. vimpin shells out to
`git ls-remote` for ref resolution — it does not call the GitHub REST
API, so the 60 req/h unauthenticated REST quota does not apply.
Private-repo credentials piggyback on local git (`git credential`,
`gh auth setup-git`, SSH keys, …). Hosts other than `github.com` are
not yet supported.

## Why

`lazy.nvim` honours `commit = "..."` in any spec, but there's no built-in
update story so most users leave plugins on a floating HEAD or a
`tag = "..."` that resolves at install time but does not lock. vimpin
makes the **commit on disk** authoritative — the only path that moves
a SHA forward is `vimpin run --update` typed by the operator (or a
Renovate PR explicitly merged).

## Non-goals

- Replacing plugin managers — keep using `lazy.nvim`.
- Touching lazy-load configuration (`event`, `cmd`, `keys`).
- Cryptographic verification of commit contents.
