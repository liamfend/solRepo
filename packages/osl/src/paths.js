const path = require('path')
const fs = require('fs')
const appBase = require('./basepath')

const moduleFileExtensions = ['js', 'jsx', 'ts', 'tsx', 'json'] //留着以后做成通用库后，支持 配置 和 ts

const resolveModule = filePath => {
  const extension = moduleFileExtensions.find(extension =>
    fs.existsSync(path.resolve(`${filePath}.${extension}`)),
  )

  if (extension) {
    return path.resolve(`${filePath}.${extension}`)
  }

  return path.resolve(`${filePath}.js`)
}

const appOutputBuild = path.resolve(appBase, 'build')
const appSrcJs = resolveModule(path.resolve(appBase, 'src/index'))
const appSrc = path.resolve(appBase, 'src')
const appPublic = path.resolve(appBase, process.env.INTERNAL_TEST,'public')
const appHtmlTemp = path.resolve(appBase, 'public/index.html')
const oslConfigPath = path.resolve(appBase, '.oslrc.js')
const appPublicPathUrl = process.env.PUBLIC_URL || '/'

module.exports = {
  appBase,
  appOutputBuild,
  appSrcJs,
  appSrc,
  appPublic,
  appHtmlTemp,
  appPublicPathUrl,
  oslConfigPath,
}
