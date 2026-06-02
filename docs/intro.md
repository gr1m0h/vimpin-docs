---
sidebar_position: 1
slug: /intro
title: Introduction
---

# Introduction

The **vimpin family** pins Vim/Neovim plugin specs to explicit commit hashes,
the same way you already pin GitHub Actions to a SHA.

| Project | What it is |
| --- | --- |
| [**vimpin**](./vimpin/overview.md) | Go CLI that rewrites Lua plugin specs to canonical pinned form. |
| [**vimpin-action**](./vimpin-action.md) | GitHub Action wrapper around the CLI. |
| [**vimpin-renovate-config**](./vimpin-renovate-config.md) | Renovate preset that opens update PRs for pinned specs. |

**Scope:** `lazy.nvim` Lua specs only.

Start with [Getting Started](./getting-started.md) for a five-minute tour
that touches all three.
