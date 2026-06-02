---
sidebar_position: 2
title: Quickstart
---

# Quickstart

The minimum viable workflow that turns the action into a required PR
check.

## Minimum workflow

```yaml
name: vimpin
on: pull_request
permissions:
  contents: read
jobs:
  vimpin:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: gr1m0h/vimpin-action@v0.1.0
        with:
          mode: verify-check
```

That single `uses:` step replaces the install-and-run pattern:

```yaml
# Without vimpin-action:
- uses: actions/setup-go@v5
  with: { go-version: '1.24' }
- run: go install github.com/gr1m0h/vimpin/cmd/vimpin@v0.1.0
- run: vimpin run --verify --check
```

## What `mode: verify-check` does

- Verifies the on-disk SHA still corresponds to the annotated tag on the
  upstream remote.
- Read-only: never writes files.
- Exits non-zero if any spec's annotation has drifted from its commit.

Mark the workflow as a required status check on `main` and your repo
will refuse to merge PRs that introduce — or fail to fix — pin drift.

## With path filters

Skip the workflow on PRs that touch no Lua specs:

```yaml
on:
  pull_request:
    paths:
      - 'lua/**/*.lua'
      - 'init.lua'
      - 'plugin/**/*.lua'
```

## With a stronger pin

For maximum supply-chain safety, pin the action to a commit SHA rather
than a tag. Renovate or Dependabot will keep it current:

```yaml
- uses: gr1m0h/vimpin-action@b0f298ab...ef902e04 # v0.1.0
```

## Next

- [Inputs](./inputs.md) — full input reference
- [Modes](./modes.md) — pick the right mode for your workflow
- [Recipes](./recipes.md) — required check, scheduled update, etc.
