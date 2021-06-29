const fs = require('fs')
const path = require('path')
 
const appBase = process.env.INTERNAL_TEST  ? path.resolve(fs.realpathSync(process.cwd()),process.env.INTERNAL_TEST) : fs.realpathSync(process.cwd())
 
module.exports = appBase
