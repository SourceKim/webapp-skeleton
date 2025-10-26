import { createApp } from 'vue'
import { createPinia } from 'pinia'
import NutUI from '@nutui/nutui-taro'
import '@nutui/nutui-taro/dist/style.css'
import './app.scss'

const App = createApp({
  onShow() {
    // 应用显示时触发
  }
})

// 由构建期在 config/index.ts 的 h5.vitePlugins 中设置 compilerOptions.isCustomElement

App.use(createPinia())
App.use(NutUI)

export default App
