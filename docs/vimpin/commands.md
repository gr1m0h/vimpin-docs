---
sidebar_position: 5
title: Commands
---

# Commands

vimpin exposes a single `run` subcommand whose mode is selected by flags.

```text
vimpin run [PATHS...] [FLAGS]
```

With no `PATHS`, vimpin scans the LazyVim default layout:
`lua/plugins/`, `lua/config/lazy.lua`, `init.lua`, `plugin/`.

## Modes

The four modes are **mutually exclusive** with each other: `--verify`,
`--update`, and `--no-api` cannot be combined. `--check` is a modifier
that can be applied to any mode.

### Default — `vimpin run`

Pin field-form specs (`tag = "..."` / `branch = "..."`) to
[canonical form](./canonical-form.md). Specs already in canonical form
are a no-op.

Use this:
- when adding a new plugin to your config
- after hand-editing a spec from field form
- as the first run on a previously unpinned dotfiles repo

### `--verify` — SHA is the source of truth

Reverse-resolve each commit hash on the remote, find the tag that points
at it, and **rewrite the annotation comment to match**. The commit field
is never touched.

Use this to detect (and auto-correct) annotation drift after:
- an upstream tag rewrite
- a hand-edit of an annotation comment
- a Renovate misfire

Branch-annotated specs are left alone — a SHA can appear on many
branches; no meaningful reverse lookup exists.

```bash
vimpin run --verify
```

Combine with `--check` in CI to fail PRs when annotations have drifted
from their SHA:

```bash
vimpin run --verify --check
```

### `--update` — bump pinned specs

Bump each spec to the latest semver tag (for `-- tag:` annotations) or
the current branch HEAD (for `-- branch:` annotations). Both the commit
field and the annotation are updated atomically.

This is the **only mode** that intentionally advances the commit SHA.

```bash
vimpin run --update
```

Typical use: a `workflow_dispatch` / scheduled job that opens a PR with
the resulting changes. See [Guides → Update workflow](../guides/update-workflow.md).

### `--no-api` — offline structural check

Assert every spec has a 40-hex commit field and a `-- tag:` /
`-- branch:` annotation. **No network calls.**

Useful as a fast CI pre-check before the network-bound `--verify`:

```bash
vimpin run --no-api          # fails on missing pins (structural)
vimpin run --verify --check  # fails on drifted annotations (network)
```

`--no-api` catches "I added a plugin and forgot to pin it" without paying
for a remote round-trip per spec.

## The `--check` modifier

Combines with any mode to make it read-only. Exits non-zero if the file
would change.

| Combination | Meaning |
| --- | --- |
| `vimpin run --check` | Are all specs already in canonical form? |
| `vimpin run --verify --check` | Are all annotations aligned with their SHAs? |
| `vimpin run --update --check` | Are any specs out of date relative to upstream? |
| `vimpin run --no-api --check` | Equivalent to plain `--no-api` (already non-writing). |

## Exit codes

| Code | Meaning |
| --- | --- |
| `0` | Success. Without `--check`, the file may have been written. With `--check`, no changes would be made. |
| `1` | One or more files would change but `--check` blocked the write. Inspect the diff vimpin printed. |
| `>1` | Unrecoverable error (parse failure, `git ls-remote` error, etc.). The error message is on `stderr`. |

## The `-- vimpin:ignore` escape hatch

Append `-- vimpin:ignore` to a spec to opt it out of every mode:

```lua
{ "internal/dev-plugin", dir = "~/code/plugin" }, -- vimpin:ignore
```

This is the supported escape hatch for local plugins, plugins you do not
want managed, or temporary experiments. The marker is intentionally
distinct from the canonical-form annotation, so it cannot be confused
with a tag or branch reference.
