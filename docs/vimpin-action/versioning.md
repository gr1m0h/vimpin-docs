---
sidebar_position: 7
title: Versioning
---

# Versioning policy

The action follows a **separate semantic version line** from the
underlying CLI. This is deliberate: the action's input / output surface
needs to evolve independently of the CLI's flag set.

## How to pin

| Ref form | Example | When to use |
| --- | --- | --- |
| `@<40-hex sha>` | `gr1m0h/vimpin-action@b0f298ab...ef902e04` | **Production CI** — maximum supply-chain safety. Pair with Renovate / Dependabot to keep current. |
| `@v<major>` | `gr1m0h/vimpin-action@v1` | Tracks the latest patch / minor on a major. Convenient but vulnerable to tag rewrites. |
| `@v<major>.<minor>.<patch>` | `gr1m0h/vimpin-action@v0.1.0` | Tag pinning. Same caveat as `@v1`. |
| `@main` | `gr1m0h/vimpin-action@main` | Tracks the action's `main` branch surface. Useful only for the action's own CI. |

## Why `@<sha>` over `@v0.1.0`

Tag rewrites are a real attack vector — a compromised account can move
an existing tag to a new commit. SHA pinning makes this impossible:
once you write `@b0f298ab...ef902e04` into your workflow file, you are
running exactly that snapshot of the action repository, regardless of
what label maintainers attach to it later.

The same logic applies to `vimpin-action`'s own dependency on the CLI:
the action's default `version` input is a commit SHA, not a tag.

## Semver scheme

While the action is at v0.y.z (pre-1.0):

- **patch** bumps (v0.1.1 → v0.1.2): bug fixes; no input / output
  surface change.
- **minor** bumps (v0.1.x → v0.2.0): new inputs, new modes, additive
  output changes. Existing pinning workflows continue to work without
  edits.
- **major** bumps (v0.x.y → v1.0.0): breaking input or output renames /
  removals. Migration notes will accompany the release.

Once the action reaches v1.0.0, breaking changes will be confined to
major-version bumps.

## CLI version coupling

The action's `version` input has its own default — a CLI commit SHA
that the action maintainer tests against. When upgrading the action,
the recommendation is:

1. Bump the action ref (`@<old sha>` → `@<new sha>`).
2. Leave the `version:` input alone, so the action's default CLI pin
   takes effect.
3. Override `version:` only when you specifically need a different CLI
   version than what the action ships with.

This keeps action and CLI upgrades coupled by default, so a bug fix
that requires changes on both sides ships as a single action release.

## Tracking action releases

- **Renovate** auto-detects `uses:` lines via the
  [`github-actions` manager](https://docs.renovatebot.com/modules/manager/github-actions/).
  It will open PRs that bump the SHA reference.
- **Dependabot** does the same via
  `.github/dependabot.yml`:

  ```yaml
  version: 2
  updates:
    - package-ecosystem: github-actions
      directory: /
      schedule:
        interval: weekly
  ```

Whichever bot you use, the action will, in turn, pin a verified CLI
release — so you only need to keep one ref current.
