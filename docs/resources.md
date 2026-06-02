---
sidebar_position: 98
title: Resources & community
---

# Resources & community

## Get help

| Question type | Best venue |
| --- | --- |
| "Is this a bug in the CLI?" | [`gr1m0h/vimpin` issues](https://github.com/gr1m0h/vimpin/issues) |
| "Is this a bug in the Action?" | [`gr1m0h/vimpin-action` issues](https://github.com/gr1m0h/vimpin-action/issues) |
| "Is this a bug in the Renovate preset?" | [`gr1m0h/vimpin-renovate-config` issues](https://github.com/gr1m0h/vimpin-renovate-config/issues) |
| "Is this a docs problem?" | [`gr1m0h/vimpin-docs` issues](https://github.com/gr1m0h/vimpin-docs/issues) |
| "How should I do X?" | Open a discussion on the relevant repo (above). |

When in doubt, file against `vimpin` and the maintainer will re-route.

## Related projects

vimpin's design is intentionally a port of patterns proven in adjacent
ecosystems:

- [**`pinact`**](https://github.com/suzuki-shunsuke/pinact) — the same
  canonical-form / SHA-pinning approach for GitHub Actions `uses:`
  lines. The structural debt vimpin pays for `lazy.nvim` is the same
  debt pinact pays for `actions/checkout@v4`.
- [**`ratchet`**](https://github.com/sethvargo/ratchet) — adjacent
  tool, also for GitHub Actions, with a similar locking model.
- [**`lazy.nvim`**](https://github.com/folke/lazy.nvim) — the plugin
  manager vimpin's canonical form targets.
- [**Renovate**](https://docs.renovatebot.com/) — the bot the
  `vimpin-renovate-config` preset slots into. The
  [custom managers docs](https://docs.renovatebot.com/configuration-options/#custommanagers)
  explain the regex-extract mechanism the preset uses.
- [**`tfaction`**](https://suzuki-shunsuke.github.io/tfaction/docs/) —
  unrelated to vimpin, but the doc site structure is the prior art
  that this site was modelled on.

## Background reading

If you're new to commit-pinning as a supply-chain practice:

- [GitHub Actions security hardening — pinning to SHAs](https://docs.github.com/en/actions/security-guides/security-hardening-for-github-actions#using-third-party-actions)
- [Renovate's dependency pinning guide](https://docs.renovatebot.com/dependency-pinning/)
- The [supply-chain story](./guides/supply-chain.md) page on this
  site, which articulates the threat model vimpin defends against.

## Stay updated

- Watch [`gr1m0h/vimpin`](https://github.com/gr1m0h/vimpin) for CLI
  releases (`Releases only` mode is plenty).
- Watch [`gr1m0h/vimpin-action`](https://github.com/gr1m0h/vimpin-action)
  if you've pinned the action by SHA — new tags are infrequent.
- This documentation site is at
  [`gr1m0h/vimpin-docs`](https://github.com/gr1m0h/vimpin-docs); the
  `edit this page` link at the bottom of every page is the easiest way
  to file a small correction.

## License

All vimpin-family repositories, including this documentation site, are
licensed under the **MIT License**.
