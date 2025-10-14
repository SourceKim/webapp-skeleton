import type { UserConfigExport } from "@tarojs/cli"
import vue from '@vitejs/plugin-vue'

export default {
  mini: {},
  h5: {
    legacy: true,
    vitePlugins: [
      vue({
        template: {
          compilerOptions: {
            isCustomElement: (tag: string) => tag === 'view' || tag === 'text' || tag === 'image'
          }
        }
      })
    ]
  }
} satisfies UserConfigExport<'vite'>
