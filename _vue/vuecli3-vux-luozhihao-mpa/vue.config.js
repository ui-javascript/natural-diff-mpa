const path = require('path')
const configs = require('./const.config')
const utils = require('./mpa.utils')

// 用于做相应的merge处理
const merge = require('webpack-merge')
const {DefinePlugin} = require('webpack')
const CompressionWebpackPlugin = require('compression-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

const isProd = process.env.NODE_ENV === 'production'
const conf = isProd ? configs.build.env : configs.dev.env

const resolve = dir => {
    return path.join(__dirname, dir)
}

// let baseUrl = '/vue/';
let baseUrl = '/';

module.exports = {
    baseUrl: baseUrl,
    outputDir: 'dist',
    productionSourceMap: true,
    pages: utils.setPages({
        // addScript() {
        //     if (isProd) {
        //         return `
        //             <script src="https://s95.cnzz.com/z_stat.php?id=xxx&web_id=xxx" language="JavaScript"></script>
        //         `
        //     }
        //     return ''
        // }
    }),

    /*css: {
        modules: true,
    },*/
    chainWebpack: config => {
        config.module
            .rule('images')
            .use('url-loader')
            .tap(options =>
                merge(options, {
                    limit: 5120,
                })
            )

        config.resolve.alias
            .set('@', resolve('src'))
            .set('_lib', resolve('src/common'))
            .set('_com', resolve('src/components'))
            .set('_img', resolve('src/images'))
            .set('_ser', resolve('src/services'))

        // 公共变量
        config.plugin('define')
            .tap(args => {
                let name = 'process.env'
                args[0][name] = merge(args[0][name], conf)

                return args
            })
    },

    configureWebpack: config => {

        // 这样会直接将 plugins 置空
        // config.plugins = []
        // config.entry = utils.getEntries()

        // 使用 return 一个对象会通过 webpack-merge 进行合并
        // config.plugins.push(
        //     ...utils.htmlPlugin({
        //         addScript() {
        //             // if (process.env.NODE_ENV === 'production') {
        //             //     return `
        //             //         <script src="https://s95.cnzz.com/z_stat.php?id=xxx&web_id=xxx" language="JavaScript"></script>
        //             //     `
        //             // }
        //             return ''
        //         }
        //     }),
        // )

        if (isProd) {
            return {
                plugins: [

                    // 开启 Gzip 压缩
                    new CompressionWebpackPlugin({
                        asset: '[path].gz[query]',
                        algorithm: 'gzip',
                        test: new RegExp(
                            '\\.(js|css)$'
                        ),
                        threshold: 10240,
                        minRatio: 0.8
                    }),

                    // 使用包分析工具
                    new BundleAnalyzerPlugin()
                ]
            }
        }

    },

    devServer: {
        historyApiFallback: {
            rewrites: [
                {from: new RegExp(baseUrl + 'page1'), to: baseUrl + 'page1.html'},
                {from: new RegExp(baseUrl + 'page2'), to: baseUrl + 'page2.html'},
            ]
        },
        // 是否自动打开浏览器页面
        open: true,
        // 指定使用一个 host。默认是 localhost
        host: '127.0.0.1',
        // 端口地址
        port: 8080,
        // 使用https提供服务
        https: false,

        // string | Object 代理设置
        proxy: {
            '/repos': {
                target: 'https://api.github.com',
                changeOrigin: true
                // pathRewrite: {'^/api': ''}
            }
        },
        progress: true,

        // 提供在服务器内部的其他中间件之前执行自定义中间件的能力
        before: app => {
            // `app` 是一个 express 实例
        }
    }
}