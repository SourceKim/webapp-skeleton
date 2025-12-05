import { createApp } from 'vue'
import { createPinia } from 'pinia'
import NutUI from '@nutui/nutui-taro'
import '@nutui/nutui-taro/dist/style.css'
import './app.scss'
import { IconFont } from '@nutui/icons-vue-taro'

const App = createApp({
  onShow() {
    // 应用显示时触发
  }
})

// 由构建期在 config/index.ts 的 h5.vitePlugins 中设置 compilerOptions.isCustomElement

App.use(createPinia())
App.use(NutUI)
// IconFont 不是一个 Vue 插件，不能用 App.use 方式注册，这里采用组件全局注册
App.component('nut-icon', IconFont)

export default App
