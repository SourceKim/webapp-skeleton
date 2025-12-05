import { merge } from 'lodash-es'
import { createI18n } from 'vue-i18n'
import { useLocalStorage } from '@vueuse/core'

// element-plus 语言包
import elZhCn from 'element-plus/es/locale/lang/zh-cn'
import elEn from 'element-plus/es/locale/lang/en'

// 语言包
import zhCn from './locale/zh-cn'
import en from './locale/en'

// 语言图标
import Chinese from './locale/zh-cn.svg'
import English from './locale/en.svg'

// 布局
import { useLayoutStore } from '@/stores/layout'

export declare type LocaleKey = 'zh-cn' | 'zh-tw' | 'en' | 'ja'

export class Locale {
    key: LocaleKey
    //语言名称
    label: string
    //字符预制宽度 像素,只是平均的大致宽度
    charWidth: number[]
    //语言包数据
    locale: object
    //语言图标
    icon: string
  
    constructor(key: LocaleKey, label: string, charWidth: number[], locale: object, icon: string) {
      this.key = key
      this.label = label
      this.charWidth = charWidth
      this.locale = locale
      this.icon = icon
    }
  
    /**
     * 获取当前字符平均宽度，注意只是平均宽度，随当前字体大小调整
     */
    getCharWidth(): number {
      const charWidth = this.charWidth
      let width: number
      const layoutStore = useLayoutStore()
      if (layoutStore.size === 'small') width = charWidth[0]
      if (layoutStore.size === 'default') width = charWidth[1]
      if (layoutStore.size === 'large') width = charWidth[2]
      return width!
    }

}

export const locales: Locale[] = [
    new Locale('zh-cn', '简体中文', [10, 13, 15], merge(zhCn, elZhCn), Chinese),
    new Locale('en', 'English', [6, 7.2, 8.5], merge(en, elEn), English),
]

export function getLocale(key: LocaleKey): Locale {
    const locale = locales.find(i => i.key === key)
    if (!locale) {
        throw new Error(`Locale ${key} not found`)
    }
    return locale
}

const i18n = createI18n({
  globalInjection: true,
  legacy: false,
  locale: useLocalStorage<LocaleKey>('locale', 'zh-cn').value,
  fallbackLocale: 'zh-cn',
  messages: {
    'zh-cn': getLocale('zh-cn').locale as any,
    'en': getLocale('en').locale as any
  }
})

export default i18n