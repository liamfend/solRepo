//再怎么敲命令都不允许覆盖😈
process.env.BABEL_ENV = 'development'
process.env.NODE_ENV = 'development'

require('./env')
const webpack = require('webpack')
const webpackConfig = require('./webpack.config')
const devServerConfig = require('./webpack-dev-server.config')
const formatWebpackMessages = require('./utils/formatWebpackMessages')
const WebpackDevServer = require('webpack-dev-server')
const chalk = require('chalk')
const clear = require('console-clear')

const DEFAULT_PORT = parseInt(process.env.PORT, 10) || 3001
//const HOST = process.env.HOST || '0.0.0.0'

const configOptions = webpackConfig('development')

let compiler

try {
  compiler = webpack(configOptions)
} catch (err) {
  console.log(chalk.red('Failed to compile.'))
  console.log()
  console.log(err.message || err)
  console.log()
  // process.exit(1)
}

function printInstructions(appName, urls, useYarn) {
  console.log()
  console.log(`You can now view ${chalk.bold(appName)} in the browser.`)
  console.log()

  if (urls.lanUrlForTerminal) {
    console.log(`  ${chalk.bold('Local:')}            ${urls.localUrlForTerminal}`)
    console.log(`  ${chalk.bold('On Your Network:')}  ${urls.lanUrlForTerminal}`) //lanUrlForTerminal,localUrlForTerminal
  } else {
    console.log(`  ${urls.localUrlForTerminal}`)
  }

  console.log()
  console.log('Note that the development build is not optimized.')
  console.log(
    `To create a production build, use ` +
      `${chalk.cyan(`${useYarn ? 'yarn' : 'npm run'} build`)}.`,
  )
  console.log()
}

const devServerOptions = Object.assign({}, devServerConfig, {
  //  open: true,
  port: DEFAULT_PORT,
})

const server = new WebpackDevServer(compiler, devServerOptions)

compiler.hooks.invalid.tap('invalid', () => {
  console.log('Compiling...')
})

server.listen(DEFAULT_PORT, 'localhost', err => {
  if (err) {
    return console.log(err)
  }
  console.log(chalk.cyan('Starting the development server...\n'))
  //   console.log('Starting server on http://localhost:3000')
})
let isFirstCompile = true
compiler.hooks.done.tap('done', async stats => {
  const statsData = stats.toJson({
    all: false,
    warnings: true,
    errors: true,
  })
  clear()

  const messages = formatWebpackMessages(statsData)
  //   const isSuccessful = !messages.errors.length && !messages.warnings.length
  //   //   if (isSuccessful) {
  //   //     console.log(chalk.green('Compiled successfully!'))
  //   //   }
  printInstructions(
    'CMS',
    {
      lanUrlForTerminal: `http://localhost:${DEFAULT_PORT}${process.env.PUBLIC_URL||''}`,
      localUrlForTerminal: `http://localhost:${DEFAULT_PORT}${process.env.PUBLIC_URL||''}`,
    },
    true,
  )
  isFirstCompile = false

  if (messages.errors.length) {
    // Only keep the first error. Others are often indicative
    // of the same problem, but confuse the reader with noise.
    if (messages.errors.length > 1) {
      messages.errors.length = 1
    }
    console.log(chalk.red('Failed to compile.\n'))
    console.log(messages.errors.join('\n\n'))
    return
  }
  if (messages.warnings.length) {
    console.log(chalk.yellow('Compiled with warnings.\n'))
    console.log(messages.warnings.join('\n\n'))

    // Teach some ESLint tricks.
    console.log(
      '\nSearch for the ' +
        chalk.underline(chalk.yellow('keywords')) +
        ' to learn more about each warning.',
    )
    console.log(
      'To ignore, add ' + chalk.cyan('// eslint-disable-next-line') + ' to the line before.\n',
    )
  }
})

const sigs = ['SIGINT', 'SIGTERM']

sigs.forEach(function (sig) {
  process.on(sig, function () {
    server.close()
    process.exit()
  })
})
process.on('unhandledRejection', err => {
  throw err
})
