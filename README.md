# YouViCo CLI

Official command-line interface for YouViCo.

The CLI is built with TypeScript and uses the official [`@youvico/api`](https://www.npmjs.com/package/@youvico/api) SDK.

Visit the [YouViCo CLI guide](https://developers.youvico.com/guides/cli) for full usage documentation.

## Getting Started

### Install

```sh
npm install -g @youvico/cli
```

### Configure

Prompt for a YouViCo API key and save it locally:

```sh
youvico auth api
```

Saved API keys are stored in `~/.config/youvico/config.json` with `0600` permissions. The key is never printed in CLI output.

You can also provide an API key with `YOUVICO_API_KEY`.

### Basic Usage

```sh
youvico project search --query="launch"
youvico file upload.file --project=<project-id> --path=./file.mp4
youvico comment list --file=<file-id>
```

Command results are printed as JSON.

## Commands

```sh
youvico auth --help
youvico config --help
youvico project --help
youvico file --help
youvico folder --help
youvico comment --help
youvico reaction --help
```

Use `--help` on any command for available options and examples:

```sh
youvico file upload.file --help
```

## Docs

See the [YouViCo CLI guide](https://developers.youvico.com/guides/cli), [SDK guide](https://developers.youvico.com/guides/sdk), and [API reference](https://developers.youvico.com/api-references/project/search) for full documentation.

## Requirements

The CLI supports Node.js 20 and higher.

## Development

```sh
pnpm install
pnpm test
pnpm run typecheck
pnpm run build
pnpm run pack:dry-run
```

## Publishing

Publishing is handled by GitHub Actions after npm Trusted Publishing is configured for this repository.

## Getting Help

Use the [GitHub issue tracker](https://github.com/youvicohq/cli/issues) for bug reports and feature requests.

## License

MIT
