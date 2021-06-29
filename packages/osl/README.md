# osl cli quick start project

[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

# Installing a package

You can install any package that you have permission to view. Authenticate to GitHub Packages using the instructions for your package client. For more information, see "Authenticating to GitHub Packages."

To authenticate by adding your personal access token to your ~/.npmrc file, edit the ~/.npmrc file for your project to include the following line, replacing TOKEN with your personal access token. Create a new ~/.npmrc file if one doesn't exist.

```bash
//npm.pkg.github.com/:\_authToken=TOKEN
@liamfend:registry=https://npm.pkg.github.com
```

## Configuration

you can use following line command to make a config

```bash
echo {}>.oslrc.js
```

### Options

```js
module.exports = {
  babel: {
    presets: [['@babel/preset-env'], '@babel/preset-react'],
    plugins: [],
  },
  resolve: {
    alias: {},
    fallback: {},
  },
  webpackPlugins: [],
}
```

# Cli Commands

## osl start

    todo

## osl build

    todo

# Adding Custom Environment Variables

**Your project can consume variables declared in your environment as if they were declared locally in your JS files.** **By default you will have NODE_ENV defined for you, and any other environment variables**

> WARNING: Do not store any secrets (such as private API keys) in your React app! Environment variables are embedded into the build, meaning anyone can view them by inspecting your app's files.

**The environment variables are embedded during the build time. Since Create React App produces a static HTML/CSS/JS bundle, it can’t possibly read them at runtime. To read them at runtime, you would need to load HTML into memory on the server and replace placeholders in runtime, as described here. Alternatively you can rebuild the app on the server anytime you change them.**

### Notice:

_Changing any environment variables will require you to restart the development server if it is running.These environment variables will be defined for you on process.env._

### Adding Development Environment Variables In .env

**To define permanent environment variables, create a file called .env in the root of your project:**

```env
FAST_REFRESH=true
```

> Note: You need to restart the development server after changing .env files.

### What other .env files can be used?

- .env: Default.
- .env.local: Local overrides. This file is loaded for all environments except test.
- .env.development, .env.test, .env.production: Environment-specific settings.
- .env.development.local, .env.test.local, .env.production.local: Local overrides of environment-specific settings.

**Files on the left have more priority than files on the right:**

- npm start: .env.development.local, .env.local, .env.development, .env
- npm run build: .env.production.local, .env.local, .env.production, .env
