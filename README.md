# vimpin-docs

Official documentation site for the **vimpin** family:

- [`gr1m0h/vimpin`](https://github.com/gr1m0h/vimpin) — CLI that rewrites Vim/Neovim plugin specs to pin every plugin to an explicit commit hash.
- [`gr1m0h/vimpin-action`](https://github.com/gr1m0h/vimpin-action) — GitHub Action wrapper around the CLI.
- [`gr1m0h/vimpin-renovate-config`](https://github.com/gr1m0h/vimpin-renovate-config) — Renovate preset that updates pinned specs.

Published at **<https://vimpin.grimoh.net>**.

## Local development

```bash
npm install
npm run start    # http://localhost:3000
npm run build    # production build in ./build
```

Requires Node.js 18 or newer.

## Deployment

The site is deployed automatically by Cloudflare Pages on every push to `main`.
Pages project and DNS (`vimpin.grimoh.net`) are managed in
[`gr1m0h/infrastructure`](https://github.com/gr1m0h/infrastructure).

## Repository layout

```
docs/                 # Markdown content (one folder per product + cross-cutting guides)
src/css/custom.css    # Theme tweaks
src/pages/            # Landing page
static/img/           # Logo, favicon, social card
sidebars.ts           # Sidebar layout
docusaurus.config.ts  # Site configuration
```

## Contributing

1. Edit Markdown under `docs/`.
2. `npm run start` to preview locally.
3. Open a PR. Cloudflare Pages produces a preview build on every PR.

## License

MIT
