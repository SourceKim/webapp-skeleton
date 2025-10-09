import type { Theme } from '@/interface/theme'

export const yellowTheme: Theme = {
    id: 'yellow',
    label: '黄色',
    cssVars: {
        '--el-bg-color-page': { light: '#f5f5f5', dark: '#252525' },
        '--el-bg-color': { light: '#ffffff', dark: '#1e1e1e' },
        '--el-bg-color-overlay': { light: '#ffffff', dark: '#1d1e1f' },

        '--el-color-primary-dark-2': { light: '#BB8E06', dark: '#EAB308' },
        '--el-color-primary': { light: '#EAB308', dark: '#CA9907' },
        '--el-color-primary-light-3': { light: '#F8C630', dark: '#A87F06' },
        '--el-color-primary-light-5': { light: '#FAD566', dark: '#856505' },
        '--el-color-primary-light-7': { light: '#FBE297', dark: '#634B03' },
        '--el-color-primary-light-8': { light: '#FDF1CE', dark: '#453402' },
        '--el-color-primary-light-9': { light: '#FEF8E6', dark: '#231A01' }
    }
}