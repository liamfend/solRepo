const { appPublic, appPublicPathUrl } = require('./paths')

const initailConfig = (port, appPublic) => {
  return {
    port: port,
    contentBase: appPublic, // boolean | string | array, static file location
    compress: true, // enable gzip compression
    historyApiFallback: true, // true for index.html upon 404, object for multiple paths
    hot: true, // hot module replacement. Depends on HotModuleReplacementPlugin
    https: false, // true for self-signed, object for cert authority
    noInfo: true, // only errors & warns on hot reload
    publicPath: appPublicPathUrl.length>1?appPublicPathUrl.slice(0,-1):appPublicPathUrl, 
    // quiet: false,  
  }
} 
//https://www.npmjs.com/package/get-port
//https://www.npmjs.com/package/portfinder
//暂时不加动态选择端口，晚点考虑添加使用环境变量区分
const config = initailConfig('', appPublic)

module.exports = config
