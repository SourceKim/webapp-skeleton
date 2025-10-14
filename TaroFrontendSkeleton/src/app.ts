import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './app.scss'

const App = createApp({
  onShow() {
    // 应用显示时触发
  }
})

App.use(createPinia())

export default App
