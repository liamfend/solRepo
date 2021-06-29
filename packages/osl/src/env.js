const path = require('path')
const fs = require('fs')
const appBase = require('./basepath')

const NODE_ENV = process.env.NODE_ENV

if (!NODE_ENV) {
  throw new Error('The NODE_ENV environment variable is required but was not specified.')
}

const envFile = path.resolve(appBase, '.env')

// https://github.com/bkeepers/dotenv#what-other-env-files-can-i-use
const dotenvFiles = [
  `${envFile}.${NODE_ENV}.local`,
  NODE_ENV !== 'test' && `${envFile}.local`,
  `${envFile}.${NODE_ENV}`,
  envFile,
].filter(Boolean)

var envConfigs = {}

dotenvFiles.forEach(dotenvFile => {
  if (fs.existsSync(dotenvFile)) {
    envConfigs = require('dotenv-expand')(
      require('dotenv').config({
        path: dotenvFile,
      }),
    ).parsed
  }
})

const raw = Object.keys(envConfigs).reduce(
  (env, key) => {
    env[key] = process.env[key]
    return env
  },
  {
    NODE_ENV: process.env.NODE_ENV || 'development',
    PUBLIC_URL: process.env.PUBLIC_URL || '/',
    FAST_REFRESH: process.env.FAST_REFRESH || 'false',
  },
)

const stringified = {
  'process.env': Object.keys(raw).reduce((env, key) => {
    env[key] = JSON.stringify(raw[key])
    return env
  }, {}),
}

module.exports = { env: { stringified, raw } }
