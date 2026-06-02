---
sidebar_position: 5
title: Modes
---

# Modes

The action's `mode` input picks one of six entry points. Each maps
1:1 to a CLI flag combination — see the [CLI commands reference](../vimpin/commands.md)
for the underlying semantics.

| Mode | Underlying CLI | What it does |
| --- | --- | --- |
| `run` | `vimpin run` | Initial pin (field form → canonical). No-op on already-canonical specs. |
| `check` | `vimpin run --check` | Read-only. Exits non-zero if anything would change. |
| `verify` | `vimpin run --verify` | Reverse-resolves SHA, rewrites annotation if it drifted. SHA stays. |
| `verify-check` | `vimpin run --verify --check` | Read-only verify. Reports drift, exits non-zero. |
| `update` | `vimpin run --update` | Bumps each spec to the latest semver tag (or branch HEAD). |
| `no-api` | `vimpin run --no-api` | Offline structural check. No network. |

## Picking the right mode for the job

### "Block PRs that introduce unpinned specs"

```yaml
mode: check
```

A PR that adds a new plugin without running `vimpin run` first will fail
the check. Fast, network-free **after** vimpin completes — the check
needs to resolve refs once to know what canonical form would look like
unless every spec is already canonical.

### "Block PRs structurally invalid"

```yaml
mode: no-api
```

Offline. Asserts every spec has a `commit = "<40-hex>"` field and an
annotation. Cheapest possible CI gate — useful as the first step in a
multi-step verification workflow.

### "Block PRs with drifted annotations"

```yaml
mode: verify-check
```

Catches the case where the SHA on disk no longer matches the upstream
tag listed in the annotation. Almost always caused by an upstream
maintainer rewriting a tag after vimpin first resolved it.

### "Apply pins on a feature branch"

```yaml
mode: run
fail-on-diff: false   # default — write and commit in a follow-up step
```

You probably want to combine this with a `git commit` step inside the
same job. Otherwise the writes happen on the runner and are discarded.

### "Open a PR with the latest plugin versions"

```yaml
mode: update
```

Pair with `peter-evans/create-pull-request` — see
[Recipes → Scheduled update PR](./recipes.md#scheduled-update-pr).

## Combining modes in one workflow

The three read-only modes are designed to layer:

```yaml
- uses: gr1m0h/vimpin-action@v0.1.0
  with: { mode: check }          # unpinned specs ⇒ red
- uses: gr1m0h/vimpin-action@v0.1.0
  with: { mode: no-api }         # structural problem ⇒ red (offline, fast)
- uses: gr1m0h/vimpin-action@v0.1.0
  with: { mode: verify-check }   # SHA ↔ annotation drift ⇒ red
```

All three together are roughly five seconds of CI on a typical
50-plugin dotfiles repo, and they catch three orthogonal failure modes
that `check` alone would miss.
