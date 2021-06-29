const { oslConfigPath } = require('../paths')
const fs = require('fs')

const mergeConfig = () => {
  //merge
  if (fs.existsSync(oslConfigPath)) {
    return Object.assign({}, require('../defaultOsl.config'), require(oslConfigPath))
  } else {
    return require('../defaultOsl.config')
  }
}

module.exports = {
  ...mergeConfig(),
}
