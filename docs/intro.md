---
sidebar_position: 1
slug: /intro
title: Introduction
---

# Introduction

The **vimpin** family is a small set of tools that brings the commit-pinning
pattern — long standard for CI workflows — to **Vim and Neovim plugin
specs**.

Most Neovim users today let their plugin manager track a floating `HEAD` or a
mutable `tag`. That leaves the plugin supply chain undefended: any compromise
on the upstream side propagates the next time the manager syncs. vimpin
collapses that gap by making **the commit SHA itself the authoritative
source of truth**, written directly into the plugin spec on disk.

## The family

The three projects share a single design: **vimpin emits a canonical spec
form, and every other tool either produces or consumes that form.**

| Project | What it is | Lives in |
| --- | --- | --- |
| [**vimpin**](./vimpin/overview.md) | Go CLI that rewrites Lua plugin specs to canonical form. | `gr1m0h/vimpin` |
| [**vimpin-action**](./vimpin-action/overview.md) | GitHub Action that runs the CLI in CI without boilerplate. | `gr1m0h/vimpin-action` |
| [**vimpin-renovate-config**](./vimpin-renovate-config/overview.md) | Renovate preset that opens update PRs for canonical specs. | `gr1m0h/vimpin-renovate-config` |

Each can be used in isolation, but together they form a closed loop:
**vimpin pins → Renovate proposes updates → vimpin-action gates the result
in CI.**

## Why pin Lua plugin specs?

`lazy.nvim` accepts `commit = "<sha>"` in any plugin spec and will honour it
verbatim. In practice almost no one writes that field, because:

1. There is no good update story without external tooling.
2. The lockfile (`lazy-lock.json`) is keyed by plugin short name and is not
   amenable to bot-friendly updates.
3. A `tag = "..."` looks like pinning but is resolved at install time and is
   not locked: a maintainer rewriting a tag silently rotates what you fetch.

vimpin makes the commit the source of truth, with the original tag or branch
preserved as an inline comment for both humans and Renovate to read.

## Scope

**Today:** `lazy.nvim` Lua specs only.

**Future:** the canonical-form approach generalises to other plugin
managers; support will be added as demand and contributions arrive. Until
then, treat the docs as `lazy.nvim`-specific.

## Where to next

- New here? Start with [Getting Started](./getting-started.md) for a
  five-minute tour that touches all three projects.
- Looking for a single piece of reference? Use the sidebar — each project
  has its own section.
- Trying to wire everything up in CI? Jump to
  [Guides → CI setup](./guides/ci-setup.md).
