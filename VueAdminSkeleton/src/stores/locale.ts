import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'
import type { Locale, LocaleKey } from '@/i18n'
import { getLocale } from '@/i18n'

export const useLocaleStore = defineStore('locale', () => {
    const locale = useStorage<LocaleKey>('locale', 'zh-cn')
    const setLocale = (value: LocaleKey) => {
        locale.value = value
    }
    const getCurrentLocale = (): Locale => {
        return getLocale(locale.value)
    }
    return {
        locale,
        setLocale,
        getCurrentLocale
    }
})  