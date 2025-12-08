import { defineConfig, type UserConfigExport } from '@tarojs/cli'
import path from 'path'
import vueFrameworkPlugin from '@tarojs/plugin-framework-vue3'

import devConfig from './dev'
import prodConfig from './prod'

// https://taro-docs.jd.com/docs/next/config#defineconfig-辅助函数
export default defineConfig<'vite'>(async (merge) => {
  // 动态导入 ES Module 插件，避免被 TS 转译为 require()
  const vue = (await eval('import("@vitejs/plugin-vue")')).default

  // 获取环境变量，构建时注入到 process.env
  const getEnvVars = () => {
    const envVars: Record<string, string> = {}
    // 读取所有以 TARO_APP_ 开头的环境变量
    Object.keys(process.env).forEach((key) => {
      if (key.startsWith('TARO_APP_')) {
        envVars[key] = process.env[key] || ''
      }
    })
    return envVars
  }

  const envVars = getEnvVars()
  
  // 创建 define 对象，用于 Vite 构建时替换
  const define: Record<string, string> = {
    'process.env': JSON.stringify(envVars)
  }
  
  // 为每个环境变量单独定义，确保可以正常访问
  Object.keys(envVars).forEach((key) => {
    define[`process.env.${key}`] = JSON.stringify(envVars[key])
  })

  const baseConfig: UserConfigExport<'vite'> = {
    projectName: 'taro-frontend-skeleton',
    date: '2025-3-10',
    designWidth: 750,
    deviceRatio: {
      640: 2.34 / 2,
      750: 1,
      375: 2,
      828: 1.81 / 2
    },
    sourceRoot: 'src',
    outputRoot: 'dist',
    // 配置路径别名，供 Vite Runner 解析
    alias: {
      '@': path.resolve(process.cwd(), 'src')
    },
    sass: {
      resource: [
        path.resolve(process.cwd(), 'src/styles/variables.scss')
      ]
    },
    plugins: [
      vueFrameworkPlugin
    ],
    defineConstants: {
    },
    copy: {
      patterns: [
      ],
      options: {
      }
    },
    framework: 'vue3',
    compiler: 'vite',
    mini: {
      postcss: {
        pxtransform: {
          enable: true,
          config: {

          }
        },
        cssModules: {
          enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
          config: {
            namingPattern: 'module', // 转换模式，取值为 global/module
            generateScopedName: '[name]__[local]___[hash:base64:5]'
          }
        }
      },
    },
    h5: {
      publicPath: '/',
      staticDirectory: 'static',

      miniCssExtractPluginOption: {
        ignoreOrder: true,
        filename: 'css/[name].[hash].css',
        chunkFilename: 'css/[name].[chunkhash].css'
      },
      // 将 isCustomElement 放到 Vite 插件的编译期选项中
      // @ts-expect-error: vitePlugins 为 Taro Vite Runner 的扩展字段，类型定义未覆盖
      vitePlugins: [
        vue({
          template: {
            compilerOptions: {
              isCustomElement: (tag: string) => tag === 'view' || tag === 'text' || tag === 'image'
            }
          }
        }),
        // 自定义插件：定义 process.env 供浏览器环境使用
        {
          name: 'define-process-env',
          config(config) {
            // 在配置阶段添加 define
            if (!config.define) {
              config.define = {}
            }
            Object.assign(config.define, define)
            return config
          }
        }
      ],
      postcss: {
        autoprefixer: {
          enable: true,
          config: {}
        },
        cssModules: {
          enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
          config: {
            namingPattern: 'module', // 转换模式，取值为 global/module
            generateScopedName: '[name]__[local]___[hash:base64:5]'
          }
        }
      },
    },
    rn: {
      appName: 'taroDemo',
      postcss: {
        cssModules: {
          enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
        }
      }
    }
  }

  if (process.env.NODE_ENV === 'development') {
    // 本地开发构建配置（不混淆压缩）
    return merge({}, baseConfig, devConfig)
  }
  // 生产构建配置（默认开启压缩混淆等）
  return merge({}, baseConfig, prodConfig)
})
