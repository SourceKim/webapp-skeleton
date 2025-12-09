import type { UserConfigExport } from "@tarojs/cli"

export default {
  mini: {},
  h5: {
    devServer: {},
    // 配置 Vite 优化选项，排除 core-js 相关模块避免 ESM 导入问题
    // @ts-expect-error: viteConfig 为 Taro Vite Runner 的扩展字段，类型定义未覆盖
    viteConfig: {
      optimizeDeps: {
        exclude: ['core-js-pure', 'core-js', '@babel/runtime']
      },
      // 配置 resolve，确保正确处理 core-js-pure
      resolve: {
        dedupe: ['core-js-pure']
      }
    }
  }
} satisfies UserConfigExport<'vite'>
