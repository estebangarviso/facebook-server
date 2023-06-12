<p align="center"><img src="logo.png" style="height: 300px; width: auto;" /></p>

<h1 align="center">Websocial</h1>

## Requirements

- Node.js v16 (use [nvm](https://github.com/nvm-sh/nvm) to manage multiple Node.js versions.)
- yarn v1.22 (minimum)
- Create an `.env` file that looks like the `.env.example` file.
- Import default sample database records with `yarn import:db` script then CTRL+C to stop the script.

## Installation

```bash
$ nvm install 18
$ nvm use 18 # Manual call to use the right Node.js version
# Automatic call node version by .nvmrc reference: https://github.com/nvm-sh/nvm#bash, so
# when you open a new terminal, the right Node.js version will be used
$ pnpm install
```

## Running the app

```bash
# development
$ pnpm dev

# production mode
$ pnpm build

# run production build
$ pnpm start
```

## Usage

```bash
# run tests
$ pnpm test
# run tests with coverage
$ pnpm test:coverage
# run tests with verbose output
$ pnpm test:verbose
# run tests with watch mode
$ pnpm test:watch
# inspect code linting
$ pnpm lint
# fix code linting
$ pnpm lint:fix
# import default sample database records, be sure
# to have a running mongodb engine running and database empty (with no records)
$ pnpm import:db
```
