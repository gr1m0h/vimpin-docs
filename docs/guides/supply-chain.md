---
sidebar_position: 3
title: Supply-chain story
---

# Supply-chain story

Why vimpin exists, and what threat model it answers. This page is the
"why" behind the canonical-form contract — read it once if you want to
understand the design, but skip it if you're here for reference.

## The threat: floating refs

Most Neovim users let their plugin manager track one of these:

1. **Floating HEAD** — `{ "owner/repo" }` with no constraint.
   `:Lazy update` moves the plugin to whatever the upstream default
   branch points at right now.
2. **Mutable tag** — `{ "owner/repo", tag = "v1" }`. `lazy.nvim`
   resolves the tag at install time, but never re-checks whether the
   tag still points at the same commit it did yesterday.

Both leave a direct supply-chain attack vector: **anything that lets a
malicious commit reach the default branch (or any tag the spec
references) gets installed on the user's machine the next time
`:Lazy install` runs.** That includes:

- Account takeover of a plugin maintainer (rare but documented).
- Compromised CI credentials in a plugin's own repo.
- Tag rewrites (intentional or accidental).
- Force-push to default branch.

vimpin's premise: the user should be choosing **a specific revision**,
not delegating that decision to whoever last pushed to upstream.

## How vimpin closes the gap

Three properties, all enforced by the canonical-form contract:

### 1. The commit SHA on disk is authoritative

Once a spec is in canonical form, the only path that advances the SHA
is `vimpin run --update` — which requires the operator to type the
flag, or a Renovate PR to be merged by an explicit reviewer action.

No background process moves the SHA. Not `:Lazy update`, not
`:Lazy sync`, not upstream tag rewrites. The pinned revision is what
gets installed, full stop.

### 2. The annotation is a derived artefact

The `-- tag: v0.1.5` comment is not authoritative — it records *which
upstream ref* the SHA was pulled from. If a maintainer rewrites
`v0.1.5` upstream to point at a different commit:

- `vimpin run --verify` detects the drift and corrects the annotation
  to whatever tag (if any) now matches the on-disk SHA.
- The SHA itself is unchanged. You continue to install what you chose,
  not what upstream rewrote.

This makes `verify-check` in CI a structural defence against tag
rewrite attacks: a PR that drifts will fail the check; no one can
silently land a rotated tag.

### 3. The update flow is auditable

Each `--update` or Renovate PR produces a diff that shows both halves
of the change: the old SHA and the new SHA, the old annotation and the
new annotation, in the same hunk. A reviewer can:

- Compare the new SHA against the upstream tag in question
  (`git log v0.2.0 -1` upstream).
- Verify the annotation matches.
- Decline the PR if anything looks off.

The atomicity matters: a SHA-only change with no annotation update —
or vice versa — is impossible by construction. The regex captures both
or neither.

## Where vimpin doesn't help

Honest limits of the model:

- **Cryptographic verification of commit contents.** vimpin pins a
  SHA; it does not verify that the SHA was signed by a maintainer's
  PGP key. If `git ls-remote` returns a malicious SHA on first pin,
  vimpin pins the malicious SHA. The defence is per-commit signing
  upstream, not vimpin.
- **`lazy-lock.json` hygiene.** vimpin operates at the spec layer.
  Whatever ends up in `lazy-lock.json` is `:Lazy sync`'s responsibility.
  In practice this doesn't matter — the spec is authoritative — but
  don't expect vimpin to defend the lockfile.
- **Non-plugin attack surfaces.** Init code in `init.lua`,
  configuration in `lua/config/`, etc. are not in scope. vimpin
  rewrites pinning fields and annotations; everything else passes
  through.
- **Forge-level compromise.** If GitHub itself rewrites refs (their
  ToS allows it under specific conditions), vimpin sees what
  `git ls-remote` returns. The defence is to not use a forge whose
  guarantees you don't trust.

## Why pin actions, plugins, and Renovate config too

Following the same discipline through:

- **`vimpin-action`** is pinned to `@<sha>` in its
  [versioning guide](../vimpin-action/versioning.md). Pinning vimpin's
  plugin specs while running an unpinned vimpin-action would leave a
  hole.
- The **action's `version` input** defaults to a CLI commit SHA, not
  a tag. Same reason.
- **Renovate's `vimpin-renovate-config`** is consumed by name
  (`github>gr1m0h/vimpin-renovate-config`) — Renovate resolves the
  preset at config-load time. If you require stronger pinning, fork
  the preset and reference your fork.

Each link in the chain matters; vimpin makes the *plugin* link match
the discipline the rest of the chain already enjoys.

## The reading list

If you're new to commit-pinning as a supply-chain practice:

- [`pinact`](https://github.com/suzuki-shunsuke/pinact) — the same
  idea applied to GitHub Actions `uses:` lines. vimpin's design is
  intentionally a Lua-spec port of the pinact pattern.
- [GitHub Actions Security Best Practices — pinning to SHAs](https://docs.github.com/en/actions/security-guides/security-hardening-for-github-actions#using-third-party-actions)
- Renovate's
  [Dependency Pinning docs](https://docs.renovatebot.com/dependency-pinning/)
  give the general principle vimpin instantiates for Neovim plugins.
