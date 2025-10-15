import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './app.scss'

const App = createApp({
  onShow() {
    // 应用显示时触发
  }
})

// 由构建期在 config/index.ts 的 h5.vitePlugins 中设置 compilerOptions.isCustomElement

App.use(createPinia())

export default App
