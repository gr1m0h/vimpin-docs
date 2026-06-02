---
sidebar_position: 2
title: Installation
---

# Installation

## Requirements

- **Go 1.24** or newer (for `go install`).
- **git** on `$PATH`. vimpin shells out to `git ls-remote` for tag and
  branch resolution; it does not call any HTTP API.

## With `go install`

```bash
go install github.com/gr1m0h/vimpin/cmd/vimpin@latest
```

Pin to a specific release rather than `@latest` in environments where
reproducibility matters:

```bash
go install github.com/gr1m0h/vimpin/cmd/vimpin@v0.1.0
```

Verify the binary is on your `$PATH`:

```bash
vimpin --help
```

If `vimpin` is not found, ensure `$(go env GOBIN)` (or `$(go env
GOPATH)/bin`) is on your `$PATH`.

## In CI

For GitHub Actions, prefer the [vimpin-action](../vimpin-action/overview.md)
wrapper. It encapsulates the `setup-go` + `go install` + run pattern
behind a single `uses:` step and supports SHA-level pinning of the CLI
itself.

If you need a different CI provider, the install-and-run pattern is:

```bash
go install github.com/gr1m0h/vimpin/cmd/vimpin@<sha>
vimpin run --check
```

## Uninstalling

`go install` places the binary under `$(go env GOBIN)` (default
`$GOPATH/bin`). Remove it directly:

```bash
rm "$(go env GOBIN 2>/dev/null || echo "$(go env GOPATH)/bin")/vimpin"
```

## Building from source

```bash
git clone https://github.com/gr1m0h/vimpin.git
cd vimpin
go build ./cmd/vimpin
```

The resulting `./vimpin` binary is statically linked and can be moved
anywhere on `$PATH`.
