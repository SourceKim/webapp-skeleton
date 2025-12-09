// babel-preset-taro 更多选项和默认值：
// https://docs.taro.zone/docs/next/babel-config
module.exports = {
  presets: [
    ['taro', {
      framework: 'vue3',
      ts: true,
      compiler: 'vite',
      // 在开发环境下禁用 useBuiltIns，避免 core-js-pure 的 ESM 导入问题
      // 生产环境构建时会自动处理 polyfill
      useBuiltIns: (process.env.TARO_ENV === 'h5' && process.env.NODE_ENV === 'production') ? 'usage' : false
    }]
  ]
}
