module.exports = {
  chainWebpack: config => {
    config
        .plugin('html')
        .tap(args => {
            args[0].title = "淠史杭输水线路";
            return args;
        })
  },
  productionSourceMap: false,
  publicPath: process.env.NODE_ENV === 'production' ? '/ahjs/psh/' : '/',
  // cli3 代理是从指定的target后面开始匹配的，不是任意位置；配置pathRewrite可以做替换
  devServer: {
    port: '9001',
    proxy: {
        
        // '/ahjs': {
        //     target:  'http://10.34.0.118:8081' ,
        //     changeOrigin: true,
        //     pathRewrite: {
        //     '^/ahjs': 'ahjs' 
        //     }
        // },
        '/dist': {
            target:  'http://10.34.0.118:8081/dist/' ,
            changeOrigin: true,
            pathRewrite: {
            // '^/dist': 'dist' 
            '^/dist': '' 
            }
        },
        '/arcgis': {
            target: 'http://10.34.0.12:6080',
            changeOrigin: true,
            pathRewrite: {
                '^/arcgis': 'arcgis'//process.env.PATH_REWRITE ||
            }
        },
        '/local': {
            target:  'http://127.0.0.1:8080/ahjs/' ,
            changeOrigin: true,
            pathRewrite: {
            '^/local': '' 
            }
        }
    }
  },
  css: {
    loaderOptions: {
      // 给 sass-loader 传递选项
      sass: {
        // @/ 是 src/ 的别名
        // 所以这里假设你有 `src/variables.sass` 这个文件
        // 注意：在 sass-loader v7 中，这个选项名是 "data"
        prependData: `@import "~@/assets/style/index.sass";`
      },
      // 默认情况下 `sass` 选项会同时对 `sass` 和 `scss` 语法同时生效
      // 因为 `scss` 语法在内部也是由 sass-loader 处理的
      // 但是在配置 `data` 选项的时候
      // `scss` 语法会要求语句结尾必须有分号，`sass` 则要求必须没有分号
      // 在这种情况下，我们可以使用 `scss` 选项，对 `scss` 语法进行单独配置
      scss: {
        prependData: `@import "~@/assets/style/index.scss";`
      },
    }
  }
}