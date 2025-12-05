import { defineStore } from 'pinia'
import { useLocalStorage, useCssVar, useDark } from '@vueuse/core'
import { watchEffect } from 'vue'
import { themes } from '@/theme'
import type { ThemeKey } from '@/interface/theme'

export const useThemeStore = defineStore('theme', () => {
    const currentTheme = useLocalStorage<string>('current-theme', 'default')
    const darkMode = useDark()
    const themeList = themes
    console.log('themes:', themeList);
    

    // 暗黑模式自动切换 & 加载主题
    watchEffect(() => {
        const theme = themes.find(theme => theme.id === currentTheme.value)
        if (theme) {
            (Object.keys(theme.cssVars) as ThemeKey[]).forEach(key => {
                const value = theme.cssVars[key]
                useCssVar(key, document.documentElement).value = value[darkMode.value ? 'dark' : 'light']
            })
        }
    })

    function setTheme(themeId: string) {
        currentTheme.value = themeId
    }

    return {
        currentTheme,
        darkMode,
        setTheme,
        themeList
    }
})