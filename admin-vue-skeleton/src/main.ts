import { createApp } from 'vue'
import type { App as VueApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import App from './App.vue'
import router from './router'
import i18n from './i18n'
import '@/styles/index.scss' // 样式引入
import '@/styles/app.scss'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

const app:VueApp<Element> = createApp(App)

// 注册ElementPlusIconsVue
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
app.use(createPinia())
app.use(ElementPlus)
app.use(router)
app.use(i18n)

app.mount('#app')