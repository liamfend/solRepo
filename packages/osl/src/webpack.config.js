const path = require('path')
const {
  appBase,
  appOutputBuild,
  appSrcJs,
  appSrc,
  appPublic,
  appHtmlTemp,
  appPublicPathUrl,
} = require('./paths')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const webpack = require('webpack')
const WebpackBar = require('webpackbar') 
const { env } = require('./env')
const TerserPlugin = require('terser-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const postcssNormalize = require('postcss-normalize')
const safePostCssParser = require('postcss-safe-parser')
const oslConfig = require('./utils/mergeOslConfig')
const getCSSModuleLocalIdent = require('./utils/getCSSModuleLocalIdent')
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

const cssRegex = /\.css$/
const cssModuleRegex = /\.module\.css$/
const sassRegex = /\.(scss|sass)$/
const sassModuleRegex = /\.module\.(scss|sass)$/

module.exports = function (webpackEnv) {
  const isEnvProduction = webpackEnv === 'production' //  .production
  const isEnvDevelopment = webpackEnv === 'development' // webpackEnv  // 还有本地 ci 线上ci 等等。。 所以不可以用！isEnvProduction
  const isEnvProductionProfile = isEnvProduction && process.argv.includes('--profile')
  const shouldUseSourceMap = process.env.GENERATE_SOURCEMAP !== 'false'
  const isAnalyze = process.env.ANALYZE
  const imageInlineSizeLimit = parseInt(process.env.IMAGE_INLINE_SIZE_LIMIT || '10000')

  const getStyleLoaders = (cssOptions, preProcessor) => {
    const loaders = [
      isEnvDevelopment && require.resolve('style-loader'),
      isEnvProduction && {
        loader: MiniCssExtractPlugin.loader,
        options: { publicPath: '../../' },
        // options: paths.publicUrlOrPath.startsWith('.')
        //   ? { publicPath: '../../' }
        //   : {},
      },
      {
        loader: require.resolve('css-loader'),
        options: cssOptions,
      },
      {
        loader: require.resolve('postcss-loader'),
        options: {
          postcssOptions: {
            plugins: [
              require('postcss-flexbugs-fixes'),
              require('postcss-preset-env')({
                autoprefixer: {
                  flexbox: 'no-2009',
                },
                stage: 3,
              }),
              postcssNormalize(),
            ],
          },
        },
      },
    ].filter(Boolean)
    if (preProcessor) {
      loaders.push(
        {
          loader: require.resolve('resolve-url-loader'),
          options: {
            sourceMap: isEnvProduction ? true : isEnvDevelopment,
            root: appSrc,
          },
        },
        {
          loader: require.resolve(preProcessor),
          options: { sourceMap: true },
          // options: Object.assign(
          //   { sourceMap: true },
          //   preProcessor ==='sass-loader'&&{
          //     sassOptions: {
          //       importer:jsonImporter
          //     },
          //   },
          // ),
        },
      )
    }
    return loaders
  }

  return {
    // stats: 'minimal',
    mode: webpackEnv,
    bail: isEnvProduction,
    devtool: isEnvProduction ? 'source-map' : isEnvDevelopment && 'cheap-module-source-map',
    entry: appSrcJs,
    output: {
      path: isEnvProduction ? appOutputBuild : undefined,
      pathinfo: isEnvDevelopment,
      filename: isEnvProduction
        ? 'static/js/[name].[contenthash:8].js'
        : isEnvDevelopment && 'static/js/bundle.[name].js',
      publicPath: appPublicPathUrl,
      devtoolModuleFilenameTemplate: isEnvProduction
        ? info => path.relative(appSrc, info.absoluteResourcePath).replace(/\\/g, '/')
        : isEnvDevelopment && (info => path.resolve(info.absoluteResourcePath).replace(/\\/g, '/')),
      chunkFilename: isEnvProduction
        ? 'static/js/[name].[contenthash:8].chunk.js'
        : isEnvDevelopment && 'static/js/[name].chunk.js',
    },
    optimization: {
      minimize: isEnvProduction,
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            parse: {
              ecma: 8,
            },
            compress: {
              ecma: 5,
              warnings: false,
              comparisons: false,
              inline: 2,
            },
            mangle: {
              safari10: true,
            },
            keep_classnames: isEnvProductionProfile,
            keep_fnames: isEnvProductionProfile,
            output: {
              ecma: 5,
              comments: false,
              ascii_only: true,
            },
          },
          // sourceMap: shouldUseSourceMap,
        }),
        new CssMinimizerPlugin(),
      ],

      splitChunks: {
        chunks: 'all',
        //  name: isEnvDevelopment ? 'bundle' : false,
      },
      runtimeChunk: {
        name: entrypoint => `runtime-${entrypoint.name}`,
      },
    },
    module: {
      rules: [
        {
          oneOf: [
            {
              test: [/\.avif$/],
              loader: require.resolve('url-loader'),
              options: {
                limit: imageInlineSizeLimit,
                mimetype: 'image/avif',
                name: 'static/media/[name].[hash:8].[ext]',
              },
            },
            {
              test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
              loader: require.resolve('url-loader'),
              options: {
                limit: imageInlineSizeLimit,
                name: 'static/media/[name].[hash:8].[ext]',
              },
            },
            {
              test: /\.(js|jsx)$/,
              include: appSrc,
              exclude: /(node_modules)/,
              loader: require.resolve('babel-loader'),
              options: {
                ...oslConfig.babel,
              },
            },
            {
              test: cssRegex,
              exclude: cssModuleRegex,
              use: getStyleLoaders({
                importLoaders: 1,
                sourceMap: isEnvProduction ? shouldUseSourceMap : isEnvDevelopment,
              }),
              sideEffects: true,
            },
            {
              test: cssModuleRegex,
              use: getStyleLoaders({
                importLoaders: 1,
                sourceMap: isEnvProduction ? shouldUseSourceMap : isEnvDevelopment,
                modules: {
                  getLocalIdent: getCSSModuleLocalIdent,
                },
              }),
            },
            {
              test: sassRegex,
              exclude: sassModuleRegex,
              use: getStyleLoaders(
                {
                  importLoaders: 3,
                  sourceMap: isEnvProduction ? shouldUseSourceMap : isEnvDevelopment,
                },
                'sass-loader',
              ),
              sideEffects: true,
            },
            {
              test: sassModuleRegex,
              use: getStyleLoaders(
                {
                  importLoaders: 3,
                  sourceMap: isEnvProduction ? shouldUseSourceMap : isEnvDevelopment,
                  modules: {
                    getLocalIdent: getCSSModuleLocalIdent,
                  },
                },
                'sass-loader',
              ),
            },
            {
              test: /\.yml$/,
              use: ['file-loader?name=[name].json', 'yaml-loader'],
              include: path.resolve(appSrc, 'resources/translations'),
            },
            {
              loader: require.resolve('file-loader'),
              exclude: [/\.(js|mjs|jsx|ts|tsx)$/, /\.html$/, /\.json$/, /\.bin$/, /^$/],
              options: {
                name: 'static/media/[name].[hash:8].[ext]',
              },
            },
          ],
        },
      ],
    },
    resolve: {
      ...oslConfig.resolve,
      alias: Object.keys(oslConfig.resolve.alias).reduce((a, k) => {
        a[k] = path.resolve(appBase, oslConfig.resolve.alias[k])
        return a
      }, {}),
    },
    plugins: [
      // isEnvDevelopment && new WebpackBar(),
      isEnvProduction && new CleanWebpackPlugin(),
      new HtmlWebpackPlugin(
        Object.assign(
          {},
          {
            inject: true,
            template: appHtmlTemp,
          },
          isEnvProduction
            ? {
                minify: {
                  removeComments: true,
                  collapseWhitespace: true,
                  removeRedundantAttributes: true,
                  useShortDoctype: true,
                  removeEmptyAttributes: true,
                  removeStyleLinkTypeAttributes: true,
                  keepClosingSlash: true,
                  minifyJS: true,
                  minifyCSS: true,
                  minifyURLs: true,
                },
              }
            : undefined,
        ),
      ),
      isEnvProduction &&
        new CopyPlugin({
          patterns: [
            {
              from: appPublic,
              to: appOutputBuild,
              globOptions: {
                ignore: ['**/index.html'],
              },
            },
          ],
          options: {
            concurrency: 100,
          },
        }),
      isEnvDevelopment && new webpack.HotModuleReplacementPlugin(),
      new webpack.DefinePlugin(env.stringified),
      //  isEnvProduction &&
      new MiniCssExtractPlugin({
        filename: 'static/css/[name].[contenthash:8].css',
        chunkFilename: 'static/css/[name].[contenthash:8].chunk.css',
      }),
      isEnvDevelopment && new ReactRefreshWebpackPlugin(),
      isAnalyze && new BundleAnalyzerPlugin(),
      ...(Array.isArray(oslConfig.webpackPlugins)
        ? oslConfig.webpackPlugins
        : oslConfig.webpackPlugins(webpackEnv)),
    ].filter(Boolean),
  }
}
