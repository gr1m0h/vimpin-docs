---
sidebar_position: 4
title: Outputs
---

# Outputs

| Output | Type | Description |
| --- | --- | --- |
| `changed` | `string` | `"true"` if the chosen mode wrote (or would write) file changes; `"false"` otherwise. |

## `changed`

The most common consumer of this output is a scheduled "open a PR if
there's an update" workflow. The step using `mode: update` does the
writes; a follow-up step uses `peter-evans/create-pull-request` only
when `changed == 'true'`:

```yaml
- uses: gr1m0h/vimpin-action@v0.1.0
  id: vimpin
  with:
    mode: update

- if: steps.vimpin.outputs.changed == 'true'
  uses: peter-evans/create-pull-request@v6
  with:
    title: "chore(deps): vimpin --update"
    branch: vimpin-update
    commit-message: "chore(deps): bump pinned commits to latest tags"
```

The full workflow lives in [Recipes → Scheduled update PR](./recipes.md#scheduled-update-pr).

### Semantics by mode

| Mode | `changed` semantics |
| --- | --- |
| `run` | `true` if any spec was rewritten from field form to canonical, or if the CLI corrected a malformed canonical spec. |
| `check` | `true` if any spec **would** be rewritten. The job exits non-zero in this case. |
| `verify` | `true` if any annotation comment was rewritten to match its SHA. |
| `verify-check` | `true` if any annotation comment **would** be rewritten. The job exits non-zero in this case. |
| `update` | `true` if any spec was bumped to a newer tag or branch HEAD. |
| `no-api` | `true` if any spec is structurally invalid. The job exits non-zero in this case. |

For modes that exit non-zero on diff (`check`, `verify-check`,
`no-api`), the `changed` output is mostly informational — the workflow
will have already failed before any downstream step runs.

### `changed` and `if:`

Because the output is a string, compare against the literal `'true'`,
not the YAML boolean:

```yaml
# Correct:
if: steps.vimpin.outputs.changed == 'true'

# Wrong (always false — the YAML boolean `true` is not the string `"true"`):
if: steps.vimpin.outputs.changed == true
```
