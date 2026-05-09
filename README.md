# YouViCo CLI

Official command-line interface for YouViCo.

The CLI is built with TypeScript and uses the official [`@youvico/api`](https://www.npmjs.com/package/@youvico/api) SDK.

Visit the [YouViCo developer docs](https://developers.youvico.com/guides/getting-started) for guides, API concepts, and examples.

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

The CLI reads credentials in this order:

1. `YOUVICO_API_KEY`
2. `~/.config/youvico/config.json`

Saved API keys are stored in a `0600` config file. The key is never printed in CLI output.

### Check Auth

```sh
youvico auth status
```

Remove the saved API key:

```sh
youvico auth clear
```

### Configure Client

```sh
youvico config get
youvico config set --base-url https://api.example.com
youvico config set --timeout-ms 30000
youvico config clear --base-url
youvico config clear --timeout-ms
youvico config clear
```

## Usage

### Projects

```sh
youvico project search --query="launch"
youvico project search --query="launch" --page=1 --sort=name --direction=asc
youvico project get --id <project-id>
```

### Files

```sh
youvico file list --project=<project-id>
youvico file get --id <file-id>
youvico file upload.file --project=<project-id> --path=./file.mp4
youvico file upload.file --project=<project-id> --path=./file.mp4 --name=file.mp4
youvico file upload.youtube --project=<project-id> --url=https://youtu.be/...
youvico file update --id <file-id> --name="Cut 1"
youvico file update --id <file-id> --description="Ready for review"
youvico file update --id <file-id> --clear-description
youvico file update --id <file-id> --allow-restricted
youvico file update.tag --id <file-id> --tag APPROVED
youvico file delete --id <file-id>
youvico file delete --id <file-id> --yes
```

### Folders

```sh
youvico folder list --project=<project-id>
youvico folder create --project=<project-id> --name="Drafts"
youvico folder update --id <folder-id> --name="Final"
youvico folder delete --id <folder-id>
youvico folder delete --id <folder-id> --approve
```

### Comments

```sh
youvico comment list --file=<file-id>
youvico comment list --file=<file-id> --next=<cursor>
youvico comment list --file=<file-id> --prev=<cursor>
youvico comment create --file=<file-id> --content="Looks good"
youvico comment create --file=<file-id> --parent=<comment-id> --content="Fixed"
youvico comment replies --comment=<comment-id>
```

### Reactions

```sh
youvico reaction list --comment=<comment-id>
youvico reaction create --comment=<comment-id> --type="👍"
youvico reaction delete --comment=<comment-id> --type="👍"
youvico reaction delete --comment=<comment-id> --type="👍" --yes
```

Delete commands prompt before deleting. Pass `--yes` or `--approve` to skip the confirmation prompt.

Command results are printed as JSON.

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

Publishing is handled by GitHub Actions when a GitHub Release is published.

The release tag must match the package version:

```sh
v0.1.0
```

## Docs

See the [YouViCo SDK guide](https://developers.youvico.com/guides/sdk) and [API reference](https://developers.youvico.com/api-references/project/search) for API details.

## Getting Help

Use the [GitHub issue tracker](https://github.com/youvicohq/cli/issues) for bug reports and feature requests.

## License

MIT
