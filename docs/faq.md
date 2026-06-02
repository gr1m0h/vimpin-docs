---
sidebar_position: 99
title: FAQ
---

# FAQ

### Will this work with packer.nvim / vim-plug / dein.vim?

Not today. The canonical form is `lazy.nvim`-shaped.

### Does vimpin replace `lazy-lock.json`?

Effectively yes. The canonical Lua spec becomes the source of truth and
`lazy-lock.json` is a regenerated derivative. If you also want Renovate
to manage the lockfile, the `:lazy-nvim-lock`
[sub-preset](./vimpin-renovate-config.md) is available.

### What happens if upstream rewrites a tag?

The SHA on disk is unchanged. `vimpin run --verify` rewrites the
annotation to whatever tag (if any) now matches the SHA. You're still
installing what you originally pinned; CI flags the drift through
`mode: verify-check`.

### Can I use vimpin without GitHub Actions or Renovate?

Yes. The CLI is standalone:

```bash
vimpin run --update
git diff lua/
git commit -am "chore: vimpin update"
```

### Where do I report bugs?

| Component | Repo |
| --- | --- |
| CLI behaviour | [`gr1m0h/vimpin`](https://github.com/gr1m0h/vimpin/issues) |
| GitHub Action | [`gr1m0h/vimpin-action`](https://github.com/gr1m0h/vimpin-action/issues) |
| Renovate preset | [`gr1m0h/vimpin-renovate-config`](https://github.com/gr1m0h/vimpin-renovate-config/issues) |
| Docs | [`gr1m0h/vimpin-docs`](https://github.com/gr1m0h/vimpin-docs/issues) |
