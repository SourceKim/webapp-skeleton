import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@i': fileURLToPath(new URL('./interface', import.meta.url))
    }
  },
  esbuild: {
    jsxInject: 'import { h } from "vue"',
    jsxFactory: 'h',
    jsxFragment: 'Fragment'
  }
})
